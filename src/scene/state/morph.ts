import type {Rect} from '../grid'

type MorphStage = 'webgl' | 'glass' | 'dom'

export const MODAL_BACKDROP = 0.47
export const PAGE_BACKDROP = 1
export const PAGE_TOP = 116

export const morph = {
  backdrop: 0,
  glassRect: null as Rect | null,
  keepsPreview: false,
  page: 0,
  progress: 0,
  stage: 'webgl' as MorphStage,
}

export const morphTargets = {
  ambient: null as HTMLElement | null,
  media: null as HTMLElement | null,
  surface: null as HTMLElement | null,
  swap: [] as HTMLElement[],
}
