'use client'

import type {FC} from 'react'
import {ignoreRaycast, plane} from '../graphics'
import {type LayerOptions, useLayer} from './useLayer'

type LayerProps = LayerOptions & {
  order: number
}

export const Layer: FC<LayerProps> = ({order, ...options}) => {
  const {material, mesh} = useLayer(options)

  return <mesh ref={mesh} geometry={plane} material={material} renderOrder={order} raycast={ignoreRaycast} />
}
