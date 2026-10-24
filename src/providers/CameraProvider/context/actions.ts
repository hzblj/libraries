import {isBool} from '@/utils'

import {calculateScale, clampZoom, fitZoom, MIN_ZOOM} from '../const'
import {CameraAction, CameraOffset, CameraState, CameraZoom} from './types'

export const actionOnScroll = (dispatch: CameraAction, offset: CameraOffset) =>
  dispatch(draft => {
    const {x, y} = offset

    // Pan happens in unscaled grid space, but the viewport is rendered at
    // `scale`. Dividing by it keeps panning 1:1 with on-screen pixels while
    // zoomed in (at scale 1 this is a no-op, so existing behavior is untouched).
    const scale = draft.scale

    const newState: CameraState = {
      ...draft,
      camera: {
        x: draft.camera.x + x / scale,
        y: draft.camera.y + y / scale,
      },
    }

    return newState
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
    const floor = typeof window === 'undefined' ? 0 : fitZoom(window.innerWidth, window.innerHeight)
    const nextScale = clampZoom(target, Math.max(minScale ?? MIN_ZOOM, floor))

    if (nextScale === scale) {
      return draft
    }

    const base = typeof window === 'undefined' ? 1 : calculateScale(window.innerWidth, window.innerHeight)
    const factor = (1 / scale - 1 / nextScale) / base

    const newState: CameraState = {
      ...draft,
      camera: {
        x: draft.camera.x + focal.x * factor,
        y: draft.camera.y + focal.y * factor,
      },
      scale: nextScale,
    }

    return newState
  })

export const actionToggleModal = (dispatch: CameraAction, isOpen?: boolean) =>
  dispatch(draft => {
    return {
      ...draft,
      isModalOpen: isBool(isOpen) ? isOpen : !draft.isModalOpen,
    }
  })
