/**
 * Reading what is behind a pane of glass.
 *
 * Nothing on the web hands back the pixels a `backdrop-filter` is blurring —
 * there is no API for sampling a composited backdrop — so the colour is rebuilt
 * from the DOM instead. Hit-test a handful of points across the region, then
 * composite the stack each one returns front to back: artwork answers from a
 * 16×16 thumbnail of its decoded frame, a canvas from whatever sampler its
 * owner registered, everything else from its computed background colour, and
 * whatever transparency is left falls through to the page, which is black.
 *
 * Approximate on purpose. Gradient backgrounds are skipped — every one on the
 * site is a few per cent of white over the real colour — `object-position` is
 * taken as centred, and anything `pointer-events: none` is invisible to
 * hit-testing and so to this. None of that moves a light/dark decision.
 */

export type Rgb = {b: number; g: number; r: number}
export type Rgba = Rgb & {a: number}

// Small enough that a read costs nothing, coarse enough that a single bright
// pixel cannot swing the reading — which is what we want, since the blur behind
// the glass has averaged that pixel away long before it reaches the eye.
const THUMB = 16

// How far past the glass to look. A blur pulls in colour from outside the box it
// sits in, so the edge of a card just off the pill still tints it.
const INFLATE = 16

// A video frame is redrawn at most this often; stills are cached until their
// source changes.
const VIDEO_TTL = 400

// Centre plus the four corners, inset so a corner probe reads the backdrop
// rather than whatever the neighbouring element is doing at the very edge.
const PROBES = [
  {x: 0.5, y: 0.5},
  {x: 0.08, y: 0.12},
  {x: 0.92, y: 0.12},
  {x: 0.08, y: 0.88},
  {x: 0.92, y: 0.88},
]

// Assigning an unparseable colour to `fillStyle` silently leaves the old one in
// place, so the canvas fallback needs a value it can recognise as untouched.
// Anything on the site landing on exactly this would be a coincidence.
const SENTINEL = '#ff00ff'

const RGB_PATTERN = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+)(%?))?\s*\)$/i

type Thumb = {data: Uint8ClampedArray; key: string; takenAt: number}

const thumbs = new WeakMap<Element, Thumb>()
const colors = new Map<string, Rgba | null>()

let scratch: CanvasRenderingContext2D | null | undefined

/** One canvas for every read on the page — thumbnails and colour parsing both. */
const context = () => {
  if (scratch === undefined) {
    const canvas = document.createElement('canvas')
    canvas.width = THUMB
    canvas.height = THUMB
    scratch = canvas.getContext('2d', {willReadFrequently: true})
  }

  return scratch
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Any CSS colour, resolved by painting it. Computed styles come back as `rgb()`
 * most of the time, but Tailwind's opacity modifiers can serialise to `oklab()`
 * or `color()` depending on the browser, and a regex per syntax is a losing
 * game — the canvas already knows how to read every one of them.
 */
const paintColor = (value: string): Rgba | null => {
  const ctx = context()

  if (!ctx) {
    return null
  }

  ctx.fillStyle = SENTINEL
  ctx.fillStyle = value

  if (ctx.fillStyle === SENTINEL) {
    return null
  }

  ctx.clearRect(0, 0, 1, 1)
  ctx.fillRect(0, 0, 1, 1)

  const {data} = ctx.getImageData(0, 0, 1, 1)

  return {a: data[3] / 255, b: data[2], g: data[1], r: data[0]}
}

const parseColor = (value: string): Rgba | null => {
  const match = RGB_PATTERN.exec(value)

  if (!match) {
    return null
  }

  const alpha = match[4] === undefined ? 1 : Number(match[4]) / (match[5] ? 100 : 1)

  return {a: alpha, b: Number(match[3]), g: Number(match[2]), r: Number(match[1])}
}

/** Computed background colours repeat across hundreds of elements — cache them. */
const resolveColor = (value: string): Rgba | null => {
  if (!value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)') {
    return null
  }

  const cached = colors.get(value)

  if (cached !== undefined) {
    return cached
  }

  const resolved = parseColor(value) ?? paintColor(value)
  colors.set(value, resolved)

  return resolved
}

const thumbOf = (media: HTMLImageElement | HTMLVideoElement): Thumb | null => {
  const isVideo = media instanceof HTMLVideoElement
  const key = media.currentSrc || (isVideo ? '' : media.src)
  const now = Date.now()
  const cached = thumbs.get(media)

  if (cached && cached.key === key && (!isVideo || now - cached.takenAt < VIDEO_TTL)) {
    return cached
  }

  const ctx = context()
  const ready = isVideo ? media.readyState >= 2 : media.complete && media.naturalWidth > 0

  if (!ctx || !ready) {
    return null
  }

  try {
    ctx.clearRect(0, 0, THUMB, THUMB)
    ctx.drawImage(media, 0, 0, THUMB, THUMB)

    const thumb = {data: ctx.getImageData(0, 0, THUMB, THUMB).data, key, takenAt: now}
    thumbs.set(media, thumb)

    return thumb
  } catch {
    // A cross-origin frame taints the canvas and `getImageData` throws. Nothing
    // to read, so the layer under it answers instead.
    return null
  }
}

/**
 * Where a viewport point lands inside the source image, which is not where it
 * lands inside the element: `object-fit` crops one against the other.
 */
const sampleMedia = (media: HTMLImageElement | HTMLVideoElement, x: number, y: number): Rgba | null => {
  const isVideo = media instanceof HTMLVideoElement
  const naturalWidth = isVideo ? media.videoWidth : media.naturalWidth
  const naturalHeight = isVideo ? media.videoHeight : media.naturalHeight
  const rect = media.getBoundingClientRect()

  if (!rect.width || !rect.height || !naturalWidth || !naturalHeight) {
    return null
  }

  const fit = getComputedStyle(media).objectFit
  let u = (x - rect.left) / rect.width
  let v = (y - rect.top) / rect.height

  if (fit === 'cover' || fit === 'contain') {
    const scale =
      fit === 'cover'
        ? Math.max(rect.width / naturalWidth, rect.height / naturalHeight)
        : Math.min(rect.width / naturalWidth, rect.height / naturalHeight)

    const width = naturalWidth * scale
    const height = naturalHeight * scale

    u = (x - rect.left - (rect.width - width) / 2) / width
    v = (y - rect.top - (rect.height - height) / 2) / height
  }

  const thumb = thumbOf(media)

  if (!thumb) {
    return null
  }

  const px = Math.min(THUMB - 1, Math.floor(clamp01(u) * THUMB))
  const py = Math.min(THUMB - 1, Math.floor(clamp01(v) * THUMB))
  const i = (py * THUMB + px) * 4

  return {a: thumb.data[i + 3] / 255, b: thumb.data[i + 2], g: thumb.data[i + 1], r: thumb.data[i]}
}

export type CanvasSampler = (x: number, y: number) => Rgb | null

const canvasSamplers = new WeakMap<HTMLCanvasElement, CanvasSampler>()

export const registerCanvasSampler = (canvas: HTMLCanvasElement, sampler: CanvasSampler) => {
  canvasSamplers.set(canvas, sampler)

  return () => {
    canvasSamplers.delete(canvas)
  }
}

const sampleCanvas = (canvas: HTMLCanvasElement, x: number, y: number): Rgba | null => {
  const color = canvasSamplers.get(canvas)?.(x, y)

  return color ? {...color, a: 1} : null
}

const sampleElement = (el: Element, x: number, y: number): Rgba | null => {
  if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) {
    return sampleMedia(el, x, y)
  }

  if (el instanceof HTMLCanvasElement) {
    return sampleCanvas(el, x, y)
  }

  // SVG glyphs and the like: too thin to matter, and letting them answer would
  // have an icon read its own stroke. What is behind them answers instead.
  if (!(el instanceof HTMLElement)) {
    return null
  }

  return resolveColor(getComputedStyle(el).backgroundColor)
}

const readPoint = (x: number, y: number): Rgb | null => {
  const stack = document.elementsFromPoint(x, y)

  if (!stack.length) {
    return null
  }

  let r = 0
  let g = 0
  let b = 0
  let remaining = 1

  for (const el of stack) {
    // Skip every pane of glass, not only the one being measured: two pills sit
    // side by side in the dock, and a probe that reads a neighbour would have
    // each one chasing the other's tint.
    if (el.closest('[data-glass]')) {
      continue
    }

    const layer = sampleElement(el, x, y)

    if (!layer || layer.a <= 0) {
      continue
    }

    const weight = layer.a * remaining
    r += layer.r * weight
    g += layer.g * weight
    b += layer.b * weight
    remaining -= weight

    if (remaining <= 0.004) {
      break
    }
  }

  // Whatever transparency is left shows the page itself, which is black — so
  // there is nothing to add for it.
  return {b, g, r}
}

/**
 * The average colour behind `rect`, or `null` when there was nothing on screen
 * to read.
 */
export const readBackdrop = (rect: DOMRect, inflate = INFLATE): Rgb | null => {
  const left = rect.left - inflate
  const top = rect.top - inflate
  const width = rect.width + inflate * 2
  const height = rect.height + inflate * 2

  if (left + width < 0 || top + height < 0 || left > window.innerWidth || top > window.innerHeight) {
    return null
  }

  let r = 0
  let g = 0
  let b = 0
  let hits = 0

  for (const probe of PROBES) {
    const x = Math.min(window.innerWidth - 1, Math.max(0, left + width * probe.x))
    const y = Math.min(window.innerHeight - 1, Math.max(0, top + height * probe.y))
    const color = readPoint(x, y)

    if (!color) {
      continue
    }

    r += color.r
    g += color.g
    b += color.b
    hits += 1
  }

  if (!hits) {
    return null
  }

  return {b: b / hits, g: g / hits, r: r / hits}
}

const channel = (value: number) => {
  const srgb = value / 255

  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance. */
export const luminance = ({b, g, r}: Rgb) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

/** WCAG contrast ratio, 1 (identical) to 21 (black on white). */
export const contrast = (a: Rgb, b: Rgb) => {
  const first = luminance(a)
  const second = luminance(b)

  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

/** Source-over: a translucent layer resting on an opaque one. */
export const over = (top: Rgba, bottom: Rgb): Rgb => ({
  b: top.b * top.a + bottom.b * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  r: top.r * top.a + bottom.r * (1 - top.a),
})

/** How far apart two readings are, on the widest channel. */
export const spread = (a: Rgb, b: Rgb) => Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b))
