uniform sampler2D uMap;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(uMap, vUv) * uOpacity;
}
