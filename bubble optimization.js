var vertexShaderText =
`#version 300 es
precision highp float;

in vec4 position;
out vec2 screenPosition;
uniform vec2 u_screenSize;
out float time;

void main()
{
    gl_Position = position;
    screenPosition=vec2(position.x*(u_screenSize.x/u_screenSize.y),position.y);
}`;

var fragmentShaderText =
`#version 300 es
precision medp float;
in vec2 screenPosition;
out vec4 outColor;

float distance(vec2 pos){
    return sqrt(pow(pos.x,2)+pow(pos.y,2));
}

void main()
{
    if(distance(screenPosition)<.4){
        outColor = vec4(1,1,1,1);
    }
    else{
        outColor = vec4(0,0,0,1);
    }
}`;
function runShader(){
	var canvas=document.getElementById("gameCanvas");
	canvas.width=window.innerWidth;
	canvas.height=window.innerHeight-5;
	var width=canvas.width;
	var height=canvas.height;

	var gl=canvas.getContext("webgl2");
	gl.clearColor(0.1,0.1,0.1, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	var vertexShader=gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		alert('ERROR compiling vertex shader '+gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		alert('ERROR compiling fragment shader '+gl.getShaderInfoLog(fragmentShader));
		return;
	}
	var program=gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert('ERROR linking program! '+gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		alert('ERROR validating program! '+gl.getProgramInfoLog(program));
		return;
	}

	gl.useProgram(program);

	var backgroundPositionBuffer=gl.createBuffer();
	var backgroundVertices=[ 1.0,1.0,
	                        -1.0,-1.0,
	                         1.0,-1.0,
	                         1.0,1.0,
	                         -1.0,1.0,
	                         -1.0,-1.0];
	var backgroundPositionAttribLocation = gl.getAttribLocation(program, "position");

	var backgroundVertexArray = gl.createVertexArray();
	gl.bindVertexArray(backgroundVertexArray);

	gl.enableVertexAttribArray(backgroundPositionAttribLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(backgroundVertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(
		backgroundPositionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	gl.bindVertexArray(null);
	var zoom=1.1;
	var screenSizeUniformLocation=gl.getUniformLocation(program,"u_screenSize");
	var origin=[0,0];
	function loop(){
		gl.clearColor(0.0,0.0,0.0,1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.uniform2f(screenSizeUniformLocation,width,height);
		gl.bindVertexArray(backgroundVertexArray);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		gl.bindVertexArray(null);
		requestAnimationFrame(loop);
	}

	requestAnimationFrame(loop);



}