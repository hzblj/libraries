uniform vec4 uRect;
uniform float uRadius;
uniform sampler2D uMap;
uniform vec2 uMapSize;
uniform float uStrength;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec2 size = uRect.zw;
  vec2 local = vec2(vUv.x, 1.0 - vUv.y) * size;
  float shape = coverage(roundedBox(local - size * 0.5, size * 0.5, uRadius));
  vec3 paper = texture2D(uMap, cover(vUv, size, uMapSize, vec2(0.5))).rgb;

  gl_FragColor = vec4(mix(vec3(1.0), paper, uStrength * shape * uOpacity), 1.0);
}
