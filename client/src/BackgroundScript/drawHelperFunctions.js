
const glm = require('gl-matrix');

const setUniforms=(gl, programInfo, object)=>{
        {const numComponents = 3;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                    // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        
        gl.bindBuffer(gl.ARRAY_BUFFER, object.position);
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

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, object.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }

       // Set the shader uniforms
       gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        object.u_worldViewProjection);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indices);    
}

const createViewProjectionMatrix =(projectionMatrix, cameraMatrix)=>{
    // Make a view matrix from the camera matrix.
     var viewMatrix = glm.mat4.create();
    glm.mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = glm.mat4.create();
    glm.mat4.multiply( viewProjectionMatrix , projectionMatrix, viewMatrix);

    return viewProjectionMatrix;
}


export {setUniforms, createViewProjectionMatrix}