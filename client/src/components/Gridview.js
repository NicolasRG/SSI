import React, { Component } from "react";
import "../stylesheets/Gridview.css";
//import child components
import CommandAction from "./CommandAction.js";

class Gridview extends Component {
  render() {
    let list = this.props.player.card.commands.map((d, i) => {
      const click = e => {
        this.props.socket.emit("Command", {
          player: this.props.player,
          id: d.id,
          name: d.name
        }); //can cause a ddos attack deal later on backend server
      };
      return <CommandAction name={d.name} onClick={click} key={d.id} />;
    });
    return <div id="Gridview">{list}</div>;
  }
}

export default Gridview;
