import {use, useMemo} from 'react'

import {Config} from '@/config'

import {drawText, loadFonts, measureText, useCanvasTexture} from '../../graphics'
import {CITY} from './layout'

export const useCityTexture = () => {
  use(loadFonts())
  const size = useMemo(() => ({height: 36, width: Math.ceil(measureText(Config.location.city, CITY)) + 24}), [])

  const map = useCanvasTexture(`city:${Config.location.city}`, size, ctx => {
    ctx.beginPath()
    ctx.roundRect(0, 0, size.width, size.height, 8)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.09)'
    ctx.fill()
    ctx.beginPath()
    ctx.roundRect(0.5, 0.5, size.width - 1, size.height - 1, 7.5)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)'
    ctx.lineWidth = 1
    ctx.stroke()
    drawText(ctx, Config.location.city, 12, 6, CITY)
  })

  return {map, size}
}
