import React, {Component} from "react";
import '../stylesheets/NameInput.css';
import DynamicButton from  './DynamicButton.js';
//import { CSSTransition } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';

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
                <form onSubmit={(e)=>e.preventDefault()}
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
                            <CSSTransition
                                classNames="NameButton"
                                timeout={500}
                                unmountOnExit
                                in={this.state.showButton}
                                >    
                                <DynamicButton
                                style= {{       
                                "width":"100%",
                                "backgroundColor": "rgba(75,75,75)",
                                "height" : "7vmin",
                                "lineHeight" : "2",
                                }}
                                content = "GO!"
                                onClick = {(e)=>this.onSubmitName(e)}
                                //ButtonId = {this.state.showButton ? "NameButtonActive": "NameButtonNonActive"}
                                >
                            </DynamicButton>
                        </CSSTransition>   
                </form>

            </div>
    }
}
export default NameInput;