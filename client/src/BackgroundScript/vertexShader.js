export const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec2 a_texCoord;

    uniform mat4 uProjectionMatrix;

    varying vec4 vColor;
    varying vec4 vPlace;
    varying vec2 v_texCoord;
    
    void main(void) {
        gl_Position = uProjectionMatrix * aVertexPosition;
        vColor = aVertexColor;
        vPlace = aVertexPosition;

        v_texCoord = a_texCoord;
    }
    `;

