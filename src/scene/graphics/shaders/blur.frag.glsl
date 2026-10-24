uniform sampler2D uInput;
uniform vec2 uStep;
uniform float uSigma;
uniform vec4 uBounds;

varying vec2 vUv;

vec2 mirror(vec2 uv) {
  vec2 size = max(uBounds.zw - uBounds.xy, vec2(1e-5));
  vec2 t = mod(uv - uBounds.xy, size * 2.0);

  return uBounds.xy + size - abs(size - t);
}

void main() {
  vec4 sum = vec4(0.0);
  float total = 0.0;

  for (int i = -24; i <= 24; i++) {
    float x = float(i);
    float weight = exp(-0.5 * x * x / (uSigma * uSigma));
    sum += texture2D(uInput, mirror(vUv + uStep * x)) * weight;
    total += weight;
  }

  gl_FragColor = sum / total;
}
