'use client'

import type {FC} from 'react'

import type {TextStyle} from '../graphics'
import type {Motion} from './motion'
import {TextLayer} from './TextLayer'
import {useSplitWords} from './useSplitWords'

const BLEED = 16

type SplitTextLayerProps = {
  text: string
  style: TextStyle
  x: number
  top: number
  order: number
  motions: readonly Motion[]
}

export const SplitTextLayer: FC<SplitTextLayerProps> = ({text, style, x, top, order, motions}) => {
  const words = useSplitWords(text, style)

  return words.map(({word, offset}, index) => (
    <TextLayer
      key={`${index}:${word}`}
      text={word}
      style={style}
      x={x + offset}
      top={top}
      order={order}
      motion={motions[index]}
      bleed={BLEED}
    />
  ))
}
