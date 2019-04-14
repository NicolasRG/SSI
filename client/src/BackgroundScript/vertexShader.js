export const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    //varying vec4 vColor;
    varying vec4 vPlace;
    
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        //vColor = aVertexColor;
        vPlace = aVertexPosition;
    }
    `;

