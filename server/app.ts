const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const router = express.Router();
import {getLogger } from "log4js";
import Ship from './game/ship';
import Player from './game/player';
import { OnPlayerInitMessage, OnValidReconnectMessage, NewRoomAddedMessage, RoomItem, OnRoomInitMessage }  from './messages/ServerSettupMessages';
import { JoinRoomClientMessage, CreateRoomClientMessage } from './messages/ClientMessage';
import {createRoomEvent, joinRoomEvent, nameSubmitEvent} from './socketEvents/settupEvents';
import { getPrePlayerList, onDisconnect } from "./socketEvents/roomEvents";
import { onCommand } from "./socketEvents/gameEvents";
const cookie = require('cookie');

let io;
const logger = getLogger();
logger.level = "info";
let shipMap = new Map();

//Key value pair of cookie and room info player may have been a part of
let clientMap = new Map();

//get different routes
//const testAPI = require("./routes/testAPI.js");


//middleware
//app.use(cors());  
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.use(express.static(path.join(__dirname, "../client/build")));


//connect routes to express
//app.use('/testAPI', testAPI);

//serve react app
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
    next();
})

const server = app.listen(process.env.PORT);
console.log(`Running at Port ${process.env.PORT}`);

//settup socketio

io = require('socket.io').listen(server, {
    origins: '*:*',
});
//set socketIO to be used in routes(may not work)
app.set('socketio', io);

io.on('connection', (socket)=>{
    const oldId = cookie.parse(socket.handshake.headers.cookie).io;
    logger.info("On handshake old cookie:" + oldId);
    logger.info("On handshake new cookie:" + socket.id);
    
    //if client reconnects with a valid game going on update the
    //token/player map
    if(clientMap.has(cookie.parse(socket.handshake.headers.cookie+"").io)||isValidSessionCookie(oldId)){

        //reset client
        const player:Player  = clientMap.get(oldId);
        clientMap.delete(oldId);
        clientMap.set(socket.id, player);
        //emit valid reconnect signal 
        const message:OnValidReconnectMessage = {
            id : player.id,
            player : {
                name :player.name
            },
            card : player.card
        }

        socket.emit("ValidReconnect", message);
    }

  
    /**
     * this is the start off every client side and assume that a name is all you need to create
     * a ship and a player
     */
    socket.on("nameSubmit", (e)=>nameSubmitEvent(e,socket, clientMap, getRoomList));

    /**
     * join a created room
     */
    socket.on("JoinRoom", (e)=>joinRoomEvent(e, socket, clientMap, shipMap, onNewPlayerConnect));
    /**
     * create a room
     */
    socket.on("CreateRoom", (e:CreateRoomClientMessage)=> createRoomEvent(e, socket, io, clientMap, shipMap, getRoomList, onNewPlayerConnect));
});

//sets up a new player in a room, adds listener for the rest of the game pretty much
const onNewPlayerConnect=(socket, newplayer : Player, shipKey:String, creator : Boolean)=>{
    logger.info(`New player added to ship ${shipKey} : ${newplayer.name}`);
    
    //On player object being made with the ship
    const message:OnRoomInitMessage  = { 
        player : { name : newplayer.name, 
            card : null,
            id : newplayer.socket.id,
            isCreator : creator}
    };

    socket.emit('OnRoomInit', message);

    //end of ship, work on this as needed
    socket.on('disconnect', (reason) => onDisconnect(reason, socket, shipMap, shipKey, newplayer));

    socket.on("start_game", (e)=>{
        console.log("Game has started, intialize the ship");
        shipMap.get(shipKey).startGamePhase();
    });

    socket.on("getPrePlayerList", (e)=>getPrePlayerList(e,socket, shipMap, shipKey));
    

    //on getting command from client
    socket.on('Command', (cmd)=>onCommand(cmd, io, shipMap, shipKey, newplayer));
    
}

// TODO : implement check to see if a cookie is still valid
function isValidSessionCookie(cookie:Object){
    if(typeof cookie == "undefined"){
        return true;
    }
    return false;
}

function getRoomList():Array<any> {
    
    const roomnames:Array<RoomItem> = [];

    shipMap.forEach((ship:Ship, id:string)=>{
        const roomObj:RoomItem = {id :id, ship : ship.roomname};
        logger.info(roomObj);
        roomnames.push(roomObj);
    });   

    return roomnames;
}