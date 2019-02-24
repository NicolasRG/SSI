import React, {Component} from 'react';
import '../stylesheets/DialogBox.css';
/**
 * need to add support for rooms and need to lookup if namespaces are useful here
 */
class DialogBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            shipMsg : "Starship Simon",
            personalMsg : "Welcome"
        }
    }

    componentDidMount(){
        this.props.socket.on('personalMsg', (d)=>{
           this.setState({
               personalMsg: d.msg,
           }); 
        });

        this.props.socket.on('shipMsg', (d)=>{
            this.setState({
                shipMsg: d.msg,
            })
        })
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