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
        this.props.socket.emit("createRoom", {name: this.props.player, room: this.props.player.name});
    }

    onJoin(e,d,i){
        this.props.socket.emit("joinRoom", {name: this.props.player.name, room: d});
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
            return <div className = {"openRooms"}> Empty </div>
        
        }
        this.items =  this.props.roomlist.map((d,i)=>{
            let color = false;
            if(this.state.selected === d){
                color = true;
            }
            return <div id ={"room"+i} key = {"room"+i} 
            className = {color? "activeRoom room": "nonActiveRoom room"} 
            onClick={(e)=>this.onClickRoom(e,d,i)} > 
            {d} 
            <button onClick={(e)=>{this.onJoin(e, d, i)}} className= {"joinButton"}> Join </button>
            </div>
        })
        return <div className = {"openRooms"}>{this.items}</div>
    }

    render(){

        return <div id= "Rooms">
                <div id = "Rooms_Person_Info">
                    <div id= "RoomsName"> {this.props.player.name}</div>
                     <div id = "RoomListDiv"> Room lists </div>
                 </div>
                 {this.mapRooms()}
                <button onClick={(e)=>{this.onCreate(e)}} id={"createButton"} > Create </button>
            </div>
    }

}



export default Room;