import React, {Component} from 'react';
import '../stylesheets/WaitingRoom.css';

class WaitingRoom extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }


    startClick(e){
        this.props.socket.emit("start_game");
    }

    onDevClick(e){
        this.props.socket.emit("dev_gen");
    }

    render(){
        return <div id="WaitingRoom">
                Everythings pointless
                { (this.props.player.creator === this.props.player.id) && 
                    <button onClick= {(e)=>this.startClick(e)}> Start Game</button>}
                <button> Leave game </button>
            </div>
    }
}

export default WaitingRoom;