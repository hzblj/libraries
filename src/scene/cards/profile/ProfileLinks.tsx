'use client'

import {type FC, useMemo} from 'react'

import {Config} from '@/config'

import {FocusRing, Layer, type Motion, TextLayer} from '../../entity'
import {type RGBA, useSvg} from '../../graphics'
import type {Rect} from '../../grid'
import {focusIds} from '../../state'
import {ARROW, GLYPH, LINK, LINKS_TOP, PILL} from './styles'

const FILL: RGBA = [1, 1, 1, 0.07]
const HOVER: RGBA = [1, 1, 1, 0.08]
const GLYPH_OPACITY = 0.85

type ProfileLinksProps = {
  pills: readonly {glyphX: number; labelX: number; width: number}[]
  rects: readonly Rect[]
  hovers: readonly {arrow: Motion; fill: Motion}[]
  entrance: readonly Motion[]
}

export const ProfileLinks: FC<ProfileLinksProps> = ({pills, rects, hovers, entrance}) => {
  const arrow = useSvg('/svg/arrow-up-right.svg', ARROW)
  const labelTop = LINKS_TOP + (PILL.height - 18) / 2
  const arrows = useMemo(
    () =>
      rects.map(({x, width}) => ({
        ...ARROW,
        x: x + width - PILL.padding - ARROW.width,
        y: LINKS_TOP + (PILL.height - ARROW.height) / 2,
      })),
    [rects]
  )
  const glyphs = useMemo(
    () => pills.map(({glyphX}) => ({...GLYPH, x: glyphX, y: LINKS_TOP + (PILL.height - GLYPH.height) / 2})),
    [pills]
  )

  return Config.links.map(({icon, name}, index) => (
    <PillLayers
      key={name}
      name={name}
      icon={icon}
      rect={rects[index]}
      glyphRect={glyphs[index]}
      labelX={pills[index].labelX}
      labelTop={labelTop}
      arrowRect={arrows[index]}
      arrow={arrow}
      hover={hovers[index]}
      entrance={entrance[index]}
    />
  ))
}

type PillLayersProps = {
  name: string
  icon: string
  rect: Rect
  glyphRect: Rect
  labelX: number
  labelTop: number
  arrowRect: Rect
  arrow: ReturnType<typeof useSvg>
  hover: {arrow: Motion; fill: Motion}
  entrance: Motion
}

const PillLayers: FC<PillLayersProps> = ({
  name,
  icon,
  rect,
  glyphRect,
  labelX,
  labelTop,
  arrowRect,
  arrow,
  hover,
  entrance,
}) => (
  <>
    <Layer rect={rect} radius={PILL.radius} color={FILL} motion={entrance} order={2} />
    <Layer rect={rect} radius={PILL.radius} color={HOVER} motion={[hover.fill, entrance]} order={2} />
    <PillGlyph icon={icon} rect={glyphRect} entrance={entrance} />
    <TextLayer text={name} style={LINK} x={labelX} top={labelTop} motion={entrance} order={3} />
    <Layer rect={arrowRect} map={arrow} fit="fill" motion={[hover.arrow, entrance]} bleed={4} order={3} />
    <FocusRing id={focusIds.contact(name)} rect={rect} radius={PILL.radius} />
  </>
)

type PillGlyphProps = {
  icon: string
  rect: Rect
  entrance: Motion
}

const PillGlyph: FC<PillGlyphProps> = ({icon, rect, entrance}) => {
  const map = useSvg(icon, GLYPH)

  return <Layer rect={rect} map={map} fit="fill" opacity={GLYPH_OPACITY} motion={entrance} bleed={2} order={3} />
}
