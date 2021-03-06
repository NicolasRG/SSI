import React, { Component } from 'react';
import '../stylesheets/App.css';
import openSocket from 'socket.io-client';
//import different react components
import Container from './Container.js';

//socket.io client
const socket = openSocket(); //for glitch leave it empty
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      socket:socket,
    }
  }

  componentDidMount(){
    socket.emit("initConnection");
  }


  render() {
    return (
       
        <div className="App">
          {<Container socket = {this.state.socket}/>}
        </div>
    );
  }
}

export default App;
