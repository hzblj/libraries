'use client'

import type {FC} from 'react'

import {ignoreRaycast, plane} from '../graphics'
import type {CardSource} from '../state'
import type {MorphFrame} from './useMorphFrame'
import {useMorphPreview} from './useMorphPreview'

type MorphPreviewProps = {
  source: CardSource
  frame: MorphFrame
}

export const MorphPreview: FC<MorphPreviewProps> = ({source, frame}) => {
  const {material, mesh} = useMorphPreview(source, frame)

  return <mesh ref={mesh.attach} geometry={plane} material={material} renderOrder={201} raycast={ignoreRaycast} />
}
