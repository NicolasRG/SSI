import React, {Component} from "react";
import '../stylesheets/OpenRoomView.css';

import NameInput from './NameInput.js';

class OpenRoomView extends Component{

    constructor(props){
        super(props);
        this.state = {
        }
    }

    render(){
        return <div id = {"OpenRoomView"}>
                <NameInput socket={this.props.socket}/>

            </div>
    }
}
export default OpenRoomView;