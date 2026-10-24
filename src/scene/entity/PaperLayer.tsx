'use client'

import type {FC} from 'react'
import {ignoreRaycast, plane} from '../graphics'
import type {Rect} from '../grid'
import {useEntity} from './EntityContext'
import {usePaperMaterial} from './usePaperMaterial'

type PaperLayerProps = {
  rect: Rect
  radius: number
  order: number
}

export const PaperLayer: FC<PaperLayerProps> = ({rect, radius, order}) => {
  const {size: host} = useEntity()
  const material = usePaperMaterial(rect, radius)

  return (
    <mesh
      geometry={plane}
      material={material}
      position={[rect.x + rect.width / 2 - host.width / 2, host.height / 2 - rect.y - rect.height / 2, 0]}
      scale={[rect.width, rect.height, 1]}
      renderOrder={order}
      raycast={ignoreRaycast}
    />
  )
}
