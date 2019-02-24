import React, { Component } from 'react';
import logo from '../imgs/logo.svg';
import '../stylesheets/App.css';
import openSocket from 'socket.io-client';
//import different react components
import Container from './Container.js'

//socket.io client
const socket = openSocket('http://192.168.1.2');

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            SSI
          </p>
        </header>
        <Container socket = {this.state.socket}/>
      </div>
    );
  }
}

export default App;
