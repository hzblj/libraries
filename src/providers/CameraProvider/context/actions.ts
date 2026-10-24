import {Config} from '@/config'
import {isBool} from '@/utils'

import {calculateScale, clampZoom, KEEP_VISIBLE} from '../const'
import {CameraAction, CameraOffset, CameraState, CameraZoom} from './types'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

// Stops the camera once only KEEP_VISIBLE of the collection is left on screen
// on any side. The view's centre in grid space is `camera - origin` plus half
// the visible size (scene/camera/view.ts), so the limits are set on the centre.
const keepInView = ({camera, origin, scale}: Pick<CameraState, 'camera' | 'origin' | 'scale'>): CameraOffset => {
  if (typeof window === 'undefined') {
    return camera
  }

  const width = window.visualViewport?.width || window.innerWidth
  const height = window.visualViewport?.height || window.innerHeight
  const zoom = calculateScale(width) * scale
  const half = {x: width / (2 * zoom), y: height / (2 * zoom)}
  const centre = {x: camera.x - origin.x + half.x, y: camera.y - origin.y + half.y}

  return {
    x: clamp(centre.x, KEEP_VISIBLE.x - half.x, Config.viewport.width - KEEP_VISIBLE.x + half.x) + origin.x - half.x,
    y: clamp(centre.y, KEEP_VISIBLE.y - half.y, Config.viewport.height - KEEP_VISIBLE.y + half.y) + origin.y - half.y,
  }
}

export const actionOnScroll = (dispatch: CameraAction, offset: CameraOffset) =>
  dispatch(draft => {
    const {x, y} = offset

    // Pan happens in unscaled grid space, but the viewport is rendered at
    // `scale`. Dividing by it keeps panning 1:1 with on-screen pixels while
    // zoomed in (at scale 1 this is a no-op, so existing behavior is untouched).
    const scale = draft.scale

    const camera = keepInView({
      camera: {x: draft.camera.x + x / scale, y: draft.camera.y + y / scale},
      origin: draft.origin,
      scale,
    })

    if (camera.x === draft.camera.x && camera.y === draft.camera.y) {
      return draft
    }

    return {...draft, camera}
  })

// Zoom toward a fixed screen point (`focal`, in client pixels): keep the grid
// content under `focal` anchored while `scale` changes. Solving
// `screen = base * scale * (world - camera)` for a constant `world` under
// `focal` gives `camera' = camera + focal / base * (1 / scale - 1 / scale')`,
// where `base` is the responsive CSS breakpoint scale applied by the ancestor.
export const actionOnZoom = (dispatch: CameraAction, {focal, minScale, scaleBy, scaleTo}: CameraZoom) =>
  dispatch(draft => {
    const scale = draft.scale
    const target = typeof scaleTo === 'number' ? scaleTo : scale * (scaleBy ?? 1)
    const nextScale = clampZoom(target, minScale)

    if (nextScale === scale) {
      return draft
    }

    const base = typeof window === 'undefined' ? 1 : calculateScale(window.innerWidth)
    const factor = (1 / scale - 1 / nextScale) / base

    const camera = keepInView({
      camera: {x: draft.camera.x + focal.x * factor, y: draft.camera.y + focal.y * factor},
      origin: draft.origin,
      scale: nextScale,
    })

    return {...draft, camera, scale: nextScale}
  })

export const actionToggleModal = (dispatch: CameraAction, isOpen?: boolean) =>
  dispatch(draft => {
    return {
      ...draft,
      isModalOpen: isBool(isOpen) ? isOpen : !draft.isModalOpen,
    }
  })
