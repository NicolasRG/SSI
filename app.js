const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const router = express.Router();
const Ship = require('./lib/ship.js');
const Player = require('./lib/player.js');
let io;
let shipMap = new Map();

//get different routes
const testAPI = require("./routes/testAPI.js");


//middleware
//app.use(cors());  
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.use(express.static(path.join(__dirname, "client/build")));


//connect routes to express
app.use('/testAPI', testAPI);

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
    
    //handles timingout clients
    //setTimeout(() => socket.disconnect(true), 60000);
    
    //create player and assign it to ship, test purposes only 
    
   let newPlayer; 
  
    /**
     * this is the start off ever client side and assume that a name is all you need to create
     * a ship and a player
     */
    socket.on("nameSubmit",(e)=>{
        //may need to change later on to some global map but for small use it should be fine
        const roomnames = [];
        shipMap.forEach((value,key)=>{
            roomnames.push(key);
            //console.log(key,":  this is the key");
        });
        newPlayer = new Player(socket, e.name);
        const obj = { 
            player : { name : newPlayer.name, 
             card : null,
             id : null,
             creator: null},
            itter : roomnames
         }

         console.log(obj, "sending room list");
        socket.emit('onPlayerInit',obj);

    });
    /**
     * the point of this is to join a create room
     */
    socket.on("joinRoom", (e)=>{
        /*if(tship == null){
            console.log(tship.name);
        }
        tship.addPlayer(newPlayer);
        onNewPlayerConnect(socket, newPlayer, newPlayer.socket.id);*/
        console.log(e);
        shipMap.get(e.room).addPlayer(newPlayer);//not getting the correct room back >?
        onNewPlayerConnect(socket, newPlayer, e.room);
    })
    /**
     * create a room
     */
    socket.on("createRoom", (e)=>{
        //implement a way to let the server assigna name based on the user names
        if(!shipMap.get(e.name)== undefined){
            socket.emit("createError", {msg: "somethig went wrong"});
            console.log("Incorrect createroom error");
            return;
        }


        const tempShip = new Ship( e.room, newPlayer.socket.id, e.room, io);
        tempShip.addPlayer(newPlayer);
        shipMap.set( tempShip.roomname ,tempShip);
        console.log(tempShip, "Created ship");
        
        const roomnames = [];
        shipMap.forEach((value,key)=>{
            roomnames.push(key);
            //console.log(key,":  this is the key");
        });

        const obj = { 
            itter : roomnames
         }
        socket.emit("newRoomAdded", obj);
        onNewPlayerConnect(socket, newPlayer, tempShip.roomname);
    });
   
})

//figure out how to implement this 
const onNewPlayerConnect=(socket, newplayer, shipKey)=>{
    console.log("New player "+ newplayer.name +" added ! \n \t Added to ship : "+ shipKey);
    
    //On player object being made with the ship
    socket.emit('onRoomInit',{ 
        player : { name : newplayer.name, 
            card : null,
            id : newplayer.socket.id,
            creator: shipMap.get(shipKey).creator}// so need  
    });

    //end of ship, work on thi sas needed
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

//function to a list of room names