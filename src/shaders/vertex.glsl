precision mediump float;

attribute vec3 position;
varying vec2 vUv;

void main() {
   vUv = position.xy;
   gl_Position = vec4(2.0 * position - 1.0, 1.0);
}