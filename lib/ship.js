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
    constructor(roomname, creator, name){
        this.roomname = roomname;
        this.creator = creator;
        this.commandpool = new Map();//let command pool be a key value pair that that is mapped by the SocketID and assigned to a command ID 
        this.players = new Map(); 
        this.health = 100;
        this.name = name;
        this.inPlay = false;
        console.log("New ship created");
    }

    addPlayer(Player){
        this.players.set(Player.SocketID, Player); 
    }

    removePrePlayer(Player){
        this.players.delete(Player.SocketID);
        console.log("Removed "+ Player.SocketID +"\n Resulting map "); 
        console.log(this.players);
    }

    //this shoud never happen, onlty for dev purposes
    removePostPlayer(Player){
        //someArray.splice(x, 1);
        this.players.splice(Player.id, 1);
        console.log("Removed "+ Player.SocketID +"\n Resulting map "); 
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
        if(this.commandpool.get(player.SocketID) === null ){
            this.commandpool.set(player.SocketID, commandid);
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
        const cmd = this.commandpool.get(player.SocketID)
        if(cmd !== null){
            if(cmd = commandid){
                this.commandpool.delete();
                return true;
            }else{
                console.log("Not the correct command");
                return false;
            }
        }
            console.log("Player doesnt have a command assigned");
            return false;
    }

    
    commandAssigner(){
        //create a way to find a player 
        const player = this.rngFindAvaliablePlayer();
        //create a way to get a command
    }

    rngFindAvaliablePlayer(){
       //may cause an infinte  loop  :/
       let index = null;
       let player = null;
       while(true){
            index = this.rng(this.players.length);
            player = this.players[index];
            if(!player.hasCommnad){
                return this.players[index];
            }
       }
    }

    //function that covers all start game intializations
    startGamePhase(){
        const arr = [];
        this.players.forEach((value, key, map)=>{
            value.setId(arr.length);
            arr.push(value);
        });
        this.players = arr;
        console.log(this.players);
        this.inPlay = true;

        return true;
    }
    
    rng(size){
        return Math.floor(Math.random()*size);
    }


}

module.exports = Ship;