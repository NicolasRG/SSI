import React, {Component} from 'react';
import '../stylesheets/InShip.css';

import DialogBox from './DialogBox.js';
import Gridview from './Gridview.js';

class InShip extends Component{
    constructor(props){
        super(props)
        this.state = {

        };
    }

    onDevClick(e){
        this.props.socket.emit("dev_gen");
    }

    render(){
        return <div id = "InShip">
                <DialogBox socket={this.props.socket}/>
                <Gridview socket={this.props.socket} player={this.props.player}/>
                {/*<button onClick={(e)=>this.onDevClick(e)}> Gen a Command</button>*/}
            </div>
    }

}

export default InShip;