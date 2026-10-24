'use client'

import type {FC} from 'react'

import {Layer, type Pivot} from '../../entity'
import {useSvg} from '../../graphics'
import {CARTOGRAM, CLIP} from './layout'

type MapCartogramProps = {
  zoom: Pivot
}

export const MapCartogram: FC<MapCartogramProps> = ({zoom}) => {
  const map = useSvg('/svg/map.svg', CARTOGRAM)

  return <Layer rect={CARTOGRAM} radius={16} map={map} clip={CLIP} clipRadius={16} pivot={zoom} order={1} />
}
