import React, { Component } from 'react';
import "../stylesheets/DynamicButton.css"

class DynamicButton extends Component{

    

    render(){
        return <div className ="DynamicButton"
        style = {this.props.style}
        id = {this.props.ButtonId}
        onClick = {(e)=>{this.props.onClick(e)}}
        >
         <span id = "DynamicButtonText"> {this.props.content} </span>
        </div>
    }
}

export default DynamicButton;