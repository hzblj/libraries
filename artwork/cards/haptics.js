// The haptics card: the waveform it has always had, which on hover plays a
// haptic pattern, two sharp taps and then a longer rumble, each one running out
// from the middle and settling back into the resting shape.

const card = document.querySelector('.card')

// The bars' resting heights, measured off the card's first artwork.
const REST = [
  10, 17, 30, 34, 21, 10, 21, 43, 50, 28, 10, 23, 57, 66, 38, 11, 26, 68, 83, 46, 12, 23, 58, 68, 40, 12, 18, 43, 52,
  32, 12, 14, 30, 37, 23, 12, 12,
]

const BAR = 3
const PITCH = 6
const CENTER = {x: 145, y: 95}
const MIDDLE = (REST.length - 1) / 2

// Two taps and a rumble, as [start, strength, length] in seconds.
const EVENTS = [
  [0.1, 1, 0.22],
  [0.5, 0.85, 0.22],
  [1.15, 0.7, 1.1],
]

// How fast a pulse runs from the middle out to the ends, in wave-halves per second.
const SPEED = 2.6

// Each bar keeps its resting box and only scales on its centre line, so the
// motion is sub-pixel smooth instead of snapping to whole pixels.
const bars = REST.map((height, index) => {
  const bar = document.createElement('div')
  Object.assign(bar.style, {
    background: 'linear-gradient(180deg, #e9e9e9, #858585)',
    borderRadius: `${BAR / 2}px`,
    height: `${height}px`,
    left: `${CENTER.x + (index - MIDDLE) * PITCH - BAR / 2}px`,
    position: 'absolute',
    top: `${CENTER.y - height / 2}px`,
    width: `${BAR}px`,
  })
  card.append(bar)
  return bar
})

// How hard bar `index` is pushed at `t`: each event swells out from the middle,
// the rumble with a shiver in it.
const push = (index, t) => {
  const distance = Math.abs(index - MIDDLE) / MIDDLE
  let total = 0

  for (const [start, strength, length] of EVENTS) {
    const local = t - start - distance / SPEED

    if (local > 0 && local < length) {
      const shiver = length > 0.5 ? 0.75 + 0.25 * Math.sin(local * 70 + index) : 1
      total += strength * Math.sin((local / length) * Math.PI) * shiver
    }
  }

  return total
}

window.DURATION = 3

window.FPS = 60

window.frame = t => {
  bars.forEach((bar, index) => {
    bar.style.transform = `scaleY(${1 + 0.45 * push(index, t)})`
  })
}

window.frame(0)
