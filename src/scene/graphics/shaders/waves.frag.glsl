#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uMirror;

out vec4 outColor;

const int SHEETS = 7;
const float BLUR = 0.07;
const float SHADOW_REACH = 0.09;
const float FRINGE = 0.1;
const vec3 KEY = vec3(-0.62, -0.34, 0.62);
const vec3 LIGHT = vec3(0.86, 0.88, 1.0);
const vec3 SKY = vec3(0.16, 0.2, 0.42);

const vec4 GEOM[SHEETS] = vec4[SHEETS](
  vec4(1.6, 1.3, 2.15, 0.0),
  vec4(1.2, 1.28, 1.78, 0.0),
  vec4(1.52, 0.92, 1.6, 0.085),
  vec4(1.12, 0.82, 1.3, 0.0),
  vec4(1.38, 1.22, 1.18, 0.0),
  vec4(1.08, 1.12, 0.9, 0.045),
  vec4(-1.35, 1.1, 1.16, 0.0)
);

const vec4 WOBBLE[SHEETS] = vec4[SHEETS](
  vec4(0.14, 0.8, 0.0, 0.5),
  vec4(0.12, 1.2, 3.1, 0.7),
  vec4(0.07, 1.5, 7.4, 0.9),
  vec4(0.14, 1.0, 11.2, 0.6),
  vec4(0.1, 1.7, 17.9, 0.8),
  vec4(0.05, 2.4, 23.3, 1.0),
  vec4(0.12, 0.9, 31.7, 0.5)
);

const vec4 LOOK[SHEETS] = vec4[SHEETS](
  vec4(0.05, 1.0, 0.7, 0.75),
  vec4(0.04, 1.0, 0.9, 0.8),
  vec4(0.0425, 1.0, 1.0, 0.75),
  vec4(0.035, 0.45, 1.0, 0.5),
  vec4(0.03, 1.0, 0.9, 0.8),
  vec4(0.0225, 1.0, 1.0, 0.6),
  vec4(0.07, 0.7, 1.5, 0.4)
);

const vec3 ALBEDO[SHEETS] = vec3[SHEETS](
  vec3(0.02, 0.026, 0.06),
  vec3(0.035, 0.034, 0.1),
  vec3(0.3, 0.3, 0.38),
  vec3(0.09, 0.05, 0.2),
  vec3(0.02, 0.035, 0.1),
  vec3(0.12, 0.09, 0.26),
  vec3(0.06, 0.06, 0.16)
);

const float DEPTH[SHEETS] = float[SHEETS](0.0, 0.0, 0.0, 0.004, 0.0, 0.01, 0.075);

const vec3 FRINGE_OUT = vec3(0.6, 0.45, 1.0);
const vec3 FRINGE_MID = vec3(0.86, 0.88, 1.0);
const vec3 FRINGE_IN = vec3(0.42, 0.72, 1.0);

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash(i), f);
  float b = dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec2 warp(vec2 p, float t) {
  vec2 q = vec2(noise(p * 0.8 + vec2(0.0, t * 0.05)), noise(p * 0.8 + vec2(5.2, 1.3 - t * 0.04)));
  return p + 0.3 * q;
}

vec2 parts(int k, vec2 w, float t) {
  vec4 wobble = WOBBLE[k];
  vec2 drift = t * wobble.w * vec2(0.05, -0.035);
  return vec2(length(w - GEOM[k].xy), wobble.x * noise(w * wobble.y + vec2(wobble.z, wobble.z * 1.7) + drift));
}

float slopeAt(int k, float x, float dw) {
  if (GEOM[k].w > 0.0) {
    float y = clamp(1.0 - x, 0.0, 0.995);
    return y / sqrt(1.0 - y * y);
  }

  float lip = 5.0 * pow(max(1.0 - x, 0.0), 2.0);
  float pillow = 0.55 * exp(-dw / 0.1) - 0.22 * smoothstep(0.08, 0.45, dw);
  return lip + pillow;
}

vec3 shade(int k, float dw, float halfWidth, vec2 dir, float blur, float shadow, vec3 below) {
  vec4 look = LOOK[k];
  float lip = halfWidth > 0.0 ? halfWidth : look.x + blur;
  float x = max(dw, 0.0) / lip;
  float focus = look.x / (look.x + blur);
  vec3 key = normalize(KEY);
  vec2 lightDir = normalize(key.xy);

  vec3 n = normalize(vec3(-dir * slopeAt(k, x, dw), 1.0));
  float fresnel = 0.04 + 0.96 * pow(1.0 - n.z, 5.0);
  vec3 r = vec3(2.0 * n.z * n.xy, 2.0 * n.z * n.z - 1.0);
  float facing = smoothstep(-0.5, 0.9, dot(-dir, lightDir));

  vec3 rim = vec3(0.0);
  for (int c = 0; c < 3; c++) {
    float shifted = max(x + (float(c) - 1.0) * FRINGE, 0.0);
    vec3 m = normalize(vec3(-dir * slopeAt(k, shifted, dw), 1.0));
    vec3 hue = c == 0 ? FRINGE_IN : c == 1 ? FRINGE_MID : FRINGE_OUT;
    rim += hue * pow(1.0 - m.z, 2.2) / 2.2;
  }
  rim *= mix(0.22, 1.0, facing) * look.z * focus;

  float soft = smoothstep(0.55, 0.98, dot(r, key));
  float spec = pow(max(dot(r, key), 0.0), 48.0) * focus;
  float sky = smoothstep(-0.4, 1.0, r.y);

  vec3 albedo = ALBEDO[k];
  vec3 body = albedo * (0.4 + 0.9 * max(dot(n, key), 0.0));
  vec3 tint = mix(vec3(1.0), normalize(albedo + 1e-3) * 1.4, 0.55);
  vec3 through = below * tint * (1.0 - fresnel) * (1.0 - look.y);
  vec3 reflection = fresnel * (SKY * sky + LIGHT * soft * 1.4) + LIGHT * spec * 0.55;

  return (body * look.y + through) * shadow + reflection * mix(0.5, 1.0, shadow) + rim * 0.95;
}

float contact(float dist, float blur) {
  float outside = -dist / uResolution.y;
  float drop = 1.0 - smoothstep(-blur * 0.5, SHADOW_REACH + blur, outside);
  return pow(drop, 1.6);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  p.x *= 1.0 - 2.0 * uMirror;
  float t = uTime;
  vec2 w = warp(p, t);

  float along = dot(p, vec2(0.8, 0.6));
  float blur = BLUR * pow(smoothstep(0.2, 0.85, abs(along - 0.02)), 1.4);

  float dist[SHEETS];
  vec2 dirs[SHEETS];
  float halves[SHEETS];
  for (int k = 0; k < SHEETS; k++) {
    vec4 g = GEOM[k];
    vec2 part = parts(k, w, t);
    vec2 radial = vec2(dFdx(part.x), dFdy(part.x));
    vec2 wobble = vec2(dFdx(part.y), dFdy(part.y));
    vec2 outer = wobble - radial;
    float outerLen = max(length(outer), 1e-6);
    float outerDist = (g.z - part.x + 0.5 * g.w + part.y) / outerLen;
    dist[k] = outerDist;
    dirs[k] = outer / outerLen;
    halves[k] = 0.0;

    if (g.w > 0.0) {
      vec2 inner = wobble + radial;
      float innerLen = max(length(inner), 1e-6);
      float innerDist = (part.x - g.z + 0.5 * g.w + part.y) / innerLen;
      halves[k] = max(0.5 * (outerDist + innerDist), 1e-3) / uResolution.y;
      dist[k] = min(outerDist, innerDist);
      dirs[k] = innerDist < outerDist ? inner / innerLen : dirs[k];
    }
  }

  vec3 color = mix(vec3(0.012, 0.014, 0.03), vec3(0.03, 0.04, 0.09), smoothstep(-0.6, 0.9, p.y - p.x * 0.3));

  for (int j = 0; j < SHEETS; j++) {
    color *= 1.0 - LOOK[j].w * contact(dist[j], blur + DEPTH[j]);
  }

  for (int k = 0; k < SHEETS; k++) {
    float shadow = 1.0;
    for (int j = k + 1; j < SHEETS; j++) {
      shadow *= 1.0 - LOOK[j].w * contact(dist[j], blur + DEPTH[j]);
    }

    float soft = blur + DEPTH[k];
    float aa = 0.75 + soft * uResolution.y;
    float cover = smoothstep(-aa, aa, dist[k]);

    if (cover > 0.0005) {
      float dw = dist[k] / uResolution.y;
      color = mix(color, shade(k, dw, halves[k], dirs[k], soft, shadow, color), cover);
    }
  }

  color += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
