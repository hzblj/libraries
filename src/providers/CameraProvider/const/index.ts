import {Config} from '@/config'

// On desktop, zoom is restricted to enlarging the canvas (>= 1): zooming out
// below 1 would let the visible area in grid space grow past a single tile, and
// every card is only ever drawn in two copies per axis.
//
// On mobile pinch may shrink down to MOBILE_MIN_ZOOM, but never past fitZoom:
// the 3060x1170 tile is small next to the portfolio's, so a phone held upright
// fits its whole height well before that.
export const MIN_ZOOM = 1
export const MOBILE_MIN_ZOOM = 0.5
export const MAX_ZOOM = 2
export const ZOOM_STEP = 0.25
// Per ctrl+wheel step. A discrete mouse-wheel notch jumps by a fixed ~12 %,
// while a trackpad pinch (many tiny events) moves proportionally so it stays
// smooth. deltaY at/above the threshold is treated as a mouse notch — on macOS
// Chrome a mouse notch is ~120 while pinch events are ~1–10.
export const ZOOM_WHEEL_STEP = 0.12
export const ZOOM_TRACKPAD_SENSITIVITY = 0.01
export const WHEEL_NOTCH_THRESHOLD = 50

export const clampZoom = (scale: number, min: number = MIN_ZOOM) => Math.min(MAX_ZOOM, Math.max(min, scale))

// Snap to the nearest ZOOM_STEP then move one step, so the buttons always land
// on clean values (100 %, 125 %, … 200 %) regardless of where wheel zoom left off.
export const stepZoom = (scale: number, direction: 1 | -1, min: number = MIN_ZOOM) =>
  clampZoom((Math.round(scale / ZOOM_STEP) + direction) * ZOOM_STEP, min)

const breakpointScale = (width: number) => {
  if (width <= 767) {
    return 0.86 // Mobile
  } else if (width >= 768 && width <= 1023) {
    return 1.0 // Tablet
  } else if (width >= 1024 && width < 1920) {
    return 1.0 // Small desktop
  } else if (width >= 1920 && width < 2560) {
    return 1.0 // Full HD
  } else if (width >= 2560 && width < 3440) {
    return 1.1 // QHD / 4xl
  } else if (width >= 3440 && width < 3840) {
    return 1.5 // Ultrawide
  } else if (width >= 3840 && width < 5120) {
    return 1.75 // 5xl / 4K
  } else if (width >= 5120) {
    return 2.0 // 6xl / 5K+
  }

  return 1.0
}

// The breakpoint scale, raised wherever the screen would otherwise take in more
// than one tile of the grid, the whole collection and some of it over again.
export const calculateScale = (width: number, height: number) =>
  Math.max(breakpointScale(width), width / Config.viewport.width, height / Config.viewport.height)

// The least zoom that still keeps the screen within one tile. At most 1, as
// calculateScale already fits a tile, so it only ever holds back a pinch on touch.
export const fitZoom = (width: number, height: number) => {
  const base = calculateScale(width, height)

  return Math.max(width / (Config.viewport.width * base), height / (Config.viewport.height * base))
}
