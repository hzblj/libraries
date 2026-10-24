'use client'

import type {FC} from 'react'

import {Layer, type Pivot} from '../../entity'
import {WHITE} from '../../graphics'
import {CLIP, PIN, PIN_COLOR, PULSE_COLOR} from './layout'
import {usePinPulse} from './usePinPulse'

const PULSE = {height: 44, width: 44, ...PIN}
const RING = {height: 28, width: 28, x: PIN.x + 8, y: PIN.y + 8}
const DOT = {height: 18, width: 18, x: PIN.x + 13, y: PIN.y + 13}

type MapPinProps = {
  zoom: Pivot
}

export const MapPin: FC<MapPinProps> = ({zoom}) => {
  const pulse = usePinPulse()

  return (
    <>
      <Layer
        rect={PULSE}
        radius={22}
        color={PULSE_COLOR}
        clip={CLIP}
        clipRadius={16}
        pivot={zoom}
        motion={pulse}
        order={2}
      />
      <Layer rect={RING} radius={14} color={WHITE} clip={CLIP} clipRadius={16} pivot={zoom} order={3} />
      <Layer rect={DOT} radius={9} color={PIN_COLOR} clip={CLIP} clipRadius={16} pivot={zoom} order={4} />
    </>
  )
}
