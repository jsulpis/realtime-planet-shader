#version 300 es

precision mediump float;

in vec3 position;
uniform vec2 uResolution;
uniform vec2 sunDirectionXY;

out vec3 uSunDirection;
out vec2 uv;

void main() {
   uv = (position.xy - 0.5) * uResolution / min(uResolution.y, uResolution.x);
   uSunDirection = normalize(vec3(sunDirectionXY, 0.));

   gl_Position = vec4(2.0 * position - 1.0, 1.0);
}