import React, {Component} from 'react';
import '../stylesheets/DialogBox.css';
/**
 * need to add support for rooms and need to lookup if namespaces are useful here
 */
class DialogBox extends Component{

    render(){
        return <div id= "DialogBox">
                    <div>
                        {this.props.shipMsg}    
                    </div>
                    <div>
                        {this.props.personalMsg}
                    </div>
            </div>
    }
}

export default DialogBox;