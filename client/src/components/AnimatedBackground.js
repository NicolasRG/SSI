import React, {Component} from 'react';
import {initShaderProgram} from  '../BackgroundScript/shaderLoader.js';
import {fsSource} from '../BackgroundScript/fragShader.js';
import {vsSource} from '../BackgroundScript/vertexShader.js';

import '../stylesheets/AnimatedBackground.css'

const glm = require('gl-matrix');
let then = 0;
let cubeRotation = 0;
  
class AnimatedBackground extends Component{
    constructor(props){
        super(props);
        this.state ={
            height:window.innerHeight,
            width:window.innerWidth,
        }

        this.getComputedStyle = this.getComputedStyle.bind(this);
        this.renderBackground = this.renderBackground.bind(this);
    }



    componentDidMount(){
        //Set width/height correctly first
        //this.getComputedStyle();
        window.addEventListener("resize", this.getComputedStyle);
        //render WebGl
        this.canvas = document.querySelector("#animatedBackground");
        this.gl =  this.canvas.getContext("webgl");

        if( this.gl === null){
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        const shaderProgram = initShaderProgram(this.gl, vsSource, fsSource);

        this.programInfo ={
            program: shaderProgram,
            attribLocations: {
              vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
              vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
              projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
              modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            }, 
        }

        this.buffers = initBuffers(this.gl);

        //drawScene(this.gl, this.programInfo, this.buffers);
        requestAnimationFrame(this.renderBackground);
        /*this.gl.clearColor( 0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);*/

    }

    renderBackground(now){
        now *= 0.001;  // convert to seconds
        const delta = now - then;
        then = now;
    
        drawScene(this.gl, this.programInfo, this.buffers, delta);
    
        requestAnimationFrame(this.renderBackground);
      }

    getComputedStyle(){
        const  height = window.innerHeight;
        const width = window.innerWidth;
        console.log(height, width);
        this.setState({
            "height" : height+"px",
            "width" : width+"px",
        });
        this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);
    
    }

    render(){return <canvas id = "animatedBackground"
            height = {this.state["height"]}
            width = {this.state["width"]}
    >
                error
        </canvas>
    }
}



export default AnimatedBackground;


const initBuffers=(gl)=>{
    // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0 ];



  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

   // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        indices: indexBuffer,
    };
}

const drawScene=(gl, programInfo, buffers, delta)=>{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glm.mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    glm.mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = glm.mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
  
    glm.mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 0.0, -6.0]);  // amount to translate

    glm.mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation,   // amount to rotate in radian
              [0, 0, 1]);       // axis to rotate around       
                     
  
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 3;  // pull out 2 values per iteration
      const type = gl.FLOAT;    // the data in the buffer is 32bit floats
      const normalize = false;  // don't normalize
      const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
      const offset = 0;         // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing
  
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms
  
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
  
    {
        const vertexCount = 6;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

