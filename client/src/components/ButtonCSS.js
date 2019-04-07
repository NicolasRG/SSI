import React, {Component} from "react";
/**
 * Binary CSS transition
 * Made this cause I wasnt content with Reacts Transistion module
 */
class ButtonCSS extends Component{
    constructor(props){
        super(props);
       // this.currentStyle = this.currentStyle.bind(this);
        this.style = props.baseStyle;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.showButton){
            this.style = this.props.endStyle 
            this.style = {
                "animation-name": ""+nextProps.nameOnKeyFrame,
                "animation-duration" : ".5s",
                "animation-fill-mode": nextProps.duration, 
            }
        }else{
            this.style = {
                "animation-name" : ""+nextProps.nameOffKeyFrame,
                "animation-fill-mode" : "forwards",
                "animation-duration" : nextProps.duration,
            }
        }
    }


    render(){
       return <div id= "ButtonCSS"
                style = {this.style}
                >
                    {
                        this.props.children
                    }
            </div>
    }

}

export default ButtonCSS;