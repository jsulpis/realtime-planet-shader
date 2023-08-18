import "./style.css";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

function flatten<T>(array: T[][]): T[] {
   return array.reduce((acc, val) => acc.concat(val), []);
}

const canvas = document.querySelector("canvas")!;
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

const gl = canvas.getContext("webgl2");

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionBuffer = gl.createBuffer();
const positions = flatten([
   [-1, -1, 0],
   [1, -1, 0],
   [-1, 1, 0],
   [1, 1, 0],
]);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

const timeUniformLocation = gl.getUniformLocation(program, "uTime");
const resolutionUniformLocation = gl.getUniformLocation(program, "uResolution");

gl.uniform2fv(resolutionUniformLocation, [
   window.innerWidth * window.devicePixelRatio,
   window.innerHeight * window.devicePixelRatio,
]);

window.addEventListener("resize", () => {
   gl.uniform2fv(resolutionUniformLocation, [
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio,
   ]);
});

requestAnimationFrame(function animate() {
   requestAnimationFrame(animate);

   gl.uniform1f(timeUniformLocation, performance.now() / 1000);
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
