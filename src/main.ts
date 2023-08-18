import "./style.css";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import { initGlslCanvas } from "./glslCanvas";

const { gl, raf } = initGlslCanvas(vertexShaderSource, fragmentShaderSource);

raf(() => {
   // do something
});
