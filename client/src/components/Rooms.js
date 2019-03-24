import React, { Component } from 'react';
import '../stylesheets/Rooms.css';

class Room extends Component{
    constructor(props){
        super(props);
        this.mapRooms = this.mapRooms.bind(this);
        this.state = {
            selected: null,
        }
        this.items = null;
    }

    
    //uhuh wtf never thoguht about creating rooms
    onCreate(){
        this.props.socket.emit("createRoom", {name: this.props.player, room: this.props.player.name+" room"});
    }

    onJoin(){
        if(this.state.selected == null){
            alert("No room selected");
            return;
        }
        this.props.socket.emit("joinRoom", {name: this.props.player.name, room: this.state.selected});
    }

    //just keep a state of the list of rooms
    onClickRoom(e,name, id){
        this.setState({
            selected : name,
        });
        console.log(this.state.selected);
    }
   
    
    mapRooms(){
        console.log(this.props.roomlist);
        if(Object.entries(this.props.roomlist).length === 0 && Object.constructor){
            return <div> Empty </div>
        
        }
        this.items =  this.props.roomlist.map((d,i)=>{
            return <li id ={"room"+i} key = {"room"+i} onClick={(e)=>this.onClickRoom(e,d,i)}> {d} </li>
        })
        return <ul>{this.items}</ul>
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