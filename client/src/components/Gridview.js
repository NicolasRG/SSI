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
    
    
    render(){
         let list = inputs.map((d,i)=>{
            const click = (e)=>{
                this.props.socket.emit('Command',  { player:this.props.player , id: d.id, name: d.name, });//can cause a ddos attack deal later
            }
            return <CommandAction name = {d.name} onClick = {click} key ={d.id}/>
        })
        return <div id="Gridview">
                {list}
         </div>

    }
}

export default Gridview
