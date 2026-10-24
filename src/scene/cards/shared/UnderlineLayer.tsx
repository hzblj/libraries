'use client'

import type {FC} from 'react'

import {Layer, type Motion} from '../../entity'
import {useCanvasTexture} from '../../graphics'
import type {Rect} from '../../grid'

const SIZE = {height: 2, width: 64}

const drawUnderline = (ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createLinearGradient(0, 0, SIZE.width, 0)
  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.48)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, SIZE.width, SIZE.height)
}

type UnderlineLayerProps = {
  rect: Rect
  motion: Motion
  order: number
}

export const UnderlineLayer: FC<UnderlineLayerProps> = ({rect, motion, order}) => {
  const map = useCanvasTexture('underline', SIZE, drawUnderline)

  return <Layer rect={rect} map={map} fit="fill" motion={motion} order={order} />
}
