var vertexShaderText =
`#version 300 es
precision mediump float;

in vec4 position;
out vec2 screenPosition;
uniform vec2 u_screenSize;

void main()
{
    gl_Position = position;
	gl_PointSize = 40.0;
    screenPosition=vec2(position.x*(u_screenSize.x/u_screenSize.y),position.y);
}`;

var fragmentShaderText =
`#version 300 es
precision mediump float;
in vec2 screenPosition;
out vec4 outColor;
uniform int circleMode;

void main()
{
	float circleDistance=length(gl_PointCoord-vec2(.5,.5));
	if(circleMode==0 && circleDistance<.5 && circleDistance>.45){
		outColor = vec4(1,.6,0,1);
	}
	else if(circleMode==1 && circleDistance<.5){
		outColor = vec4(1,0,0,.3);
	}
	else{
		discard;
	}
}`;

var gl=headerCanvas.getContext("webgl2",{ premultipliedAlpha: false });
gl.clearColor(1.0,1.0,1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.CULL_FACE);
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);

var vertexShader=gl.createShader(gl.VERTEX_SHADER);
var fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader,vertexShaderText);
gl.shaderSource(fragmentShader,fragmentShaderText);

gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	alert('ERROR compiling vertex shader '+gl.getShaderInfoLog(vertexShader));
}
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	alert('ERROR compiling fragment shader '+gl.getShaderInfoLog(fragmentShader));
}
var program=gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	alert('ERROR linking program! '+gl.getProgramInfoLog(program));
}
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
	alert('ERROR validating program! '+gl.getProgramInfoLog(program));
}

gl.useProgram(program);

gl.bindVertexArray(null);
var screenSizeUniformLocation=gl.getUniformLocation(program,"u_screenSize");
var circleModeUniformLocation=gl.getUniformLocation(program,"circleMode");
function drawFancyCircles(circlePositions,filled){
	gl.clearColor(1.0,1.0,1.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniform2f(screenSizeUniformLocation,headerCanvas.width,headerCanvas.height);
	if(filled){
		gl.uniform1i(circleModeUniformLocation,1);
	}
	else{
		gl.uniform1i(circleModeUniformLocation,0);
	}
	var backgroundPositionBuffer=gl.createBuffer();
	var backgroundPositionAttribLocation = gl.getAttribLocation(program, "position");

	var backgroundVertexArray = gl.createVertexArray();
	gl.bindVertexArray(backgroundVertexArray);

	gl.enableVertexAttribArray(backgroundPositionAttribLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circlePositions), gl.STATIC_DRAW);
	gl.vertexAttribPointer(
		backgroundPositionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.drawArrays(gl.POINTS, 0, parseInt(circlePositions.length/2));
	gl.bindVertexArray(null);
}