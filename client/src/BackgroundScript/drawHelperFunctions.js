
const glm = require('gl-matrix');

const setUniforms=(gl, programInfo, object, tex1, tex2, texture1, texture2, )=>{
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
        };

         // Turn on the teccord attribute
        gl.enableVertexAttribArray(programInfo.attribLocations.texcoordLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.texbuffer);

        //attempt to create the textures here
        if(tex1 && tex2){
            if(object.texid === 1 ){
                //ok so thats expensive
                gl.bindTexture( gl.TEXTURE_2D, texture1);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex1);
                gl.generateMipmap(gl.TEXTURE_2D);
            }else{
                gl.bindTexture( gl.TEXTURE_2D, texture2);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex2);
                gl.generateMipmap(gl.TEXTURE_2D);

            }
        }

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            programInfo.attribLocations.texcoordLocation, size, type, normalize, stride, offset);

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