import React, {Component} from 'react';
import {initShaderProgram} from  '../BackgroundScript/shaderLoader.js';
import {fsSource} from '../BackgroundScript/fragShader.js';
import {vsSource} from '../BackgroundScript/vertexShader.js';
import {initSquareBuffers} from '../BackgroundScript/initBuffersSqaure.js';
import {setUniforms, createViewProjectionMatrix} from '../BackgroundScript/drawHelperFunctions.js'
import '../stylesheets/AnimatedBackground.css'
const glm = require('gl-matrix');

let then = 0;
let cubeRotation = .5;
let objects = [];
  
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
            }, 
        }

        objects.push(initSquareBuffers(this.gl));
        objects.push(initSquareBuffers(this.gl));
        objects.push(initSquareBuffers(this.gl));
        requestAnimationFrame(this.renderBackground);

    }

    renderBackground(now){
        now *= 0.001;  // convert to seconds
        const delta = now - then;
        then = now;
    
        drawScene(this.gl, this.programInfo, delta);
    
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
            width = {this.state["width"]} >
                error
        </canvas>
    }
}



export default AnimatedBackground;

const drawScene=(gl, programInfo, delta)=>{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.enable(gl.CULL_FACE);
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
     // Tell WebGL to use our program when drawing
     //and where to look at   
     var cameraPosition = [0, 0, 20];
     var target = [0, 0, 0];
     var up = [0, 1, 0];
     var cameraMatrix = glm.mat4.create();
     
     glm.mat4.targetTo(cameraMatrix, cameraPosition, target, up);
  
     // Make a view matrix from the camera matrix.
    var viewProjectionMatrix= createViewProjectionMatrix(projectionMatrix, cameraMatrix);

    gl.useProgram(programInfo.program);
   
   

    const down =  -1*((cubeRotation*2) % 50) + 25;
    //create three different squares that rotate 
    objects.forEach((d,i)=>{
                //----------------- Where Object Personal Properties are at -------------------------------------------
                const xPos = -5.0 + (5*i);        
                cubeRotation = delta + cubeRotation;
                d.translate = [xPos, down, -0.0];
                d.axisRotate =[0,0,0];
                d.axisRotate[i] = 1;
        
                // Set the drawing position to the "identity" point, which is
                // the center of the scene.
                const modelViewMatrix = glm.mat4.create();
               
                // Now move the drawing position a bit to where we want to
                // start drawing the square.
            
                glm.mat4.translate(modelViewMatrix,     // destination matrix
                            modelViewMatrix,     // matrix to translate
                            d.translate);  // amount to translate
        
                glm.mat4.rotate(modelViewMatrix,  // destination matrix
                            modelViewMatrix,  // matrix to rotate
                        cubeRotation,   // amount to rotate in radian
                        d.axisRotate);       // axis to rotate around
                        
                
                var u_worldViewProjection = glm.mat4.create();
                glm.mat4.multiply(u_worldViewProjection, viewProjectionMatrix, modelViewMatrix);                 
                d.u_worldViewProjection = u_worldViewProjection; 
                
                setUniforms(gl, programInfo, d);
        
                {
                const vertexCount = 36;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
                }
    });

}

