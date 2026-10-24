'use client'

import {type FC, useLayoutEffect} from 'react'

import {useCameraState} from '@/providers/CameraProvider/context'

import {cameraInput} from './view'

export const CameraBridge: FC = () => {
  const {camera, origin, scale} = useCameraState()

  useLayoutEffect(() => {
    cameraInput.camera = camera
    cameraInput.origin = origin
    cameraInput.scale = scale
  }, [camera, origin, scale])

  return null
}
