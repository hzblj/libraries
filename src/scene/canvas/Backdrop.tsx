'use client'

import type {FC} from 'react'

import {ignoreRaycast, plane} from '../graphics'
import {useBackdrop} from './useBackdrop'

export const Backdrop: FC = () => {
  const {attach, material} = useBackdrop()

  return (
    <mesh
      ref={attach}
      geometry={plane}
      material={material}
      renderOrder={100}
      frustumCulled={false}
      raycast={ignoreRaycast}
    />
  )
}
