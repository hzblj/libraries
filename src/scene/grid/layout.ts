import {Config} from '@/config'

import {mod, type Rect} from './geometry'

// A pinwheel round the profile, which sits dead centre: a big card in each
// corner and two small ones on every arm between them, so the collection
// opens out evenly on every side. `.` is a hole. Every card is one cell or two
// by two, so all of them keep the 4:3 of the modal's media and open into it
// without a crop.
// biome-ignore format: one row per line, so the template reads as the grid
const TEMPLATE = [
  'l1 l1 s1 l3 l3',
  'l1 l1 s2 l3 l3',
  's3 s4 profile s5 s6',
  'l4 l4 s7 l2 l2',
  'l4 l4 s8 l2 l2',
]

const HOLE = '.'

const COLUMN = 290
const ROW = 218
const GAP = 16
const PADDING = 2

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
