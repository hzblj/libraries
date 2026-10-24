'use client'

import {type FC, useMemo} from 'react'

import {Layer} from '../../entity'
import {HEIGHT} from './layout'
import {useCityTexture} from './useCityTexture'

export const MapCity: FC = () => {
  const {map, size} = useCityTexture()
  const rect = useMemo(() => ({...size, x: 16, y: HEIGHT - 16 - size.height}), [size])

  return <Layer rect={rect} map={map} fit="fill" order={6} />
}
