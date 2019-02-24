import React, {Component} from 'react';
import '../stylesheets/Gridview.css';
//import child components
import CommandAction from './CommandAction.js';
const inputs = [
    {
        id : 0,
        name: "pay the gas bill",
    }, {
        id : 1,
        name: "center visor",
    }, {
        id : 2,
        name: "reinforce shields",
    }, {
        id : 3,
        name: "stop that man",
    }
]


class Gridview extends Component{

    constructor(props){
        super(props);
        this.state = {

        }
        this.list = inputs.map((d,i)=>{
            const click = (e)=>{
                props.socket.emit('Command',  {id: d.id, name: d.name})
            }
            return <CommandAction name = {d.name} onClick = {click}/>
        })
    }
    
    
    render(){
        return <div id="Gridview">
                {this.list}
         </div>

    }
}

export default Gridview
