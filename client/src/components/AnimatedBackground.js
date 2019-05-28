import React, {Component} from 'react';
import {initShaderProgram} from  '../BackgroundScript/shaderLoader.js';
import {fsSource} from '../BackgroundScript/fragShader.js';
import {vsSource} from '../BackgroundScript/vertexShader.js';
import {initCubeBuffers} from '../BackgroundScript/initBuffersCube.js';
import {setUniforms, createViewProjectionMatrix} from '../BackgroundScript/drawHelperFunctions.js';
import '../stylesheets/AnimatedBackground.css';
import img1 from  '../imgs/testTex.jpg';
import img2 from '../imgs/f-texture.png';
const glm = require('gl-matrix');

let then = 0;
let cubeRotation = .1;
let objects = [];
let texture, texture1, texture2;

let tex1, tex2 = false;
  
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
        this.canvas = document.getElementById("animatedBackground");
        this.gl =  this.canvas.getContext("webgl");

        if( this.gl === null){
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }


        const shaderProgram = initShaderProgram(this.gl, vsSource, fsSource);

        texture = this.gl.createTexture();
        texture1 = this.gl.createTexture();
        texture2 =this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 blue pixel.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
                      new Uint8Array([0, 0, 255, 255]));


        var image1 = new Image();
        var image2 = new Image();
        image1.crossOrigin="anonymous";
        image2.crossOrigin =  "anonymous";

        image1.src = img1;//"https://webglfundamentals.org/webgl/resources/f-texture.png";
        image2.src = img2;


        //image.src = img;
        image1.addEventListener('load', ()=>{
            tex1 = image1;    
        /*this.gl.bindTexture( this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);*/
        });

        image2.addEventListener('load', ()=>{
            tex2 = image2;
        });


        this.programInfo ={
            program: shaderProgram,
            attribLocations: {
              vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
              vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
              texcoordLocation : this.gl.getAttribLocation(shaderProgram, 'a_texCoord')
            },
            uniformLocations: {
              projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
              textureLocation : this.gl.getUniformLocation(shaderProgram, 'u_texture'),
            }, 
        }

        objects.push(initCubeBuffers(this.gl));
        objects.push(initCubeBuffers(this.gl));
        objects.push(initCubeBuffers(this.gl));
        objects.push(initCubeBuffers(this.gl));
        objects.push(initCubeBuffers(this.gl));
        objects.push(initCubeBuffers(this.gl));
        objects.push(initCubeBuffers(this.gl));
        
        objects.forEach(element => {
            console.log(element.texid);
        });

        requestAnimationFrame(this.renderBackground);

    }

    renderBackground(now){
        now *= 0.001;  // convert to seconds
        const delta = now - then;
        then = now;
    
        drawScene(this.gl, this.programInfo, delta);
        //this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);
        requestAnimationFrame(this.renderBackground);
      }

    getComputedStyle(){
        const  height = this.canvas.clientHeight;
        const width = this.canvas.clientWidth;
        this.setState({
            "height" : height+"px",
            "width" : width+"px",
        });
        this.canvas.height = this.gl.canvas.height;
        this.canvas.width = this.gl.canvas.width;
        this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);
        console.log(this.gl.canvas.width);
    }

    render(){return <canvas id = "animatedBackground"
                    width = {this.state["width"]}
                    height = {this.state["height"]}
             >
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
    const aspect = gl.canvas.width / gl.canvas.height;
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
     var cameraPosition = [(20 * Math.cos(cubeRotation)), 0, (20 * Math.sin(cubeRotation))];
     var target = [0, 0, 0];
     var up = [0, 1, 0];
     var cameraMatrix = glm.mat4.create();
     
     glm.mat4.targetTo(cameraMatrix, cameraPosition, target, up);
     //glm.mat4.rotate(projectionMatrix, projectionMatrix, cubeRotation/2, [0,0,0 ]);

     // Make a view matrix from the camera matrix.
    var viewProjectionMatrix= createViewProjectionMatrix(projectionMatrix, cameraMatrix);

    gl.useProgram(programInfo.program);
   
   

    const downDelta =  -.25*((cubeRotation) % 10);
    //create three different squares that rotate 
    objects.forEach((d,i)=>{
                //----------------- Where Object Personal Properties are at -------------------------------------------
                const xPos = -8.0 + (3*i);
                const down = downDelta + ((i - 3)**2)+10;        
                d.translate = [xPos, 0.0, -0.0];
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
        
                /*glm.mat4.rotate(modelViewMatrix,  // destination matrix
                            modelViewMatrix,  // matrix to rotate
                        cubeRotation,   // amount to rotate in radian
                        d.axisRotate);       // axis to rotate around */
                     
                
                var u_worldViewProjection = glm.mat4.create();
                glm.mat4.multiply(u_worldViewProjection, viewProjectionMatrix, modelViewMatrix);                 
                d.u_worldViewProjection = u_worldViewProjection; 
                
                setUniforms(gl, programInfo, d, tex1, tex2, texture1, texture2);
        
                {
                const vertexCount = 36;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;

                // Tell the shader to use texture unit 0 for u_texture
                gl.uniform1i(programInfo.uniformLocations.textureLocation, 0);
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
                }
    });
    cubeRotation = delta + cubeRotation;
}

