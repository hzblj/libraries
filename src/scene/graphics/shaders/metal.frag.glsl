#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uRadius;
uniform float uTime;
uniform vec2 uTilt;
uniform vec2 uPointer;
uniform float uHover;

out vec4 outColor;

const float PERSPECTIVE = 4.8;
const float RIDGES = 6.5;
const float RIDGE_WIDTH = 0.2;
const float RELIEF = 0.62;
const float LIP = 1.4;
const vec3 F0 = vec3(0.11, 0.115, 0.13);
const vec3 KEY = vec3(-0.24, 0.36, 0.9);
const vec3 SWEEP = vec3(0.32, 0.06, 0.95);
const vec3 KEY_COLOR = vec3(0.9, 0.93, 1.0);
const vec3 SWEEP_COLOR = vec3(0.76, 0.8, 0.96);
const vec3 SPOT_COLOR = vec3(1.0, 0.99, 0.98);
const vec2 ROUGH = vec2(0.2, 0.3);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float roundedBox(vec2 p, vec2 size, float r) {
  vec2 q = abs(p) - size + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

mat3 tiltMatrix(vec2 tilt) {
  float cx = cos(tilt.x);
  float sx = sin(tilt.x);
  float cy = cos(tilt.y);
  float sy = sin(tilt.y);
  mat3 rx = mat3(1.0, 0.0, 0.0, 0.0, cx, -sx, 0.0, sx, cx);
  mat3 ry = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy);
  return rx * ry;
}

float lobe(vec3 l, vec3 v, vec3 n, vec3 t, vec3 b, vec2 rough) {
  vec3 h = normalize(l + v);
  float hn = max(dot(h, n), 1e-3);
  float ht = dot(h, t) / rough.x;
  float hb = dot(h, b) / rough.y;
  return exp(-(ht * ht + hb * hb) / (hn * hn)) * max(dot(n, l), 0.0);
}

vec3 thinFilm(float x) {
  return 0.5 + 0.5 * cos(6.28318 * (x + vec3(0.0, 0.33, 0.67)));
}

float flow(vec2 p, float t) {
  float bend = 0.2 * sin(p.y * 3.2 + p.x * 1.1 + t * 0.3) + 0.09 * sin(p.y * 6.7 - p.x * 2.1 - t * 0.23);
  return p.x * 1.8 + bend + 0.32 * p.y * p.y;
}

void main() {
  vec2 px = gl_FragCoord.xy - 0.5 * uResolution;
  vec2 size = 0.5 * uResolution;
  float sd = roundedBox(px, size, uRadius);
  float alpha = clamp(0.5 - sd, 0.0, 1.0);

  if (alpha <= 0.0) {
    outColor = vec4(0.0);
    return;
  }

  vec2 p = px / uResolution.y;
  float t = uTime;

  float field = flow(p, t) * RIDGES;
  vec2 across = vec2(dFdx(field), dFdy(field));
  float period = 1.0 / max(length(across), 1e-4);
  across *= period;
  float cell = fract(field) - 0.5;
  float x = cell / RIDGE_WIDTH;
  float slope = -x * exp(-0.5 * x * x) * 1.65;
  float relief = smoothstep(-0.25, 0.5, p.x) * smoothstep(1.05, 0.55, length(p - vec2(0.95, 0.02)));
  relief *= smoothstep(-0.4, -0.14, p.y) * smoothstep(0.42, 0.2, p.y);
  relief *= 0.75 + 0.25 * sin(field * 0.9 - t * 0.8);
  relief *= smoothstep(4.0, 9.0, period / uPixelRatio);

  vec3 n = normalize(vec3(across * slope * RELIEF * relief, 1.0));

  mat3 m = tiltMatrix(uTilt);
  vec3 world = m * vec3(p, 0.0);
  vec3 v = normalize(vec3(0.0, 0.0, PERSPECTIVE) - world);
  vec3 normal = normalize(m * n);
  vec3 t0 = m * vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(t0 - normal * dot(t0, normal));
  vec3 bitangent = cross(normal, tangent);

  float nv = max(dot(normal, v), 0.0);
  vec3 fresnel = F0 + (1.0 - F0) * pow(1.0 - nv, 5.0);

  vec2 pointer = vec2(uPointer.x * size.x, -uPointer.y * size.y) / uResolution.y;
  vec3 spot = m * vec3(pointer, 0.5);

  float key = lobe(normalize(KEY), v, normal, tangent, bitangent, ROUGH * 1.7);
  float sweep = lobe(normalize(SWEEP), v, normal, tangent, bitangent, ROUGH * 0.8);
  float glint = lobe(normalize(spot - world), v, normal, tangent, bitangent, ROUGH * 0.55) * uHover;

  vec3 r = reflect(-v, normal);
  vec3 sky = mix(vec3(0.004, 0.005, 0.007), vec3(0.04, 0.044, 0.056), smoothstep(-0.3, 0.9, r.y - r.x * 0.3));

  vec3 light = sky + KEY_COLOR * key * 0.55 + SWEEP_COLOR * sweep * 0.5 + SPOT_COLOR * glint * 0.85;
  vec3 color = fresnel * light + vec3(0.006, 0.007, 0.009);

  float flank = abs(slope) * relief;
  vec3 film = mix(vec3(1.0), thinFilm(field * 0.07 + nv * 1.3 + t * 0.03), 0.4);
  color += film * flank * (sweep * 0.35 + glint * 0.8 + 0.02) * 0.5;

  float lip = exp(-max(-sd, 0.0) / (LIP * uPixelRatio));
  color *= 1.0 - 0.45 * lip;

  color += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color * alpha, alpha);
}
