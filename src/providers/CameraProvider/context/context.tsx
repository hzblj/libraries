'use client'

import {createContext, type ReactNode, useContext, useState} from 'react'

import {getAreaRect} from '@/scene/grid'

import {calculateScale} from '../const'
import {CameraAction, CameraState} from './types'

// The camera starts on the profile, which sits half a column off the tile's
// centre with the grid's nine columns.
const calculateCenterOfViewport = () => {
  if (typeof window === 'undefined') {
    return {x: 0, y: 0}
  }

  const height = window?.visualViewport?.height || window?.innerHeight
  const width = window?.visualViewport?.width || window?.innerWidth

  const scale = calculateScale(width, height)
  const scaledWidth = width / scale
  const scaledHeight = height / scale

  const profile = getAreaRect('profile')

  const x = -(profile.x + profile.width / 2 - scaledWidth / 2)
  const y = -(profile.y + profile.height / 2 - scaledHeight / 2)

  return {
    x,
    y,
  }
}

export const createCameraState = (): CameraState => {
  const {x, y} = calculateCenterOfViewport()

  return {
    camera: {x: 0, y: 0},
    isModalOpen: false,
    origin: {x, y},
    scale: 1,
  }
}

const CameraStateContext = createContext<CameraState | undefined>(undefined)
const CameraDispatchContext = createContext<CameraAction | undefined>(undefined)

export type CameraProviderProps = {
  children: ReactNode
  defaultState: CameraState
}

export const Context = ({children, defaultState}: CameraProviderProps) => {
  const [state, dispatch] = useState<CameraState>(defaultState)

  return (
    <CameraStateContext.Provider value={state}>
      <CameraDispatchContext.Provider value={dispatch}>{children}</CameraDispatchContext.Provider>
    </CameraStateContext.Provider>
  )
}

export const useCameraState = () => {
  const state = useContext(CameraStateContext)

  if (typeof state === 'undefined') {
    throw new Error('useCameraState must be used within a CameraProvider')
  }

  return state
}

export const useCameraDispatch = () => {
  const dispatch = useContext(CameraDispatchContext)

  if (typeof dispatch === 'undefined') {
    throw new Error('useCameraDispatch must be used within a CameraProvider')
  }

  return dispatch
}
