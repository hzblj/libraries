import type {Dispatch, SetStateAction} from 'react'

export type CameraOffset = {x: number; y: number}

export type CameraState = {
  camera: CameraOffset
  origin: {x: number; y: number}
  scale: number
  isModalOpen: boolean
}

export type CameraZoom = {
  focal: CameraOffset
  minScale?: number
  scaleBy?: number
  scaleTo?: number
}

export type CameraAction = Dispatch<SetStateAction<CameraState>>
