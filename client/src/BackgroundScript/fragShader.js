 export const fsSource = `
 precision mediump float;

 varying vec4 vColor;
 
 void main(void) {
    vec4 color = vColor * 0.5 + 0.5;
   gl_FragColor = color;
 }
`;