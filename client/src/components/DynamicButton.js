import React, { Component } from 'react';
import "../stylesheets/DynamicButton.css"

class DynamicButton extends Component{

    

    render(){
        return <div
        style = {this.props.style}
        id = {this.props.ButtonId}
        className = {this.props.class}
        onClick = {(e)=>{this.props.onClick(e)}}
        >
         <span id = "DynamicButtonText"> {this.props.content} </span>
        </div>
    }
}

export default DynamicButton;