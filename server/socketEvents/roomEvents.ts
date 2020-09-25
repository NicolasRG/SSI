import {getLogger } from "log4js";
import {OnRoomInitMessage } from "../messages/ServerSettupMessages";
import Player from '../game/player';
import Ship from "../game/ship";
import {} from "../messages/ClientMessage";
const logger = getLogger();
logger.level = "info";


export let onDisconnect = async (reason, socket, shipMap:Map<String, Ship>, shipKey:String, player:Player)=>{
        logger.info(reason + ": "+ socket.id);
        if(!shipMap.get(shipKey).inPlay){
            shipMap.get(shipKey).removePrePlayer(player);
            if(shipMap.get(shipKey).isPreEmpty()){
                logger.info("Ship is empty, will be deleted");
                shipMap.delete(shipKey);
                logger.info( "Ship "+ shipMap.get(shipKey)); 
            }
        }else{
            shipMap.get(shipKey).removePostPlayer(player);
            if(shipMap.get(shipKey).isPostEmpty()){
                logger.info("Ship is empty, will be deleted");
                shipMap.get(shipKey).onDelete();
                shipMap.delete(shipKey);
                logger.info( "Ship "+ shipMap.get(shipKey)); 
            }
        } 
}

export const getPrePlayerList = async(e:any, socket:any, shipMap:Map<String, Ship>,shipKey:String)=>{
    socket.on("getPrePlayerList", (e)=>{
        logger.info("tried to get pre player list");
        socket.emit("prePlayerList",{
            list:shipMap.get(shipKey).getPrePlayerList(),
        })
    });
}