 export const fsSource = `
 precision mediump float;

 varying vec4 vPlace;
 varying vec4 vColor;
 varying vec2 v_texCoord;

 vec4 final_color;

 uniform sampler2D u_texture;


 void main(void) { 
    float x = pow(vPlace.x,2.0);
    float y = pow((vPlace.y+1.0),2.0);
    float opacity = exp( -1.0*(x+y));
    //opacity = abs(opacity - 1.0);
    //final_color = vColor ;//* opacity;
    //gl_FragColor = final_color ;//vec4(vColor.x, vColor.y, vColor.z, 1);
    gl_FragColor = texture2D(u_texture, v_texCoord);
   }
`;