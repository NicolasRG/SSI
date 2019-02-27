import React, { Component } from 'react';
import '../stylesheets/Rooms.css';

class Room extends Component{
    constructor(props){
        super(props);

        this.state = {
            list : ["NewTempShip"]
        }

        this.mapRooms = this.mapRooms.bind(this);

    }

    mapRooms(){
        const items =  this.state.list.map((d,i)=>{
            return <li key = {"room"+i}> d </li>
        })
        return <ul>{items}</ul>
    }
    
    //uhuh wtf never thoguht about creating rooms
    onCreate(){
        this.props.socket.emit("createRoom", {name: this.props.player, room: "NewTempShip"});
        alert("Yup, this does nothing");
    }

    onJoin(){
        this.props.socket.emit("joinRoom", {name: this.props.player.name, room: "NewTempShip"});
    }

    render(){

        return <div id= "Rooms">
                <div> {this.props.player.name}</div>
                 <div> Room lists </div>
                 {this.mapRooms()}
                <button onClick={(e)=>{this.onJoin(e)}}> Join </button>
                <button onClick={(e)=>{this.onCreate(e)}}> Create </button>
            </div>
    }

}

export default Room;