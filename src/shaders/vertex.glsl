#version 300 es

precision mediump float;

in vec3 position;
uniform vec2 uResolution;
out vec2 uv;

void main() {
   uv = (position.xy - 0.5) * uResolution / min(uResolution.y, uResolution.x);
   gl_Position = vec4(2.0 * position - 1.0, 1.0);
}