import cards from './commandcards.json';

class CommandCenter{

    cmdCards:any ; //needs to be some json type
    index : number ;

    constructor(){
        //issues cards to players
        this.cmdCards= cards;

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