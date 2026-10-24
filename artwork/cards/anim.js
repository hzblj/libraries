// Time-driven helpers for the animated cards. render.mjs calls `window.frame(t)`
// for every frame, so everything here is a pure function of time and a loop
// lands back on its first frame at `DURATION`.

// A spring's step response from 0 to 1: a touch of overshoot, settled well
// inside `settle` seconds. iOS-like, where a short ease-out reads as jerky.
export const spring = (t, settle = 0.7, damping = 0.78) => {
  if (t <= 0) {
    return 0
  }

  const omega = 9 / settle
  const decay = damping * omega
  const ringing = omega * Math.sqrt(1 - damping * damping)

  return 1 - Math.exp(-decay * t) * (Math.cos(ringing * t) + (decay / ringing) * Math.sin(ringing * t))
}

// Steps through `count` positions, one every `step` seconds, each move a spring
// that starts at the top of its step: 0, then 1, 2 … back to `count` ≡ 0.
export const stepper = (t, step, settle) => {
  const index = Math.floor(t / step)

  return index + spring(t - index * step, settle)
}

// Piecewise-linear lookup of `values` at a fractional `index`.
export const along = (values, index) => {
  const clamped = Math.min(Math.max(index, 0), values.length - 1)
  const low = Math.floor(clamped)
  const high = Math.min(low + 1, values.length - 1)

  return values[low] + (values[high] - values[low]) * (clamped - low)
}

export const wrap = (value, size) => ((((value + size / 2) % size) + size) % size) - size / 2

export const mix = (from, to, amount) => from + (to - from) * amount

// iOS draws icons in a continuous-corner squircle, not a rounded rect.
export const squirclePoints = (size, n = 5, steps = 240) => {
  const half = size / 2
  const points = []

  for (let index = 0; index < steps; index++) {
    const angle = (index / steps) * Math.PI * 2
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    points.push(
      `${(half + half * Math.sign(cos) * Math.abs(cos) ** (2 / n)).toFixed(3)},${(half + half * Math.sign(sin) * Math.abs(sin) ** (2 / n)).toFixed(3)}`
    )
  }

  return points.join(' ')
}

export const squircleMask = () =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="${squirclePoints(100)}"/></svg>`
  )}")`
