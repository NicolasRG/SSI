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


app.use(express.static(path.join(__dirname, "client/build")));


//connect routes to express
//app.use('/testAPI', testAPI);

//serve react app
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
    next();
})

const server = app.listen(80);
console.log("Running at Port 80");

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
    if(clientMap.has(cookie.parse(socket.handshake.headers.cookie).io)||isValidSessionCookie()){

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
    socket.on("nameSubmit",(e)=>{
        //may need to change later on to some global map but for small use it should be fine
        const roomnames:Array<any> = getRoomList();

        const newPlayer = new Player(socket, e.name);
        //add to a map of all clients
        clientMap.set(newPlayer.id, newPlayer);

        const message : OnPlayerInitMessage = {   
            player : { name : newPlayer.name},
            id : newPlayer.id,
            itter : roomnames       //think about changing this to just the map ?
         }

        logger.info(message, "sending room list");
        socket.emit('OnPlayerInit', message);

    });

    /**
     * join a created room
     */
    socket.on("JoinRoom", (e:JoinRoomClientMessage)=>{ 
        const newPlayer = clientMap.get(socket.id);
        logger.info(`Player ${newPlayer.name} joining ${e.ship}`);
        shipMap.get(e.id).addPlayer(newPlayer);
        onNewPlayerConnect(socket, newPlayer, e.id, false);
    
    });
    /**
     * create a room
     */
    socket.on("CreateRoom", (e:CreateRoomClientMessage)=>{
        //implement a way to let the server assigna name based on the user names,  switch to uuid
        if(!shipMap.get(e.name)== undefined){
            socket.emit("createError", { error: true ,msg: "something went wrong in creating room"});
            logger.info("Incorrect createroom error");
            return;
        }

        const newPlayer:Player = clientMap.get(socket.id); 
        const tempShip:Ship = new Ship( e.roomName, socket.id, io);
        tempShip.addPlayer(newPlayer);
        shipMap.set( tempShip.id ,tempShip);

        logger.info(tempShip.id + " : Created ship");
        
        const roomnames = getRoomList();
        

        const message:NewRoomAddedMessage = { 
            itter : roomnames
         }

         logger.info(`made message ${message}`);
         
         socket.emit("NewRoomAdded", message);
        
        onNewPlayerConnect(socket, newPlayer, tempShip.id, true);

    });
   
})

//sets up a new player connection
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
    socket.on('disconnect', (reason) => {
        console.log(reason + ": "+ socket.id);
        if(!shipMap.get(shipKey).inPlay){
            shipMap.get(shipKey).removePrePlayer(newplayer);
            if(shipMap.get(shipKey).isPreEmpty()){
                console.log("Ship is empty, will be deleted");
                shipMap.delete(shipKey);
                console.log( "Ship "+ shipMap.get(shipKey)); 
            }
        }else{
            shipMap.get(shipKey).removePostPlayer(newplayer);
            if(shipMap.get(shipKey).isPostEmpty()){
                console.log("Ship is empty, will be deleted");
                shipMap.get(shipKey).onDelete();
                shipMap.delete(shipKey);
                console.log( "Ship "+ shipMap.get(shipKey)); 
            }
        }
      });

    //test events for socketio calls
    socket.on('hello', (e)=>{
        io.emit('shipMsg', {msg: newplayer.name +" just joined"});
    });
    
    socket.on('Rendered', (e)=>{
        console.log("Component rendered a container " +  socket.id);
    });
    
    socket.on('Command', (cmd)=>{
        console.log(cmd);
        io.emit('shipMsg', {msg: newplayer.name + " did action " + cmd.name});
        //validate the move in the game
        if(shipMap.get(shipKey).inPlay){
            shipMap.get(shipKey).removeCommand(cmd.player, cmd.id);
        }
    });

    socket.on("start_game", (e)=>{
        console.log("Game has started, intialize the ship");
        shipMap.get(shipKey).startGamePhase();
    });

    socket.on('dev_gen', (e)=>{
        console.log("Generate a command");
        //tship.commandAssigner();
        shipMap.get(shipKey).publicCreateCommand();
    });

    /**
     * 
     */
    socket.on("getPrePlayerList", (e)=>{
        console.log("tried to get pre player list");
        socket.emit("prePlayerList",{
            list:shipMap.get(shipKey).getPrePlayerList(),
        })
    });
    
}

// TODO : implement check to see if a cookie is still valid
function isValidSessionCookie(){
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