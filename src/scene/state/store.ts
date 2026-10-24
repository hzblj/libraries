import type {Texture} from 'three'
import {create} from 'zustand'

import type {EntryCV, EntryShot} from '@/db'

import type {AmbientVariant} from '../ambient/variants'
import type {Rect} from '../grid'
import {morph} from './morph'

export type OpenCard = {kind: 'shot'; entry: EntryShot} | {kind: 'cv'; entry: EntryCV}

export type CardSource = {
  slug: string
  slot: number
  rect: Rect
  media?: Texture
}

type SceneStore = {
  ambient: AmbientVariant
  card: OpenCard | null
  source: CardSource | null
  galleryOpen: boolean
  away: boolean
  failed: boolean
  focused: string | null
}

export const useSceneStore = create<SceneStore>(() => ({
  ambient: 'shot',
  away: false,
  card: null,
  failed: false,
  focused: null,
  galleryOpen: false,
  source: null,
}))

export const openCard = (card: OpenCard, source: CardSource) => {
  if (useSceneStore.getState().card) {
    return
  }

  useSceneStore.setState({card, source})
}

export const prepareAmbient = (ambient: AmbientVariant) => {
  useSceneStore.setState({ambient})
}

export const leaveForPage = () => {
  useSceneStore.setState({away: true})
}

export const returnFromPage = () => {
  useSceneStore.setState({away: false})
}

export const closeCard = () => {
  morph.glassRect = null
  useSceneStore.setState({away: false, card: null, source: null})
}

export const resetScene = () => {
  morph.glassRect = null
  morph.backdrop = 0
  morph.page = 0
  morph.progress = 0
  useSceneStore.setState({away: false, card: null, galleryOpen: false, source: null})
}

export const focusTarget = (focused: string | null) => {
  useSceneStore.setState({focused})
}

export const markSceneFailed = () => {
  useSceneStore.setState({failed: true})
}

export const openGallery = () => {
  useSceneStore.setState({galleryOpen: true})
}

export const closeGallery = () => {
  useSceneStore.setState({galleryOpen: false})
}

export const isSourceSlot = (slug: string, slot: number) => {
  const {source} = useSceneStore.getState()

  return source?.slug === slug && source.slot === slot
}
