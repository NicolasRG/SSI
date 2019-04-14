 export const fsSource = `
 precision mediump float;

 varying vec4 vPlace;

 void main(void) { 
    float x = pow(vPlace.x,2.0);
    float y = pow((vPlace.y+1.0),2.0);
    float opacity = exp( -1.0*(x+y));
    //opacity = abs(opacity - 1.0);
    gl_FragColor = vec4(opacity, opacity, opacity, 1);
 }
`;