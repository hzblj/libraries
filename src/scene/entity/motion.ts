import type {Rect} from '../grid'

export type Motion = {x?: number; y?: number; scale?: number; opacity?: number; width?: number; blur?: number}

export type Pivot = {x: number; y: number; scale: number}

type Placement = Rect & {scale: number}

export type Motions = Motion | readonly Motion[]

const isMotionList = (motion: Motions): motion is readonly Motion[] => Array.isArray(motion)

const toList = (motion?: Motions): readonly Motion[] => {
  if (!motion) {
    return []
  }

  return isMotionList(motion) ? motion : [motion]
}

export const offsetOf = (motion: Motions | undefined, key: 'x' | 'y' | 'blur') =>
  toList(motion).reduce((sum, each) => sum + (each[key] ?? 0), 0)

export const factorOf = (motion: Motions | undefined, key: 'scale' | 'opacity' | 'width') =>
  toList(motion).reduce((product, each) => product * (each[key] ?? 1), 1)

export const createPlacement = (): Placement => ({height: 0, scale: 1, width: 0, x: 0, y: 0})

export const place = (target: Placement, rect: Rect, motion?: Motions, pivot?: Pivot) => {
  const scale = factorOf(motion, 'scale')
  const grown = rect.width * factorOf(motion, 'width')
  let width = grown * scale
  let height = rect.height * scale
  let x = rect.x + offsetOf(motion, 'x') + (grown - width) / 2
  let y = rect.y + offsetOf(motion, 'y') + (rect.height - height) / 2
  let total = scale

  if (pivot) {
    x = pivot.x + (x - pivot.x) * pivot.scale
    y = pivot.y + (y - pivot.y) * pivot.scale
    width *= pivot.scale
    height *= pivot.scale
    total *= pivot.scale
  }

  target.x = x
  target.y = y
  target.width = width
  target.height = height
  target.scale = total

  return target
}
