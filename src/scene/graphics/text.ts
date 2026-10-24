'use client'

import {trackLoad} from './uploads'

let family: string | null = null

const fontFamily = () => {
  family ??= getComputedStyle(document.body).fontFamily

  return family
}

let fontsReady: Promise<void> | null = null

export const loadFonts = () => {
  fontsReady ??= trackLoad(
    Promise.all([400, 500].map(weight => document.fonts.load(`${weight} 16px ${fontFamily()}`))).then(() => undefined)
  )

  return fontsReady
}

export type TextStyle = {
  size: number
  weight?: 400 | 500
  lineHeight?: number
  color?: string
  gradient?: readonly [string, string]
  gradientHeight?: number
  shadow?: boolean
  strut?: {size: number; lineHeight: number}
}

let measuring: CanvasRenderingContext2D | null = null

const measureContext = () => {
  measuring ??= document.createElement('canvas').getContext('2d')

  if (!measuring) {
    throw new Error('Canvas 2D is not available')
  }

  return measuring
}

const cssFont = ({size, weight = 400}: Pick<TextStyle, 'size' | 'weight'>) => `${weight} ${size}px ${fontFamily()}`

const lineHeightOf = (style: TextStyle) => style.lineHeight ?? style.size * 1.5

const metrics = (size: number, weight: number) => {
  const ctx = measureContext()
  ctx.font = cssFont({size, weight: weight as TextStyle['weight']})
  const {fontBoundingBoxAscent: ascent, fontBoundingBoxDescent: descent} = ctx.measureText('')

  return {ascent, descent}
}

const aboveBaseline = (size: number, lineHeight: number, weight: number) => {
  const {ascent, descent} = metrics(size, weight)

  return (lineHeight - ascent - descent) / 2 + ascent
}

const baselineOffset = (style: TextStyle) => {
  const own = aboveBaseline(style.size, lineHeightOf(style), style.weight ?? 400)

  if (!style.strut) {
    return own
  }

  return Math.max(own, aboveBaseline(style.strut.size, style.strut.lineHeight, 400))
}

export const measureText = (text: string, style: TextStyle) => {
  const ctx = measureContext()
  ctx.font = cssFont(style)

  return ctx.measureText(text).width
}

export const wrapText = (text: string, style: TextStyle, width: number) => {
  const ctx = measureContext()
  ctx.font = cssFont(style)

  const lines: string[] = []
  let line = ''

  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word

    if (line && ctx.measureText(candidate).width > width) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }

  if (line) {
    lines.push(line)
  }

  return lines
}

export const glyphExtent = (style: TextStyle) => {
  const baseline = baselineOffset(style)
  const {ascent, descent} = metrics(style.size, style.weight ?? 400)
  const lineBox = Math.max(lineHeightOf(style), style.strut?.lineHeight ?? 0)

  return {baseline, bottom: Math.max(lineBox, baseline + descent), top: Math.min(0, baseline - ascent)}
}

export const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, top: number, style: TextStyle) => {
  ctx.save()
  ctx.font = cssFont(style)
  ctx.textBaseline = 'alphabetic'

  if (style.gradient) {
    const height = style.gradientHeight ?? lineHeightOf(style)
    const gradient = ctx.createLinearGradient(0, top, 0, top + height)
    gradient.addColorStop(0, style.gradient[0])
    gradient.addColorStop(1, style.gradient[1])
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = style.color ?? '#fff'
  }

  if (style.shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
    ctx.shadowBlur = 2 * ctx.getTransform().a
  }

  ctx.fillText(text, x, top + baselineOffset(style))
  ctx.restore()
}

export const TEXT_ALPHA_GAMMA = 1.45

export const INK = ['#ffffff', 'rgba(255, 255, 255, 0.72)'] as const
export const INK_STRONG = ['#ffffff', 'rgba(255, 255, 255, 0.48)'] as const
export const INK_BLUE = ['#1CEDFC', 'rgba(28, 237, 252, 0.72)'] as const
