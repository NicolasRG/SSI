import React, {Component} from "react";
import '../stylesheets/NameInput.css';
import DynamicButton from  './DynamicButton.js';
//import { CSSTransition } from 'react-transition-group';

import ButtonCSS from  './ButtonCSS.js';

class NameInput extends Component{

    constructor(props){
        super(props);
        this.state = {
            name:"",
            showButton : false
        }
    }

    onSubmitName(e){
        e.preventDefault();
        if(!this.state.showButton){
            return;
        }
        this.props.socket.emit("nameSubmit", {name: this.state.name});
    }

    onInput(e){
        if (e.keyCode === 13) {
          e.preventDefault();
          //this.onSubmitName();
        }
        console.log(typeof e.target.value)
        let show = true;

        if(e.target.value.length === 0){
            show = false;}
        this.setState({
            name: e.target.value,
            showButton : show});

        
    }

    render(){
        return <div id = {"NameInput"}>
                <div id = {"NameTitle"}>
                    What Is Your Name
                </div>
                <form onSubmit={(e)=>this.onSubmitName(e)}
                id = {"NameForm"}
                >
                    <input 
                        type="text" 
                        autoComplete= "off" 
                        value = {this.state.name}
                        onChange = {(e)=>this.onInput(e)}
                        //onSubmit = {(e)=>this.onSubmitName(e)}
                        id= "nameBox"
                        >

                    </input>
                    <ButtonCSS showButton = {this.state.showButton}
                        baseStyle = {{
                            "opacity":"0",
                            "pointer-events": "none",
                        }}
                        nameOnKeyFrame = {"show"}
                        nameOffKeyFrame = {"unShow"}
                        duration = {".5s"}
                    >     
                        <DynamicButton
                            style= {{       
                            "width":"100%",
                            "height" : "7vmin",
                            "lineHeight" : "2",
                            }}
                            class = "default_button"
                            content = "GO!"
                            onClick = {(e)=>this.onSubmitName(e)}
                        >
                        </DynamicButton>   
                    </ButtonCSS>    
                </form>

            </div>
    }
}
export default NameInput;