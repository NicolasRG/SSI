import React, { Component } from 'react';
import '../stylesheets/App.css';
import openSocket from 'socket.io-client';
//import different react components
import Container from './Container.js'
import AnimatedBackground from './AnimatedBackground.js';

//socket.io client
const socket = openSocket( "http://192.168.1.11:80");
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      socket:socket,
    }
  }

  componentDidMount(){
    socket.emit("hello");
  }


  render() {
    return (
       
        <div className="App">
          {<AnimatedBackground>
            </AnimatedBackground>}
          {<Container socket = {this.state.socket}/>}
        </div>
    );
  }
}

export default App;
