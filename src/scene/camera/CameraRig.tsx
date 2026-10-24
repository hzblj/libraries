'use client'

import {useFrame} from '@react-three/fiber'
import type {FC} from 'react'

import {updateView, view} from './view'

export const CameraRig: FC = () => {
  useFrame(({camera, size}) => {
    updateView(size.width, size.height)
    camera.position.set(view.x, -view.y, 100)

    if (camera.zoom !== view.scale) {
      camera.zoom = view.scale
      camera.updateProjectionMatrix()
    }
  }, -1)

  return null
}
