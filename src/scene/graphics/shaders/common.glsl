float roundedBox(vec2 p, vec2 halfSize, float radius) {
  radius = min(radius, min(halfSize.x, halfSize.y));
  vec2 q = abs(p) - halfSize + radius;

  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

float coverage(float d) {
  return clamp(0.5 - d / max(fwidth(d), 1e-4), 0.0, 1.0);
}

vec2 cover(vec2 uv, vec2 box, vec2 natural, vec2 position) {
  if (natural.x <= 0.0 || natural.y <= 0.0) {
    return uv;
  }

  vec2 shown = natural * max(box.x / natural.x, box.y / natural.y);
  vec2 visible = box / shown;

  return uv * visible + (1.0 - visible) * vec2(position.x, 1.0 - position.y);
}

vec4 premultiply(vec4 color) {
  return vec4(color.rgb * color.a, color.a);
}
