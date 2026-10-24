'use client'

import type {FC} from 'react'

import {ignoreRaycast, plane} from '../graphics'
import type {CardSource} from '../state'
import type {MorphFrame} from './useMorphFrame'
import {type MorphSurfaceLook, useMorphSurface} from './useMorphSurface'

type MorphSurfaceProps = MorphSurfaceLook & {
  source: CardSource
  frame: MorphFrame
}

export const MorphSurface: FC<MorphSurfaceProps> = ({source, frame, fill, border}) => {
  const {material, mesh} = useMorphSurface(source, frame, {border, fill})

  return <mesh ref={mesh.attach} geometry={plane} material={material} renderOrder={200} raycast={ignoreRaycast} />
}
