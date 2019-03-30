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
            <div className="CenteredContent">
                   <NameInput socket={this.props.socket}/>
             </div>      
            </div>
    }
}
export default OpenRoomView;