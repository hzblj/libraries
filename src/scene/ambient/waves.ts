import type {AmbientVariant} from './variants'

export type WaveVariant = AmbientVariant | 'ico'

export const WAVE_MIRROR: Record<WaveVariant, number> = {
  cv: 1,
  ico: 0,
  shot: 0,
}

export const WAVE_MAX_DPR = 1.5
export const WAVE_SPEED = 0.35
export const WAVE_START = 20
export const WAVE_FRAME = 1000 / 30
