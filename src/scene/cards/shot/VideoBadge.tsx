'use client'

import {type FC, useMemo} from 'react'

import {Layer, useEntity} from '../../entity'
import type {RGBA} from '../../graphics'
import {useSvg} from '../../graphics'
import {insetRect} from '../../grid'

const BADGE: RGBA = [0, 0, 0, 0.42]
const BADGE_EDGE: RGBA = [1, 1, 1, 0.22]
const ICON = {height: 12, width: 12}

type VideoBadgeProps = {
  motion: {opacity: number; scale: number}
}

export const VideoBadge: FC<VideoBadgeProps> = ({motion}) => {
  const {size} = useEntity()
  const icon = useSvg('/svg/video.svg', ICON)
  const circle = useMemo(() => ({height: 22, width: 22, x: size.width - 35, y: 13.47}), [size])
  const glyph = useMemo(() => insetRect(circle, 5), [circle])

  return (
    <>
      <Layer rect={circle} radius={11} color={BADGE} ringWidth={1} ringColor={BADGE_EDGE} order={2} motion={motion} />
      <Layer rect={glyph} map={icon} fit="fill" order={3} motion={motion} />
    </>
  )
}
