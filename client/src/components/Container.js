import React, { Component } from 'react';
import "../stylesheets/Container.css"
//import react components
import DialogBox from './DialogBox.js';
import Gridview from './Gridview.js';




class Container extends Component{

    constructor(props){
        super(props);
        this.state = {
            player: null,// tansfomr to object later ?
            personalMsg : "",
            shipMsg : "",
            cmdHolder : null,
        }
        this.personalMsg = "";
        this.shipMsg = "";
        this.cmdHolder = null; //may not need
    }

    componentDidMount(){
        this.props.socket.on('personalMsg', (d)=>{
            this.setState({
                personalMsg : d.msg,
            });
         });
 
         this.props.socket.on('shipMsg', (d)=>{
            this.setState({
                shipMsg : d.msg,
            });
         })
         
        this.props.socket.on('onGameInit',(d)=>{
            this.setState({player : d.playerState,
                shipMsg: "Game has Started",
                personalMsg: "",    
            });

            console.log(d.playerState);
        })

        this.props.socket.on('onShipCmd',(d)=>{
            this.setState({
                    shipMsg: d.msg,
            })
        });

        /*this listener is essentially hidden, it just lets the client know that its waiting on the 
        correct move to be done.
        will be an laert for dev purposes
        */

        this.props.socket.on("onPersonalCMD", (d)=>{ 
                this.setState({
                    cmdHolder: d, 
            })
            this.cmdHolder = d;
                console.log(d);
        });

        //need a function that also listens for when a cmd is validated and 


    }

    testClick(e){
        this.props.socket.emit("start_game");
    }

    onDevClick(e){
        this.props.socket.emit("dev_gen");
    }

    /* this function will decide if a button is correct and worth sending
    */
    onClickCMDValidator(e,id){
        console.log(this.state.cmdHolder);
        if(this.state.cmdHolder == null) return;
        if(id === this.state.cmdHolder.id){
            this.props.socket.emit('Command',  {id: this.id, name: this.name});
        }
        //console.log(id, this.cmdHolder.id);
    }



    render(){
        return <div id = "Container">
                <DialogBox personalMsg = {this.state.personalMsg} shipMsg = {this.state.shipMsg}/>
                <Gridview socket = {this.props.socket} player={this.state.player} />
                <button onClick={(e)=>this.testClick(e)}> Test Start</button>
                <button onClick={(e)=>this.onDevClick(e)}> Gen a Command</button>
        </div>
    }
}

export default Container;
