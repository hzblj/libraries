import {useCanvasTexture} from '../../graphics'

export type Ramp = readonly (readonly [number, string])[]

export const RAMP_HEIGHT = 146

export const useRampTexture = (ramp: Ramp) =>
  useCanvasTexture(`ramp:${JSON.stringify(ramp)}`, {height: RAMP_HEIGHT, width: 4}, ctx => {
    const gradient = ctx.createLinearGradient(0, 0, 0, RAMP_HEIGHT)

    for (const [at, color] of ramp) {
      gradient.addColorStop(at, color)
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 4, RAMP_HEIGHT)
  })
