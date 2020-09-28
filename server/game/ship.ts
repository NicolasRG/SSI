import Player = require("./player");
import {v4} from 'uuid';
import {getLogger } from "log4js";
import { CMDMessage, OnGameInitMessage } from "../messages/ShipMessages";
const CommandCenter = require('./commandcenter.js');

const logger = getLogger();
logger.level = "info";


/**
 * This class holds ship info and stores state info of the game
 * eseentialy a game state
 */

class Ship {
    id : String;
    roomname: String;
    creator: String;
    commandpool: Map<any, any>;
    commandmessagepool : Map<any,any>;
    players : Map<String, Player> ;
    health : Number;
    name : String;
    inPlay : boolean;
    io : any; 
    commandInterval : any; 
    listOfPlayerIds : Array<String>;

    /**
     * @param {string} roomname 
     * @param {String} creator 
     * @param {String} name
     * @param {Socket.IO} IO reference
     */
    constructor(roomname, creator, IO){
        this.id= v4();
        this.roomname = roomname;
        this.creator = creator;
        this.commandpool = new Map();//let command pool be a key value pair that that is mapped by the SocketID and assigned to a command ID 
        this.commandmessagepool = new Map();
        this.players  = new Map(); 
        this.health = 100;
        this.inPlay = false;
        logger.info("New ship created");
        this.io = IO;
        this.commandInterval = null;
        this.listOfPlayerIds = [];
    }

    addPlayer(player:Player){
        this.players.set(player.id, player);
        this.listOfPlayerIds.push(player.id);
        this.io.emit("prePlayerList", {
            list : this.getPrePlayerList(),
        });
    }

    removePrePlayer(player:Player){
        this.players.delete(player.id);
        this.listOfPlayerIds = this.listOfPlayerIds.filter( key => key != player.id);
        console.log("Removed "+ player.id +"\n Resulting map "); 
        console.log(this.players);
    }

    //this shoud never happen, only for dev purposes
    removePostPlayer(player:Player){
        this.players.delete(player.id);
        this.listOfPlayerIds = this.listOfPlayerIds.filter( key => key != player.id);
        console.log("Removed "+ player.id +"\n Resulting map "); 
        console.log(this.players);
    }

    /**
     * @returns a bool if the ship has no players
     */
    isPreEmpty(){
        console.log(this.players.size);
        return (this.players.size === 0);
    }

    isPostEmpty(){
        console.log(this.players.size);
        return (this.players.size === 0);
    }

    getPrePlayerList(){
        const list = [];
        this.players.forEach((v,k)=>{
            list.push(v.getName());
        })
        return list;
    }

    /**
     * 
     * @param {Player} player 
     * @param {String} commandid
     * @returns a bool based on whether that user was free to have a command 
     */
    addCommand(player, commandid){
        if(this.commandpool.get(player.id) === null ){
            this.commandpool.set(player.id, commandid);
            return true;
        }else{
            return false;
        }
    }

     /**
     * 
     * @param {Player} player 
     * @param {String} commandid 
     * @returns bool based on whether a command was delted that was in the pool
     */
    removeCommand(player, commandid){
        const cmd = this.commandpool.get(player.id)
        if(cmd !== null && cmd !== undefined){
            if(cmd.id == commandid){
                logger.info(`Correct task!! ${player.id}`);
                this.commandpool.delete(player.id);
                this.removeCMDMessage(this.commandmessagepool.get(player.id));
                logger.info(`Removed player conatining message`);
                this.commandmessagepool.delete(player.id);
                this.players.get(player.id).hasCommand = -1;
                this.correctTaskMessage(player.id);
                return true;
            }else{
                console.log("Not the correct command", cmd, commandid);
                return false;
            }
        }
            console.log("Player doesnt have a command assigned");
            return false;
    }

    
    commandAssigner(){
        //create a way to find a player 
        const playerid = this.rngFindAvaliablePlayer();
        //get the command from the players card
        const player:Player = this.players.get(playerid);
        const cmd =  player.getCommand();
        this.commandpool.set(playerid,cmd);
   
        //now tell a socket that this command has been issued
        //for test purpose tell everyone 
        // this.io.emit('onShipCmd', {msg: player.name + " has command " + cmd.name});
        //change this to tell a random person that is not a the one it is sent to
        const msgPlayerid:String = this.rngFindAvailableMessagePlayer(playerid);
        this.commandmessagepool.set(playerid,msgPlayerid);
        logger.info(`Assigned ${playerid + " : " + player} with ${cmd} +\n
        sent message to${msgPlayerid}`);
        this.sendCMDMessage(msgPlayerid, cmd);
    }

    createCommand(){
        console.log(this.commandpool.size);
        if(this.commandpool.size < 1){ //this limits the size of message in the queue
            this.commandAssigner();
            return true;
        }
        return false;
    }

    sendCMDMessage(playerid:String, cmd:any){
        const cmdMesage:CMDMessage = {
            msg :  "task : " + cmd.name
        } 

        this.players.get(playerid).socket.emit('onShipCmd', cmdMesage); //works :)
    }

    removeCMDMessage(playerid){
        const cmdMesage:CMDMessage = {
            msg :  "!_!"
        } 
        this.players.get(playerid).socket.emit('onShipCmd', cmdMesage); 
    }

    correctTaskMessage(playerid){
        const obj = {correct : true} ;
        this.players.get(playerid).socket.emit('onCorrectTask', obj); 
    }

    /**
     * currently bugged fix later when most descions have been made
     */
    rngFindAvaliablePlayer(){
       //may cause an infinte  loop  :/
       let player = null;
       while(true){
            const key = this.rng(this.players.size);
            player = this.players.get(key);
            if(player.hasCommand == -1){
                return key;
            }
       }
    }

    rngFindAvailableMessagePlayer(playerMessageForId:String){
          //may cause an infinte  loop  :/
       let player:Player = null;
       while(true){
            const key = this.rng(this.players.size);
            player = this.players.get(key);
            if(key !== playerMessageForId && !this.commandmessagepool.has(key)){
                return key;
            }
       }
    }

    //function that covers all start game intializations
    startGamePhase(){
        //create commandcenter to process
        const commandcenter = new CommandCenter();
        //TODO : KEEP AS A MAP USING A UID AS NA IDENTIFIER
        //converted map to array
        const arr = [];

        this.players.forEach((player, key, map)=>{
            
            const card = commandcenter.getCard();
            player.setCard(card);

            const message:OnGameInitMessage = 
                {playerState: {
                    name: player.name,
                    id : player.id,
                    card: player.card
                }};

            player.socket.emit("OnGameInit", message);
        });

        //this.players = arr;
        console.log(this.players);
        this.inPlay = true;

        this.io.emit("shipMsg", {msg : "Game has started"});

        this.commandInterval = setInterval(()=>{
            this.createCommand();
        }, 5000);
        
        return true;
    }
    
    rng(size:number):String{
        let idx = Math.floor(Math.random() * size);
        return this.listOfPlayerIds[idx];
    }

    onDelete(){
        clearInterval(this.commandInterval);
        this.commandInterval = null;
        console.log("Removing interval timer ");
    }


}

export = Ship;