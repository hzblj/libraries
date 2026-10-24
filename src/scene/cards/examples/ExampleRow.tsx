'use client'

import {type FC, use, useMemo} from 'react'

import type {EntryExample} from '@/db'

import {FocusRing, Layer, TextLayer} from '../../entity'
import {loadFonts, type RGBA, useImage, useSvg, wrapText} from '../../graphics'
import type {Rect} from '../../grid'
import {focusIds} from '../../state'
import {
  ARROW,
  ARROW_X,
  DESCRIPTION,
  DESCRIPTION_LINE,
  ICON,
  ICON_X,
  TEXT_WIDTH,
  TEXT_X,
  TITLE,
  TITLE_LINE,
} from './styles'
import type {ExampleRowMotion} from './useExampleRows'

const HIGHLIGHT: RGBA = [1, 1, 1, 0.07]
const GAP = 1

type ExampleRowProps = {
  example: EntryExample
  row: Rect
  motion: ExampleRowMotion
}

// A row of the list: the example's app icon, the library's name over what the
// example shows, and an arrow out to its source that wakes up, with the rest
// of the row, under the pointer.
export const ExampleRow: FC<ExampleRowProps> = ({example, row, motion}) => {
  use(loadFonts())
  const icon = useImage(example.icon, 128)
  const arrow = useSvg('/svg/arrow-up-right.svg', ARROW)
  const middle = row.y + row.height / 2
  const lines = useMemo(() => wrapText(example.description, DESCRIPTION, TEXT_WIDTH).slice(0, 1), [example])
  const textTop = middle - (TITLE_LINE + GAP + lines.length * DESCRIPTION_LINE) / 2

  const iconRect = useMemo(() => ({...ICON, x: ICON_X, y: middle - ICON.height / 2}), [middle])
  const arrowRect = useMemo(() => ({...ARROW, x: ARROW_X, y: middle - ARROW.height / 2}), [middle])

  return (
    <>
      <Layer rect={row} radius={12} color={HIGHLIGHT} motion={[motion.highlight, motion.entrance]} order={1} />
      <Layer rect={iconRect} map={icon} fit="fill" motion={[motion.icon, motion.entrance]} bleed={4} order={2} />
      <TextLayer
        text={example.title}
        style={TITLE}
        x={TEXT_X}
        top={textTop}
        motion={[motion.name, motion.entrance]}
        order={2}
      />
      {lines.map((line, index) => (
        <TextLayer
          key={line}
          text={line}
          style={DESCRIPTION}
          x={TEXT_X}
          top={textTop + TITLE_LINE + GAP + index * DESCRIPTION_LINE}
          motion={motion.entrance}
          order={2}
        />
      ))}
      <Layer rect={arrowRect} map={arrow} fit="fill" motion={[motion.arrow, motion.entrance]} bleed={4} order={2} />
      <FocusRing id={focusIds.example(example.title)} rect={row} radius={12} />
    </>
  )
}
