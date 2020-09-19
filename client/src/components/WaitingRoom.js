import React, {Component} from 'react';
import DynamicButton from "./DynamicButton.js";
import '../stylesheets/WaitingRoom.css';

class WaitingRoom extends Component{
    constructor(props){
        super(props);
        this.state={
            listsize : 0,//size of players in the room
        }
    }


    startClick(e){
        this.props.socket.emit("start_game");
    }

    onDevClick(e){
        this.props.socket.emit("dev_gen");
    }

    leaveClick(e){
        console.log("Tried to leave");
        this.props.socket.emit("getPrePlayerList");
    }


    render(){
        return <div id="WaitingRoom">
                    <div id = "WaitingRoomTitle">
                        Waiting on everyone to join
                    </div>
                    <div className={"waiting_room_players_list"}>
                        {this.props.waitinglist.map((d, i)=>{
                            return <div className = {"player_in_waiting_room"}> {d + "\n"}</div>
                        })}           
                    </div>
                    <div className = {"waiting_room_button_list"}>
                        { (this.props.player.isCreator) && 
                        <DynamicButton  
                        content = "Start Game"
                        onClick = {(e)=>this.startClick(e)}
                        class = "default_button"
                        />}
                        
                        <DynamicButton  
                            content = "Leave Game"
                            onClick = {(e)=>this.leaveClick(e)}
                            class = "default_button"
                            />
                    </div>
            </div>
    }
}

export default WaitingRoom;