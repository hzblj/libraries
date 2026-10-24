'use client'

import type {FC} from 'react'

import {FocusRing, Surface} from '../../entity'
import {BLACK} from '../../graphics'
import {focusIds} from '../../state'
import {CARTOGRAM} from './layout'
import {MapCartogram} from './MapCartogram'
import {MapCity} from './MapCity'
import {MapPin} from './MapPin'
import {useMapZoom} from './useMapZoom'

export const MapContent: FC = () => {
  const {pointer, zoom} = useMapZoom()

  return (
    <>
      <Surface fill={BLACK} {...pointer} />
      <MapCartogram zoom={zoom} />
      <MapPin zoom={zoom} />
      <MapCity />
      <FocusRing id={focusIds.map} rect={CARTOGRAM} radius={16} />
    </>
  )
}
