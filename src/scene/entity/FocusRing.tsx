'use client'

import {type FC, useMemo} from 'react'

import type {RGBA} from '../graphics'
import type {Rect} from '../grid'
import {Layer} from './Layer'
import {useFocusRing} from './useFocusRing'

const CLEAR: RGBA = [1, 1, 1, 0]
const RING: RGBA = [1, 1, 1, 0.9]
const OUTSET = 4
const WIDTH = 2

type FocusRingProps = {
  id: string
  rect: Rect
  radius: number
}

export const FocusRing: FC<FocusRingProps> = ({id, rect, radius}) => {
  const motion = useFocusRing(id)
  const ring = useMemo(
    () => ({height: rect.height + OUTSET * 2, width: rect.width + OUTSET * 2, x: rect.x - OUTSET, y: rect.y - OUTSET}),
    [rect]
  )

  return (
    <Layer
      rect={ring}
      radius={radius + OUTSET}
      color={CLEAR}
      ringWidth={WIDTH}
      ringColor={RING}
      motion={motion}
      order={50}
    />
  )
}
