(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{35:function(t,e,r){t.exports=r(72)},40:function(t,e,r){},41:function(t,e,r){},67:function(t,e){},70:function(t,e,r){},71:function(t,e,r){t.exports=r.p+"static/media/f-texture.89efad94.png"},72:function(t,e,r){"use strict";r.r(e);var a,n=r(0),o=r.n(n),i=r(33),c=r.n(i),l=(r(40),r(8)),s=r(9),u=r(12),h=r(10),g=r(11),v=(r(41),r(34)),d=r.n(v),f=r(1),m=function(t,e,r){var a=t.createShader(e);return t.shaderSource(a,r),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS)?a:(alert("An error occurred compiling the shaders: "+t.getShaderInfoLog(a)),t.deleteShader(a),null)},A=function(t){var e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e);t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),t.STATIC_DRAW);var r=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r);t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),t.STATIC_DRAW);for(var a=[[1,1,1,1],[1,0,0,1],[0,1,0,1],[0,0,1,1],[1,1,0,1],[1,0,1,1]],n=[],o=0;o<a.length;++o){var i=a[o];n=n.concat(i,i,i,i)}var c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array(n),t.STATIC_DRAW);var l=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,l),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,1,1,0]),t.STATIC_DRAW),{position:e,indices:r,color:c,texbuffer:l,translate:[-0,0,-0],axisRotate:[0,0,0]}},b=r(32),p=(r(70),r(71),r(32)),x=0,R=.1,E=[],_=function(t){function e(t){var r;return Object(l.a)(this,e),(r=Object(u.a)(this,Object(h.a)(e).call(this,t))).state={height:window.innerHeight,width:window.innerWidth},r.getComputedStyle=r.getComputedStyle.bind(Object(f.a)(Object(f.a)(r))),r.renderBackground=r.renderBackground.bind(Object(f.a)(Object(f.a)(r))),r}return Object(g.a)(e,t),Object(s.a)(e,[{key:"componentDidMount",value:function(){var t=this;if(window.addEventListener("resize",this.getComputedStyle),this.canvas=document.getElementById("animatedBackground"),this.gl=this.canvas.getContext("webgl"),null!==this.gl){var e=function(t,e,r){var a=m(t,t.VERTEX_SHADER,e),n=m(t,t.FRAGMENT_SHADER,r),o=t.createProgram();return t.attachShader(o,a),t.attachShader(o,n),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS)?o:(alert("Unable to initialize the shader program: "+t.getProgramInfoLog(o)),null)}(this.gl,"\n    attribute vec4 aVertexPosition;\n    attribute vec4 aVertexColor;\n    attribute vec2 a_texCoord;\n\n    uniform mat4 uProjectionMatrix;\n\n    varying vec4 vColor;\n    varying vec4 vPlace;\n    varying vec2 v_texCoord;\n    \n    void main(void) {\n        gl_Position = uProjectionMatrix * aVertexPosition;\n        vColor = aVertexColor;\n        vPlace = aVertexPosition;\n\n        v_texCoord = a_texCoord;\n    }\n    ","\n precision mediump float;\n\n varying vec4 vPlace;\n varying vec4 vColor;\n varying vec2 v_texCoord;\n\n vec4 final_color;\n\n uniform sampler2D u_texture;\n\n\n void main(void) { \n    float x = pow(vPlace.x,2.0);\n    float y = pow((vPlace.y+1.0),2.0);\n    float opacity = exp( -1.0*(x+y));\n    //opacity = abs(opacity - 1.0);\n    //final_color = vColor ;//* opacity;\n    //gl_FragColor = final_color ;//vec4(vColor.x, vColor.y, vColor.z, 1);\n    gl_FragColor = texture2D(u_texture, v_texCoord);\n   }\n");a=this.gl.createTexture(),this.gl.bindTexture(this.gl.TEXTURE_2D,a),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,new Uint8Array([0,255,0,255]));var r=new Image;r.src="https://webglfundamentals.org/webgl/resources/f-texture.png",console.log(r),r.addEventListener("load",function(){t.gl.bindTexture(t.gl.TEXTURE_2D,a),t.gl.texImage2D(t.gl.TEXTURE_2D,0,t.gl.RGBA,t.RGBA,t.gl.UNSIGNED_BYTE,r),t.gl.generateMipmap(t.gl.TEXTURE_2D)}),this.programInfo={program:e,attribLocations:{vertexPosition:this.gl.getAttribLocation(e,"aVertexPosition"),vertexColor:this.gl.getAttribLocation(e,"aVertexColor"),texcoordLocation:this.gl.getAttribLocation(e,"a_texCoord")},uniformLocations:{projectionMatrix:this.gl.getUniformLocation(e,"uProjectionMatrix"),textureLocation:this.gl.getUniformLocation(e,"u_texture")}},E.push(A(this.gl)),E.push(A(this.gl)),E.push(A(this.gl)),E.push(A(this.gl)),E.push(A(this.gl)),E.push(A(this.gl)),E.push(A(this.gl)),requestAnimationFrame(this.renderBackground)}else alert("Unable to initialize WebGL. Your browser or machine may not support it.")}},{key:"renderBackground",value:function(t){var e=(t*=.001)-x;x=t,w(this.gl,this.programInfo,e),requestAnimationFrame(this.renderBackground)}},{key:"getComputedStyle",value:function(){var t=this.canvas.clientHeight,e=this.canvas.clientWidth;this.setState({height:t+"px",width:e+"px"}),this.canvas.height=this.gl.canvas.height,this.canvas.width=this.gl.canvas.width,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),console.log(this.gl.canvas.width)}},{key:"render",value:function(){return o.a.createElement("canvas",{id:"animatedBackground",width:this.state.width,height:this.state.height},"error")}}]),e}(n.Component),w=function(t,e,r){t.clearColor(0,0,0,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),t.enable(t.CULL_FACE),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);var a=45*Math.PI/180,n=t.canvas.width/t.canvas.height,o=p.mat4.create();p.mat4.perspective(o,a,n,.1,100);var i=[20*Math.cos(R),0,20*Math.sin(R)],c=p.mat4.create();p.mat4.targetTo(c,i,[0,0,0],[0,1,0]);var l=function(t,e){var r=b.mat4.create();b.mat4.invert(r,e);var a=b.mat4.create();return b.mat4.multiply(a,t,r),a}(o,c);t.useProgram(e.program);E.forEach(function(r,a){var n=3*a-8;Math.pow(a-3,2);r.translate=[n,0,-0],r.axisRotate=[0,0,0],r.axisRotate[a]=1;var o=p.mat4.create();p.mat4.translate(o,o,r.translate);var i=p.mat4.create();p.mat4.multiply(i,l,o),r.u_worldViewProjection=i,function(t,e,r){var a=t.FLOAT;t.bindBuffer(t.ARRAY_BUFFER,r.position),t.vertexAttribPointer(e.attribLocations.vertexPosition,3,a,!1,0,0),t.enableVertexAttribArray(e.attribLocations.vertexPosition);var n=t.FLOAT;t.bindBuffer(t.ARRAY_BUFFER,r.color),t.vertexAttribPointer(e.attribLocations.vertexColor,4,n,!1,0,0),t.enableVertexAttribArray(e.attribLocations.vertexColor),t.enableVertexAttribArray(e.attribLocations.texcoordLocation),t.bindBuffer(t.ARRAY_BUFFER,r.texbuffer);var o=t.FLOAT;t.vertexAttribPointer(e.attribLocations.texcoordLocation,2,o,!1,0,0),t.uniformMatrix4fv(e.uniformLocations.projectionMatrix,!1,r.u_worldViewProjection),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r.indices)}(t,e,r);var c=t.UNSIGNED_SHORT;t.uniform1i(e.uniformLocations.textureLocation,0),t.drawElements(t.TRIANGLES,36,c,0)}),R=r+R},B=d()("http://192.168.1.8:80"),T=function(t){function e(t){var r;return Object(l.a)(this,e),(r=Object(u.a)(this,Object(h.a)(e).call(this,t))).state={socket:B},r}return Object(g.a)(e,t),Object(s.a)(e,[{key:"componentDidMount",value:function(){B.emit("hello")}},{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement(_,null))}}]),e}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(T,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[35,1,2]]]);
//# sourceMappingURL=main.cee4597b.chunk.js.map