import {getLogger } from "log4js";
import { NewRoomAddedMessage, OnPlayerInitMessage } from "../messages/ServerSettupMessages";
import Player from '../game/player';
import Ship from "../game/ship";
import { CreateRoomClientMessage, JoinRoomClientMessage } from "../messages/ClientMessage";
const logger = getLogger();
logger.level = "info";


export let nameSubmitEvent = async (e, socket , clientMap:Map <String, Player>, getRoomList:Function)=>{
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
}

/**
     * join a created room
     */
export let joinRoomEvent = async (e :JoinRoomClientMessage, socket, clientMap:Map<String, Player>, shipMap:Map<String, Ship>, onNewPlayerConnect:Function)=>{
    const newPlayer = clientMap.get(socket.id);
    logger.info(`Player ${newPlayer.name} joining ${e.ship}`);
    shipMap.get(e.id).addPlayer(newPlayer);
    onNewPlayerConnect(socket, newPlayer, e.id, false);
}

export let createRoomEvent = async(e:CreateRoomClientMessage, socket, io, clientMap:Map<String,Player>, shipMap:Map<String, Ship>, getRoomList:Function, onNewPlayerConnect:Function)=>{
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
}