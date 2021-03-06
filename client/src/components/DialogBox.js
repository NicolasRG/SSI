import React, {Component} from 'react';
import '../stylesheets/DialogBox.css';
/**
 * need to add support for rooms and need to lookup if namespaces are useful here
 */
class DialogBox extends Component{

    constructor(props){
        super(props);
        this.state = {
            personalMsg: "",
            shipMsg: ""
        }
    }

    componentDidMount(){
        this.props.socket.on('personalMsg', (d)=>{
            this.setState({
                personalMsg : d.msg,
            });
         });
         
         //same thing lmao
         this.props.socket.on('shipMsg', (d)=>{
            this.setState({
                shipMsg : d.msg,
            });
         });

         this.props.socket.on('onShipCmd',(d)=>{
            this.setState({
                    shipMsg: d.msg,
            })
        });

        this.props.socket.on('onCorrectTask', (d)=>{
            alert("correct command!!");
        });
         
    }

    render(){
        return <div id= "DialogBox">
                    <div>
                        {this.state.shipMsg}    
                    </div>
                    <div>
                        {this.state.personalMsg}
                    </div>
            </div>
    }
}

export default DialogBox;