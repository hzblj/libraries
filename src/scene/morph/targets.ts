import {screenToWorld, view} from '../camera'
import type {Rect} from '../grid'
import {morphTargets} from '../state'

let radii = new WeakMap<HTMLElement, number>()

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    radii = new WeakMap()
  })
}

const radiusOf = (element: HTMLElement | null) => {
  if (!element) {
    return 0
  }

  let radius = radii.get(element)

  if (radius === undefined) {
    radius = Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0
    radii.set(element, radius)
  }

  return radius
}

export type MorphTargets = {
  media: Rect | null
  mediaRadius: number
  surface: Rect
  surfaceRadius: number
}

export const measureTargets = (): MorphTargets | null => {
  const {surface, media} = morphTargets

  if (!surface) {
    return null
  }

  return {
    media: media ? screenToWorld(media.getBoundingClientRect()) : null,
    mediaRadius: radiusOf(media) / view.scale,
    surface: screenToWorld(surface.getBoundingClientRect()),
    surfaceRadius: radiusOf(surface) / view.scale,
  }
}
