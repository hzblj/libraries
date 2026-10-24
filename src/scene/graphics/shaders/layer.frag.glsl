uniform vec4 uRect;
uniform float uRadius;
uniform float uBleed;
uniform float uBlur;
uniform vec4 uClip;
uniform float uClipRadius;
uniform sampler2D uMap;
uniform float uHasMap;
uniform vec2 uMapSize;
uniform vec2 uMapPosition;
uniform sampler2D uVideo;
uniform vec2 uVideoSize;
uniform float uVideoMix;
uniform vec4 uColor;
uniform float uOpacity;
uniform float uRingWidth;
uniform vec4 uRingColor;
uniform float uAlphaGamma;

varying vec2 vUv;

vec4 sampleInside(sampler2D map, vec2 uv) {
  if (uBleed <= 0.0) {
    return texture2D(map, uv);
  }

  vec2 inside = step(vec2(0.0), uv) * step(uv, vec2(1.0));

  return texture2D(map, uv) * inside.x * inside.y;
}

vec4 sampleBlurred(sampler2D map, vec2 uv, vec2 size) {
  if (uBlur <= 0.0) {
    return sampleInside(map, uv);
  }

  vec2 reach = 2.0 * uBlur / size;
  vec4 sum = vec4(0.0);
  float total = 0.0;

  for (int x = -3; x <= 3; x++) {
    for (int y = -3; y <= 3; y++) {
      vec2 offset = vec2(float(x), float(y)) / 3.0;
      float weight = exp(-2.0 * dot(offset, offset));
      sum += sampleInside(map, uv + offset * reach) * weight;
      total += weight;
    }
  }

  return sum / total;
}

float edge(float d) {
  if (uBleed <= 0.0) {
    return coverage(d);
  }

  if (uRadius <= 0.0) {
    return 1.0;
  }

  return clamp(0.5 - d / max(fwidth(d), uBlur * 2.0), 0.0, 1.0);
}

void main() {
  vec2 size = uRect.zw;
  vec2 local = vec2(vUv.x, 1.0 - vUv.y) * (size + 2.0 * uBleed) - uBleed;
  vec2 uv = vec2(local.x / size.x, 1.0 - local.y / size.y);
  float d = roundedBox(local - size * 0.5, size * 0.5, uRadius);
  float shape = edge(d);
  float clip = 1.0;

  if (uClip.z > 0.0) {
    vec2 host = uRect.xy + local;
    clip = coverage(roundedBox(host - uClip.xy - uClip.zw * 0.5, uClip.zw * 0.5, uClipRadius));
  }

  vec4 color = premultiply(uColor);

  if (uHasMap > 0.5) {
    vec4 texel = sampleBlurred(uMap, cover(uv, size, uMapSize, uMapPosition), size);

    if (uVideoMix > 0.0) {
      texel = mix(texel, texture2D(uVideo, cover(uv, size, uVideoSize, vec2(0.5))), uVideoMix);
    }

    if (uAlphaGamma != 1.0 && texel.a > 0.0) {
      texel *= pow(texel.a, uAlphaGamma) / texel.a;
    }

    color = texel * color;
  }

  if (uRingWidth > 0.0) {
    vec4 ring = premultiply(uRingColor) * max(shape - coverage(d + uRingWidth), 0.0);
    color = ring + color * (1.0 - ring.a);
  }

  gl_FragColor = color * shape * clip * uOpacity;
}
