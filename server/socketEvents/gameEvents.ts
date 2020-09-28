import {getLogger } from "log4js";
import {OnRoomInitMessage } from "../messages/ServerSettupMessages";
import Player from '../game/player';
import Ship from "../game/ship";
import {} from "../messages/ClientMessage";
const logger = getLogger();
logger.level = "info";

export const onCommand = async (cmd:any, io:any, shipMap:Map<String, Ship>, shipKey:String, player:Player)=>{
    logger.info(cmd);
    
    //io.emit('shipMsg', {msg: player.name + " did action " + cmd.name});
    
    //validate the move in the game
    if(shipMap.get(shipKey).inPlay){
        shipMap.get(shipKey).removeCommand(cmd.player, cmd.id);
    }
}