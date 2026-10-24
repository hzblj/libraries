'use client'

import {type FC, useMemo} from 'react'

import {FocusRing, Layer, TextLayer} from '../../entity'
import {useSvg} from '../../graphics'
import type {Rect} from '../../grid'
import {focusIds} from '../../state'
import {ICON, type Technology, TOP, titleStyle} from './technologies'

type TechnologyItemProps = {
  technology: Technology
  column: Rect
  lift: {y: number}
}

export const TechnologyItem: FC<TechnologyItemProps> = ({technology, column, lift}) => {
  const map = useSvg(technology.image, ICON)
  const icon = useMemo(() => ({...ICON, x: column.x + (column.width - ICON.width) / 2, y: TOP}), [column])

  return (
    <>
      <Layer rect={icon} map={map} order={1} motion={lift} />
      <TextLayer
        text={technology.title}
        style={titleStyle(technology.ink)}
        x={column.x + column.width / 2}
        top={TOP + ICON.height + 12}
        align="center"
        order={1}
      />
      <FocusRing id={focusIds.technology(technology.title)} rect={column} radius={12} />
    </>
  )
}
