const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const router = express.Router();
const Ship = require('./lib/ship.js');
const Player = require('./lib/player.js');
let io;
let tship = null;

//get different routes
const testAPI = require("./routes/testAPI.js");


//middleware
app.use(cors());  

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
        console.log(e)
        newplayer = new Player(socket, e.name);

        socket.emit('onPlayerInit',{ 
           player : { name : newplayer.name, 
            card : null,
            id : null,
            creator: null,} 
        });
    });
    /**
     * the point of this is to join a create room
     */
    socket.on("joinRoom", (e)=>{
        if(tship == null){
            tship = new Ship('temproom', newplayer.socket.id, 'NewTempShip', io);
            console.log(tship.name);
        }
        tship.addPlayer(newplayer);
        onNewPlayerConnect(socket, newplayer);
    })
    /**
     * create a room
     */
    socket.on("createRoom", (e)=>{
        console.log("tried to create a room");
    });

    
   
})

const onNewPlayerConnect=(socket, newplayer)=>{
    console.log("New player "+ newplayer.name +" added ! \n \t Added to ship : "+ tship.roomname);
    
    //On player object being made with the ship
    socket.emit('onRoomInit',{ 
        player : { name : newplayer.name, 
            card : null,
            id : newplayer.socket.id,
            creator: tship.creator}// so need  
    });

    //end of ship, work on thi sas needed
    socket.on('disconnect', (reason) => {
        console.log(reason + ": "+ socket.id);
        if(!tship.inPlay){
            tship.removePrePlayer(newplayer);
            if(tship.isPreEmpty()){
                console.log("Ship is empty, will be deleted");
                tship = null;
                console.log( "Ship "+ tship); 
            }
        }else{
            tship.removePostPlayer(newplayer);
            if(tship.isPostEmpty()){
                console.log("Ship is empty, will be deleted");
                tship = null;
                console.log( "Ship "+ tship); 
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
        if(tship.inPlay){
            tship.removeCommand(cmd.player, cmd.id);
        }
    });

    socket.on("start_game", (e)=>{
        console.log("Game has started, intialize the ship");
        tship.startGamePhase();
    });

    socket.on('dev_gen', (e)=>{
        console.log("Generate a command");
        tship.commandAssigner();
    });
    
    


}