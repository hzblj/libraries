'use client'

import {useCallback, useEffect, useState} from 'react'

import {contrast, over, type Rgb, type Rgba, readBackdrop, spread} from '@/lib'

export type GlassTone = 'dark' | 'light'

type ToneStyle = {border: Rgba; hover: Rgba; ink: Rgba; tint: Rgba}

/**
 * The two faces of the glass. Kept as numbers rather than strings because the
 * choice between them is arithmetic: each one is composited over the measured
 * backdrop and scored on the contrast its ink would end up with, so changing a
 * tint here changes when that tint gets used, with no threshold to retune.
 *
 * `dark` is the resting look and has to stay in step with the `glass` utility
 * in `app.css`, which is what paints before this hook has read anything — and
 * what paints for good where reading is switched off.
 */
const TONES: Record<GlassTone, ToneStyle> = {
  // A whisper of white with white ink: glass over a dark canvas.
  dark: {
    border: {a: 0.15, b: 255, g: 255, r: 255},
    hover: {a: 0.18, b: 255, g: 255, r: 255},
    ink: {a: 1, b: 255, g: 255, r: 255},
    tint: {a: 0.1, b: 255, g: 255, r: 255},
  },
  // Frosted white with near-black ink: glass over artwork bright enough that
  // white would disappear into it. The edge turns over with the rest — a white
  // one has nothing to sit against once the pill is the lighter of the two, and
  // the control loses its shape.
  light: {
    border: {a: 0.14, b: 22, g: 20, r: 18},
    hover: {a: 0.74, b: 255, g: 255, r: 255},
    ink: {a: 1, b: 22, g: 20, r: 18},
    tint: {a: 0.58, b: 255, g: 255, r: 255},
  },
}

// Reading rate while the canvas is moving, and once it has settled. Neither is
// a frame rate: the glass crossfades over a third of a second, so nothing is
// gained by measuring faster than it can change.
const ACTIVE_INTERVAL = 90
const IDLE_INTERVAL = 450

// How long after the last movement the fast rate is kept.
const ACTIVE_WINDOW = 1200

// Where the resting tone stops carrying its ink, and where it is comfortably
// carrying it again. Two figures rather than one, or the glass sits on the
// boundary turning over and back: 4.5:1 is the WCAG floor for strokes this
// weight, and it only returns once there is real room again.
//
// A floor rather than a contest between the two tones. Frosted white scores
// better on anything past a dark grey, so picking the winner outright would
// have the dock turn over across half the canvas — which is a different design,
// not a more legible one.
const INK_FLOOR = 4.5
const INK_RECOVER = 5.5

// How long a reading has to hold before the glass acts on it. Without it the
// glass strobes on every card edge the camera crosses — iOS steps the same way,
// once the reading has settled.
const FLIP_DWELL = 220

// A reading further than this from the last one counts as the canvas having
// moved, which is what puts the loop back on the fast rate.
const MOVED = 6

type Pane = {
  el: HTMLElement
  hidden: boolean
  last: Rgb | null
  pending: GlassTone | null
  pendingSince: number
  tone: GlassTone
}

const panes = new Set<Pane>()

let frame = 0
let lastRun = 0
let lastMove = 0

const css = ({a, b, g, r}: Rgba) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`

const apply = (pane: Pane, tone: GlassTone) => {
  const style = TONES[tone]

  pane.tone = tone
  pane.el.dataset.glassTone = tone
  pane.el.style.setProperty('--glass-tint', css(style.tint))
  pane.el.style.setProperty('--glass-ink', css(style.ink))
  pane.el.style.setProperty('--glass-border', css(style.border))
  pane.el.style.setProperty('--glass-hover', css(style.hover))
}

/** Contrast the ink would land at, once this tone is laid over that backdrop. */
const score = (tone: ToneStyle, backdrop: Rgb) => contrast(tone.ink, over(tone.tint, backdrop))

const measure = (pane: Pane, now: number) => {
  // A control that has faded out is not on screen to be read, and the dock
  // spends the whole intro hidden — no sense spending hit-tests on either. What
  // it was last read over is stale from here on, so it comes back without a
  // dwell rather than wearing the old tone into view and correcting a beat
  // later.
  if (!pane.el.isConnected || pane.el.checkVisibility?.({opacityProperty: true, visibilityProperty: true}) === false) {
    pane.hidden = true
    pane.pending = null

    return
  }

  const rect = pane.el.getBoundingClientRect()

  if (!rect.width || !rect.height) {
    return
  }

  const backdrop = readBackdrop(rect)

  if (!backdrop) {
    return
  }

  if (!pane.last || spread(pane.last, backdrop) > MOVED) {
    lastMove = now
  }

  pane.last = backdrop

  const resting = score(TONES.dark, backdrop)
  const wanted: GlassTone =
    pane.tone === 'dark'
      ? resting < INK_FLOOR && score(TONES.light, backdrop) > resting
        ? 'light'
        : 'dark'
      : resting > INK_RECOVER
        ? 'dark'
        : 'light'

  const returning = pane.hidden
  pane.hidden = false

  if (wanted === pane.tone) {
    pane.pending = null

    return
  }

  if (returning) {
    pane.pending = null
    apply(pane, wanted)

    return
  }

  if (pane.pending !== wanted) {
    pane.pending = wanted
    pane.pendingSince = now

    return
  }

  if (now - pane.pendingSince < FLIP_DWELL) {
    return
  }

  pane.pending = null
  apply(pane, wanted)
}

// Driven from one loop rather than one per pane, so the whole dock is read
// against the same frame. `requestAnimationFrame` stops on a hidden tab by
// itself, which is the only pausing this needs.
const tick = (now: number) => {
  frame = requestAnimationFrame(tick)

  const interval = now - lastMove < ACTIVE_WINDOW ? ACTIVE_INTERVAL : IDLE_INTERVAL

  if (now - lastRun < interval) {
    return
  }

  lastRun = now

  for (const pane of panes) {
    measure(pane, now)
  }
}

const register = (el: HTMLElement) => {
  // Starts hidden as far as the loop is concerned: a control mounts either
  // behind the intro or already faded out, and its first real reading is the
  // one it should be wearing when it arrives.
  const pane: Pane = {el, hidden: true, last: null, pending: null, pendingSince: 0, tone: 'dark'}

  // Marks the element for `readBackdrop`, which steps over every pane of glass
  // it meets on the way down rather than reading one through another.
  el.dataset.glass = ''
  apply(pane, 'dark')
  panes.add(pane)

  if (!frame) {
    frame = requestAnimationFrame(tick)
  }

  return () => {
    panes.delete(pane)

    if (!panes.size && frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }
}

// Someone who has asked for less transparency, or is running forced colours, is
// asking the interface to stop being clever about what shows through it.
const supported = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-transparency: reduce)').matches &&
  !window.matchMedia('(forced-colors: active)').matches

/**
 * Turns a floating control into glass that reads what it is over. Samples the
 * backdrop behind the element and flips it between a dark and a light tone —
 * whichever gives its ink more contrast — through the `--glass-*` custom
 * properties the `glass` utility paints from.
 *
 * The element arrives through a callback ref rather than one passed in, for the
 * same reason [useControlFade] takes one: these controls portal into the dock
 * and so attach a render after they mount, and a ref object would still be
 * empty when the effect first runs.
 */
export const useAdaptiveGlass = <T extends HTMLElement = HTMLElement>(enabled = true) => {
  const [element, setElement] = useState<T | null>(null)

  const ref = useCallback((node: T | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element || !enabled || !supported()) {
      return
    }

    return register(element)
  }, [element, enabled])

  return ref
}
