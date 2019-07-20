import React, { Component } from "react";
import "../stylesheets/Container.css";
//import react components
import InShip from "./InShip.js";

//import logo from '../imgs/logo.svg';
import OpenRoomView from "./OpenRoomView.js";
import Rooms from "./Rooms.js";
import WaitingRoom from "./WaitingRoom.js";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: null, // tansfomr to object later ?
      personalMsg: "",
      shipMsg: "",
      cmdHolder: null,
      stage: "start_menu", // start_menu, join_room, waiting_room, game_room
      roomlist: [],
      waitinglist: [],
      navMessage : "SSI Game"
    };

    this.cmdHolder = null; //may not need
    this.gameStage = this.gameStage.bind(this);
  }

  //make this chronological based on the the stage of creating game
  componentDidMount() {
    this.props.socket.on("onPlayerInit", e => {
      console.log(e.itter);
      this.setState({
        player: e.player,
        stage: "join_room",
        roomlist: e.itter,
        navMessage : "Open Rooms" , 
      });
    });

    this.props.socket.on("newRoomAdded", (e)=>{
      console.log(e);
      this.setState({
        roomlist: e.itter,
      });
    });

    /**
     * on new room being add to the queue
     */
    this.props.socket.on("roomList",(d)=>{
      this.setState({
        roomlist: d.itter,
      })
    });

    this.props.socket.on("onRoomInit", e => {
      this.setState({
        stage: "waiting_room",
        player: e.player,
        navMessage : "Waiting Room" , 
      });
    });

    this.props.socket.on("onGameInit", d => {
      this.setState({
        player: d.playerState,
        stage: "game_room",
        navMessage : "In Play" , 
      });

      console.log(d.playerState);
    });

    this.props.socket.on("onShipCmd", d => {
      this.setState({
        shipMsg: d.msg
      });
    });

    /**
     * Litsener to update the update the list of user in the waiting room 
     */   
    this.props.socket.on("prePlayerList",(d)=>{
      console.log(d);
      this.setState({
        waitinglist : d.list, 
      })
    })

    /*this listener is essentially hidden, it just lets the client know that its waiting on the 
        correct move to be done.
        will be an laert for dev purposes
        */

    this.props.socket.on("onPersonalCMD", d => {
      this.setState({
        cmdHolder: d
      });

      this.cmdHolder = d;
      console.log(d);
    });
  }

  testClick(e) {
    this.props.socket.emit("start_game");
  }

  onDevClick(e) {
    this.props.socket.emit("dev_gen");
  }

  /* this function will decide if a button is correct and worth sending
   */
  onClickCMDValidator(e, id) {
    console.log(this.state.cmdHolder);
    if (this.state.cmdHolder == null) return;
    if (id === this.state.cmdHolder.id) {
      this.props.socket.emit("Command", { id: this.id, name: this.name });
    }
  }

  gameStage() {
    if (this.state.stage === "start_menu") {
      return <OpenRoomView socket={this.props.socket} />;
    } else if (this.state.stage === "join_room") {
      return (
        <Rooms
          socket={this.props.socket}
          player={this.state.player}
          roomlist={this.state.roomlist}
        />
      );
    } else if (this.state.stage === "waiting_room") {
      return (
        <WaitingRoom socket={this.props.socket} player={this.state.player}  waitinglist ={this.state.waitinglist}/>
      );
    } else if (this.state.stage === "game_room") {
      return <InShip socket={this.props.socket} player={this.state.player} />;
    }
  }

  render() {
    const activeScreen = this.gameStage();
    return <div id="Container">
    <header className="App-header">
          {
            this.state.navMessage
          }
        </header>
    {activeScreen}
    </div>;
  }
}

export default Container;
