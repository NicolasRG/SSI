const CommandCenter = require('./commandcenter.js');

/**
 * This class holds ship info and stores state info of the game
 * eseentialy a game state
 */

class Ship {
    /**
     * 
     * @param {string} roomname 
     * @param {String} creator 
     */
    constructor(roomname, creator, name, IO){
        this.roomname = roomname;
        this.creator = creator;
        this.commandpool = new Map();//let command pool be a key value pair that that is mapped by the SocketID and assigned to a command ID 
        this.players = new Map(); 
        this.health = 100;
        this.name = name;
        this.inPlay = false;
        console.log("New ship created");
        this.io = IO;
    }

    addPlayer(Player){
        this.players.set(Player.socket.id, Player); //fix this  ???
    }

    removePrePlayer(Player){
        this.players.delete(Player.socket.id);
        console.log("Removed "+ Player.socket +"\n Resulting map "); 
        console.log(this.players);
    }

    //this shoud never happen, onlty for dev purposes
    removePostPlayer(Player){
        //someArray.splice(x, 1);
        this.players.splice(Player.id, 1);
        console.log("Removed "+ Player.socket +"\n Resulting map "); 
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
        console.log(this.players.length);
        return (this.players.length === 0);
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
                console.log("correct !!")
                this.commandpool.delete(player.id);
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
        const index = this.rngFindAvaliablePlayer();
        //get the command from the players card
        const cmd =  this.players[index].getCommand();
        this.commandpool.set(index,cmd);
        console.log(this.commandpool);
        //now tell a socket that this command has been issued
        //for test purpose tell everyone 
        this.io.emit('onShipCmd', {msg: this.players[index].name + " has command " + cmd.name});
        //also have to tell the individual, do this correctly no test purposes
        this.players[index].socket.emit("onPersonalCMD",  {cmd: cmd}) //works :)
    }

    

    /**
     * currently bugged fix later when most descions have been made
     */
    rngFindAvaliablePlayer(){
       //may cause an infinte  loop  :/
       let index = null;
       let player = null;
       while(true){
            index = this.rng(this.players.length);
            player = this.players[index];
            if(player.hasCommand == -1){
                return index;
            }
       }
    }

    //function that covers all start game intializations
    startGamePhase(){
        //create commandcenter to process
        const commandcenter = new CommandCenter();
        //convert map to array
        const arr = [];
        this.players.forEach((value, key, map)=>{
            value.setCard(commandcenter.getCard());
            value.setId(arr.length);
            arr.push(value);
            value.socket.emit("onGameInit", {playerState: {
                name: value.name,
                id : value.id,
                card: value.card
            }});
        });
        this.players = arr;
        console.log(this.players);
        this.inPlay = true;
        this.io.emit("shipMsg", {msg : "Game has started"});
        return true;
    }
    
    rng(size){
        return Math.floor(Math.random()*size);
    }


}

module.exports = Ship;