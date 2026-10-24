import {INK, type TextStyle, type TextTexture} from '../../graphics'
import type {Rect} from '../../grid'
import {RAMP_HEIGHT} from './useRampTexture'

export const FOOT_LABEL: TextStyle = {gradient: INK, gradientHeight: 53, lineHeight: 21, shadow: true, size: 14}
export const FOOT_LABEL_OPACITY = 0.7

export const footRampRect = ({x, y, width, height}: Rect): Rect => ({
  height: RAMP_HEIGHT,
  width,
  x,
  y: y + height - RAMP_HEIGHT,
})

export const footLabelRect = ({x, y, width, height}: Rect, {box, width: textWidth}: TextTexture): Rect => ({
  height: box.height,
  width: box.width,
  x: x + width / 2 - textWidth / 2 + box.x,
  y: y + height - 32 - 21 + box.y,
})
