'use client'

import type {FC} from 'react'

import {TextLayer, useEntity} from '../../entity'
import {INK_STRONG, type TextStyle} from '../../graphics'
import type {Rect} from '../../grid'

const INSET = 18
const TITLE_LINE = 18
const SUBTITLE_LINE = 16
const TITLE: TextStyle = {gradient: INK_STRONG, lineHeight: TITLE_LINE, shadow: true, size: 14, weight: 500}
const SUBTITLE: TextStyle = {color: 'rgba(255, 255, 255, 0.5)', lineHeight: SUBTITLE_LINE, size: 12, weight: 500}

type ShotLabelProps = {
  title: string
  subtitle?: string
  clip: Rect
}

// The card names itself in its bottom-left corner, always: the artwork keeps
// that corner clear for it, so it needs no scrim behind it.
export const ShotLabel: FC<ShotLabelProps> = ({title, subtitle, clip}) => {
  const {size} = useEntity()
  const subtitleTop = size.height - INSET - SUBTITLE_LINE
  const titleTop = (subtitle ? subtitleTop - 1 : size.height - INSET) - TITLE_LINE

  return (
    <>
      <TextLayer text={title} style={TITLE} x={INSET} top={titleTop} clip={clip} clipRadius={15} order={6} />
      {subtitle && (
        <TextLayer text={subtitle} style={SUBTITLE} x={INSET} top={subtitleTop} clip={clip} clipRadius={15} order={6} />
      )}
    </>
  )
}
