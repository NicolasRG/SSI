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
    /**
     * @param {String} SocketID 
     * @param {ID} Name 
     */
    constructor(SocketID, Name){
        this.SocketID = SocketID;
        
        
        if(Name == undefined || Name == null){
            this.name = this.AssignName();
        }else{
            this.name = Name;
        }

        this.hasCommand  = false;
        this.id = null;
        this.card = null;
    }

    //for test purposes only
        //test functions to show some name that isnt just an unreadble id
    AssignName (){
        const rng = Math.floor(Math.random()*5);
        //this.setName(demoNames[rng]);
        return demoNames[rng].name;
    }

    setName(name){
        this.name = name;
    }

    setId(id){
        this.id = id;
    }

    setCard(card){
        this.card = card;
    }


}
module.exports = Player;