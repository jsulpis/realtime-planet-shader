import "./style.css";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

function flatten<T>(array: T[][]): T[] {
   return array.reduce((acc, val) => acc.concat(val), []);
}

const canvas = document.querySelector("canvas")!;
const gl = canvas.getContext("webgl");

// Create the vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// Create the fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Create the shader program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// Create the buffer
const positionBuffer = gl.createBuffer();
const positions = flatten([
   [-1, -1, 0],
   [1, -1, 0],
   [-1, 1, 0],
   [1, 1, 0],
]);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Use the shader program
gl.useProgram(program);

// Set the position attribute
const positionAttributeLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

// Draw the square
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

// Update the time uniform
const timeUniformLocation = gl.getUniformLocation(program, "time");

requestAnimationFrame(function animate() {
   requestAnimationFrame(animate);

   gl.uniform1f(timeUniformLocation, performance.now() / 500);
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
