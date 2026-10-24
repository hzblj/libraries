import type {RGBA, TextStyle} from '../../graphics'

export const WIDTH = 596
export const HEIGHT = 218

export const CLIP = {height: HEIGHT - 2, width: WIDTH - 2, x: 1, y: 1}
export const CARTOGRAM = {height: HEIGHT - 4, width: WIDTH - 4, x: 2, y: 2}

export const PIN = {
  x: CARTOGRAM.x + CARTOGRAM.width - 150 - 44,
  y: CARTOGRAM.y + CARTOGRAM.height - 100 - 44,
}

export const PULSE_COLOR: RGBA = [27 / 255, 136 / 255, 1, 0.4]
export const PIN_COLOR: RGBA = [27 / 255, 136 / 255, 1, 1]

export const CITY: TextStyle = {color: '#ffffff', lineHeight: 24, size: 14, weight: 500}
