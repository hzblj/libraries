import type {Vector4} from 'three'

export type RGBA = readonly [number, number, number, number]

export const WHITE: RGBA = [1, 1, 1, 1]
export const BLACK: RGBA = [0, 0, 0, 1]
export const HAIRLINE: RGBA = [1, 1, 1, 0.15]

export const setRGBA = (target: Vector4, [r, g, b, a]: RGBA) => target.set(r, g, b, a)
