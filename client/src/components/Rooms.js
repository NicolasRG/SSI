import React, { Component } from 'react';
import '../stylesheets/Rooms.css';

class Room extends Component{
    constructor(props){
        super(props);
        this.mapRooms = this.mapRooms.bind(this);
        this.state = {
            selected: null,
            roomsHeight : null,
            roomsWidth : null,
            loaded : false,
        }
        this.items = null;
        this.calcRoomDims = this.calcRoomDims.bind(this);;
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
   
    componentDidMount(){
        console.log(document.getElementById("Rooms"), "carb");
        this.calcRoomDims();
        window.addEventListener("resize", this.calcRoomDims);
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.calcRoomDims);
    }

    calcRoomDims(){
        const roomDiv = document.getElementById("Rooms");
        const height =  Math.floor(roomDiv.clientHeight*.85) - 20;
        const width = roomDiv.clientWidth - 20;
        this.setState({
                roomsHeight :  height,
                roomsWidth :  width,
                loaded : true,
        });
    }
    
    mapRooms(){
        if(this.state.loaded === false){
           return <div > Loading </div>
        }
        console.log(this.props.roomlist);
        //get size of the div
        /*const roomDiv = document.getElementById("Rooms");
        const height =  Math.floor(roomDiv.clientHeight*.85) - 20;
        const width = roomDiv.clientWidth - 20;
        */

        const openRoomsStyle ={
            border: "1px dotted white",
            //width : "calc(100% - 20px)",
            width: this.state.roomsWidth+"px",
            backgroundColor: "rgb(19, 111, 187)",   
            //height: "calc(85% - 20px)",//change this to be js calculation, not css
            height: this.state.roomsHeight+"px",
            margin: "10px",
        }

        if(Object.entries(this.props.roomlist).length === 0 && Object.constructor){
            return <div className = {"openRooms"} style = {openRoomsStyle}> Empty </div>
        
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
        //generate style 
        return <div className = {"openRooms"} style={openRoomsStyle} >
            {this.items}</div>
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