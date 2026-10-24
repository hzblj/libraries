export type Point = {x: number; y: number}

export type Rect = Point & {width: number; height: number}

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t

export const lerpRect = (from: Rect, to: Rect, t: number): Rect => ({
  height: lerp(from.height, to.height, t),
  width: lerp(from.width, to.width, t),
  x: lerp(from.x, to.x, t),
  y: lerp(from.y, to.y, t),
})

export const offsetRect = <T extends Point>(rect: T, {x, y}: Point): T => ({...rect, x: rect.x + x, y: rect.y + y})

export const insetRect = ({x, y, width, height}: Rect, by: number): Rect => ({
  height: height - by * 2,
  width: width - by * 2,
  x: x + by,
  y: y + by,
})

export const mod = (value: number, by: number) => ((value % by) + by) % by
