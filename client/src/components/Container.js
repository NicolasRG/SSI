import React, { Component } from 'react';
import "../stylesheets/Container.css"
//import react components
import DialogBox from './DialogBox.js';
import Gridview from './Gridview.js';




class Container extends Component{

    componentDidMount(){
    }

    testClick(e){
        this.props.socket.emit("start_game");
    }

    onDevClick(e){
        this.props.socket.emit("dev_gen");
    }

    render(){
        return <div id = "Container">
                <DialogBox socket = {this.props.socket}/>
                <Gridview socket = {this.props.socket} />
                <button onClick={(e)=>this.testClick(e)}> Test Start</button>
                <button onClick={(e)=>this.onDevClick(e)}> Gen a Command</button>
        </div>
    }
}

export default Container;
