'use client'

import type {FC} from 'react'

import {ignoreRaycast, plane} from '../graphics'
import type {CardSource} from '../state'
import {useMorphFoot} from './useMorphFoot'
import type {MorphFrame} from './useMorphFrame'

type MorphFootProps = {
  source: CardSource
  frame: MorphFrame
}

export const MorphFoot: FC<MorphFootProps> = ({source, frame}) => {
  const {labelMaterial, labelMesh, rampMaterial, rampMesh} = useMorphFoot(source, frame)

  return (
    <>
      <mesh ref={rampMesh.attach} geometry={plane} material={rampMaterial} renderOrder={202} raycast={ignoreRaycast} />
      <mesh
        ref={labelMesh.attach}
        geometry={plane}
        material={labelMaterial}
        renderOrder={203}
        raycast={ignoreRaycast}
      />
    </>
  )
}
