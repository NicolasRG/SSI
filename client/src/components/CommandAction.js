import React, {Component} from 'react';
import '../stylesheets/CommandAction.css';

class CommmandAction extends Component{
   
    render(){
        return (
        <div className="CommandAction" onClick= {this.props.onClick}>
            <div className = "content">
                {this.props.name}
            </div>    
        </div>)
   }
}

export default CommmandAction;
