import { v4 as uuidv4 } from 'uuid';
const  demoNames = [
    {
        name: "Red"
    }, {
        name: "Angel"
    }, {
        name: "Kirk"
    }, {
        name: "Jodie"
    }, {
        name: "Mine"
    },
]

class Player{
    
    name : String;
    socket : any;
    hasCommand : Number; //chan
    hasMessage : Number;
    id : any ; // uuid type ?
    card : any ; //some type of object
    /**
     * @param {String} SocketID 
     * @param {ID} Name 
     */
    constructor(SocketI, Name){
        this.socket = SocketI;
        
        if(Name == undefined || Name == null){
            this.name = this.AssignName();
        }else{
            this.name = Name;
        }

        this.hasCommand  = -1;
        this.hasMessage  = -1;
        this.id = SocketI.id;
        this.card = null;
    }

    //for test purposes only
        //test functions to show some name that isnt just an unreadble id
    AssignName (){
        const rng = Math.floor(Math.random()*5);
        return demoNames[rng].name;
    }

    setName(name){
        this.name = name;
    }

    setCard(card){
        this.card = card;
    }

    //issue a command based of the card
    getCommand(){
        const num = this.rng(4);
        this.hasCommand = num;
        this.card.commands[num].use = true;
        return this.card.commands[num];
    }

    getName(){
        return this.name;
    }

    removeCommand(){
        this.hasCommand = -1;
    }

    private rng(size){
        return Math.floor(Math.random()*size);
    }


}
export = Player;