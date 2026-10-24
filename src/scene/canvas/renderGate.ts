import {view} from '../camera'
import {morph} from '../state'

const NONE = -1e9
const MAX_FPS = 120
const FRAME = 1000 / MAX_FPS
const CAPPED_ABOVE = 1000 / 130
const JITTER = 1

const pace = {interval: FRAME, next: Number.NEGATIVE_INFINITY}

export const frameDue = (now: number, delta: number) => {
  if (delta > 0 && delta < 0.1) {
    pace.interval += (delta * 1000 - pace.interval) * 0.1
  }

  if (pace.interval >= CAPPED_ABOVE) {
    pace.next = now
    return true
  }

  if (now < pace.next - JITTER) {
    return false
  }

  pace.next = now - pace.next > FRAME ? now + FRAME : pace.next + FRAME

  return true
}

const seen = {
  backdrop: NONE,
  glassHeight: NONE,
  glassWidth: NONE,
  glassX: NONE,
  glassY: NONE,
  height: NONE,
  page: NONE,
  progress: NONE,
  ratio: NONE,
  scale: NONE,
  stage: '',
  width: NONE,
  x: NONE,
  y: NONE,
}

export const viewMoved = (width: number, height: number, ratio: number) => {
  const moved =
    view.x !== seen.x ||
    view.y !== seen.y ||
    view.scale !== seen.scale ||
    width !== seen.width ||
    height !== seen.height ||
    ratio !== seen.ratio

  seen.x = view.x
  seen.y = view.y
  seen.scale = view.scale
  seen.width = width
  seen.height = height
  seen.ratio = ratio

  return moved
}

export const morphChanged = () => {
  const glassX = morph.glassRect?.x ?? NONE
  const glassY = morph.glassRect?.y ?? NONE
  const glassWidth = morph.glassRect?.width ?? NONE
  const glassHeight = morph.glassRect?.height ?? NONE
  const changed =
    morph.stage !== seen.stage ||
    morph.progress !== seen.progress ||
    morph.backdrop !== seen.backdrop ||
    morph.page !== seen.page ||
    glassX !== seen.glassX ||
    glassY !== seen.glassY ||
    glassWidth !== seen.glassWidth ||
    glassHeight !== seen.glassHeight

  seen.stage = morph.stage
  seen.progress = morph.progress
  seen.backdrop = morph.backdrop
  seen.page = morph.page
  seen.glassX = glassX
  seen.glassY = glassY
  seen.glassWidth = glassWidth
  seen.glassHeight = glassHeight

  return changed
}
