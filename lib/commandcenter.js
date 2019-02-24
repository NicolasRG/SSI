
class CommandCenter{
    constructor(){
        //issues cards to players
        this.cmdCards=[ 
            {commands : [{
                        id : 0,
                        name: "pay the gas bill",
                        use : false,
                    }, {
                        id : 1,
                        name: "center visor",
                        use : false,
                    }, {
                        id : 2,
                        name: "reinforce shields",
                        use : false,
                    }, {
                        id : 3,
                        name: "stop that man",
                        use : false,
                    }],
             checkedout : false,
             name : "one" 
            },{commands : [{
                id : 0,
                name: "pay the gas bill",
                use : false,
            }, {
                id : 1,
                name: "center visor",
                use : false,
            }, {
                id : 2,
                name: "reinforce shields",
                use : false,
            }, {
                id : 3,
                name: "stop that man",
                use : false,
            }],
            checkedout : false, 
            name : "two" 
            },{commands : [{
                id : 0,
                name: "pay the gas bill",
                use : false,
            }, {
                id : 1,
                name: "center visor",
                use : false,
            }, {
                id : 2,
                name: "reinforce shields",
                use : false,
            }, {
                id : 3,
                name: "stop that man",
                use : false,
            }],
            checkedout : false,
            name : "three", 
            },{commands : [{
                id : 0,
                name: "pay the gas bill",
                use : false,
            }, {
                id : 1,
                name: "center visor",
                use : false,
            }, {
                id : 2,
                name: "reinforce shields",
                use : false,
            }, {
                id : 3,
                name: "stop that man",
                use : false,
            }],
            checkedout : false,
            name: "four" 
            },
        ]

        this.index = 0;
    }

    getCard(){
        if(this.cmdCards.length > this.index){
            const card = this.cmdCards[this.index];
            this.index ++;
            return card;
        } 
        console.log("No cards left to checkout");
        return false;
    }


}

module.exports = CommandCenter;