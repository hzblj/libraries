import {Config} from '@/config'

import {mod, type Rect} from './geometry'

// The profile in the middle, two columns by one row as on the portfolio, and
// the collection round it: big cards above and below it, small ones on either
// side, and the examples running down the left edge. `.` is a hole. Every
// library is one cell or two by two, so all of them keep the 4:3 of the
// modal's media and open into it without a crop; the profile and the examples
// list open nothing, so they take whatever shape suits them.
// biome-ignore format: one row per line, so the template reads as the grid
const TEMPLATE = [
  'examples l1 l1 s1 l2 l2 l3 l3',
  'examples l1 l1 s2 l2 l2 l3 l3',
  'examples s3 s4 profile profile s5 s6 s7',
  'l4 l4 l5 l5 l6 l6 l7 l7',
  'l4 l4 l5 l5 l6 l6 l7 l7',
]

const HOLE = '.'

const COLUMN = 290
const ROW = 218
const GAP = 16
// Half a gap on every side of the tile, so its copies sit one gap apart and
// the profile's centre is the tile's, where the camera starts.
const PADDING = GAP / 2

type Bounds = {left: number; right: number; top: number; bottom: number}

export const PERIOD = {x: Config.viewport.width, y: Config.viewport.height}

const measureAreas = () => {
  const bounds = new Map<string, Bounds>()

  TEMPLATE.forEach((row, rowIndex) => {
    row.split(' ').forEach((name, columnIndex) => {
      if (name === HOLE) {
        return
      }

      const current = bounds.get(name)

      bounds.set(name, {
        bottom: Math.max(current?.bottom ?? rowIndex, rowIndex),
        left: Math.min(current?.left ?? columnIndex, columnIndex),
        right: Math.max(current?.right ?? columnIndex, columnIndex),
        top: Math.min(current?.top ?? rowIndex, rowIndex),
      })
    })
  })

  const rects = new Map<string, Rect>()

  for (const [name, {left, right, top, bottom}] of bounds) {
    rects.set(name, {
      height: (bottom - top + 1) * (ROW + GAP) - GAP,
      width: (right - left + 1) * (COLUMN + GAP) - GAP,
      x: PADDING + left * (COLUMN + GAP),
      y: PADDING + top * (ROW + GAP),
    })
  }

  return rects
}

const areas = measureAreas()

export const getAreaRect = (area: string): Rect => {
  const rect = areas.get(area)

  if (!rect) {
    throw new Error(`No grid area named "${area}"`)
  }

  return rect
}

export const firstCopy = (start: number, length: number, period: number, from: number) =>
  Math.floor((from - start - length) / period) + 1

export const slotOfCopy = (copyX: number, copyY: number) => mod(copyX, 2) + 2 * mod(copyY, 2)
