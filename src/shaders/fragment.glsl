precision mediump float;

varying vec2 vUv;
uniform float time;

void main() {
  gl_FragColor = vec4(vUv, sin(time) / 2. + .5, 1.);
}