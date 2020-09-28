import React, { Component } from 'react';
import '../stylesheets/Rooms.css';
import '../stylesheets/Button.css';
import DynamicButton from './DynamicButton';

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
        this.calcRoomDims = this.calcRoomDims.bind(this);
    }

    
    //defaults to  "<usernames>'s Ship"
    onCreate(){
        this.props.socket.emit("CreateRoom", {name: this.props.player.name, 
            roomName: `${this.props.player.name}'s Room`
        });

      
    }

    onJoin(e,d,i){
        this.props.socket.emit("JoinRoom", d);
    }

    //just keep a state of the list of rooms
    onClickRoom(e,name, id){
        this.setState({
            selected : name,
        });
        console.log(this.state.selected);
    }
   
    componentDidMount(){
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

        const openRoomsStyle ={
            width: this.state.roomsWidth+"px",
            height: this.state.roomsHeight+"px",
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
            {d.ship}
            <DynamicButton content="join"
                onClick = {(e)=>{this.onJoin(e,d,i)}} 
                class = { "joinButton default_button"} 
                />
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
                {/*<button onClick={(e)=>{this.onCreate(e)}} id={"createButton"} > Create </button>*/}
                    <DynamicButton
                        content  = "Create"
                        ButtonId = "createButton"
                        onClick ={(e)=>{this.onCreate(e)}}
                        class= {"default_button"}
                        style = {{

                        }}

                    />
            </div>
    }

}



export default Room;