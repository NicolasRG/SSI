import React, {Component} from "react";
import '../stylesheets/NameInput.css';

class NameInput extends Component{

    constructor(props){
        super(props);
        this.state = {
            name:""
        }
    }

    onSubmitName(e){
        e.preventDefault();
        this.props.socket.emit("nameSubmit", {name: this.state.name});
    }

    onInput(e){
        
        if (e.keyCode === 13) {
          e.preventDefault();
          this.onSubmitName();
        }
        this.setState({
            name: e.target.value,
        })
    }

    render(){
        return <div id = {"NameInput"}>
                <div>
                    What Is Your Name
                </div>
                <form onSubmit={(e)=>this.onSubmitName(e)}>
                    <input 
                        type="text" 
                        autoComplete= "off" 
                        value = {this.state.name}
                        onChange = {(e)=>this.onInput(e)}
                        onSubmit = {(e)=>this.onSubmitName(e)}
                        id= "nameBox"
                        >

                    </input>
                    <button 
                    id = "nameButton"
                    onClick = {(e)=>this.onSubmitName(e)}>
                    Go  
                    </button>
                </form>

            </div>
    }
}
export default NameInput;