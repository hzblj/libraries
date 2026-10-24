import {calculateScale} from '@/providers/CameraProvider/const'
import type {CameraOffset} from '@/providers/CameraProvider/context/types'

import {PERIOD, type Rect, slotOfCopy} from '../grid'

export const cameraInput = {
  camera: {x: 0, y: 0} as CameraOffset,
  origin: {x: 0, y: 0} as CameraOffset,
  scale: 1,
}

export const view = {
  height: 0,
  movedAt: 0,
  scale: 1,
  width: 0,
  x: 0,
  y: 0,
}

export const updateView = (width: number, height: number) => {
  const scale = calculateScale(width, height) * cameraInput.scale
  const x = cameraInput.camera.x - cameraInput.origin.x + width / (2 * scale)
  const y = cameraInput.camera.y - cameraInput.origin.y + height / (2 * scale)

  if (x !== view.x || y !== view.y || scale !== view.scale) {
    view.movedAt = performance.now()
  }

  view.x = x
  view.y = y
  view.width = width
  view.height = height
  view.scale = scale
}

export const viewBounds = () => {
  const halfWidth = view.width / (2 * view.scale)
  const halfHeight = view.height / (2 * view.scale)

  return {bottom: view.y + halfHeight, left: view.x - halfWidth, right: view.x + halfWidth, top: view.y - halfHeight}
}

export const worldToScreen = ({x, y, width, height}: Rect): Rect => ({
  height: height * view.scale,
  width: width * view.scale,
  x: (x - view.x) * view.scale + view.width / 2,
  y: (y - view.y) * view.scale + view.height / 2,
})

export const screenToWorld = ({
  left,
  top,
  width,
  height,
}: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>): Rect => ({
  height: height / view.scale,
  width: width / view.scale,
  x: (left - view.width / 2) / view.scale + view.x,
  y: (top - view.height / 2) / view.scale + view.y,
})

export const nearestCopy = (rect: Rect) => {
  const copyX = Math.round((view.x - rect.x - rect.width / 2) / PERIOD.x)
  const copyY = Math.round((view.y - rect.y - rect.height / 2) / PERIOD.y)

  return {
    rect: {...rect, x: rect.x + copyX * PERIOD.x, y: rect.y + copyY * PERIOD.y},
    slot: slotOfCopy(copyX, copyY),
  }
}

export const nearestScreenRect = (rect: Rect): Rect => worldToScreen(nearestCopy(rect).rect)
