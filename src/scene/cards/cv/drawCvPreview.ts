import {type CVSection, cv} from '@/db'

import {drawText, measureText, type TextStyle, wrapText} from '../../graphics'

import {CV_PREVIEW_HEIGHT, CV_WIDTH} from './preview'

const YEAR_COLUMN = 88
const COLUMN_GAP = 44
const RIGHT = YEAR_COLUMN + COLUMN_GAP
const RIGHT_WIDTH = CV_WIDTH - RIGHT
const SECTION_GAP = 56

const white = (alpha: number) => `rgba(255, 255, 255, ${alpha})`

const LINE = (alpha: number): TextStyle => ({color: white(alpha), lineHeight: 14, size: 14})
const INLINE = (alpha: number): TextStyle => ({...LINE(alpha), strut: {lineHeight: 24, size: 16}})
const PROSE = (alpha: number): TextStyle => ({color: white(alpha), lineHeight: 22, size: 14})

type Draw = CanvasRenderingContext2D

const rule = (ctx: Draw, x: number, y: number, width: number, height: number, alpha: number) => {
  ctx.fillStyle = white(alpha)
  ctx.fillRect(x, y, width, height)
}

const underline = (ctx: Draw, text: string, x: number, top: number, style: TextStyle) => {
  rule(ctx, x, top + 16 + 4, measureText(text, style), 1.5, 0.2)
}

const paragraphs = (ctx: Draw, items: string[], top: number) => {
  let y = top

  items.forEach((paragraph, index) => {
    if (index > 0) {
      y += 24
    }

    for (const line of wrapText(paragraph, PROSE(0.5), RIGHT_WIDTH)) {
      drawText(ctx, line, RIGHT, y, PROSE(0.5))
      y += 22
    }
  })

  return y
}

const rail = (ctx: Draw, count: number, top: number) => {
  let y = top + 7

  for (let index = 0; index < count; index++) {
    ctx.beginPath()
    ctx.arc(RIGHT - 13 + 2, y + 2, 2, 0, Math.PI * 2)
    ctx.fillStyle = white(0.2)
    ctx.fill()
    y += 4 + 2

    if (index < count - 1) {
      rule(ctx, RIGHT - 13 + 1.25, y, 1.5, 18.75, 0.15)
      y += 18.75 + 2
    }
  }
}

const section = (
  ctx: Draw,
  {year, positions, location, technologies, paragraphs: text, projects, links}: CVSection,
  top: number
) => {
  drawText(ctx, year, 0, top, LINE(0.4))

  let y = top

  if (positions.length > 1) {
    rail(ctx, positions.length, top)
  }

  positions.forEach(({title, company}, index) => {
    const style = INLINE(index === 0 ? 1 : 0.6)
    const label = company ? `${title} at ` : title

    drawText(ctx, label, RIGHT, y, style)

    if (company) {
      const x = RIGHT + measureText(label, style)
      drawText(ctx, company, x, y, style)
      rule(ctx, x, y + 19.72, measureText(company, style), 1.5, 0.3)
    }

    y += 17 + 10
  })

  y -= 10

  if (location) {
    y += 6
    drawText(ctx, location, RIGHT, y, LINE(0.6))
    y += 17
  }

  if (technologies.length) {
    y += 6
    drawText(ctx, technologies.join(', '), RIGHT, y, LINE(0.5))
    y += 17
  }

  y = paragraphs(ctx, text, y + 24)

  if (projects?.length) {
    drawText(ctx, 'Projects', RIGHT, y + 24, PROSE(1))
    y += 24 + 22 + 24

    projects.forEach((project, index) => {
      if (index > 0) {
        y += 24
      }

      drawText(ctx, project.name, RIGHT, y, PROSE(0.8))
      underline(ctx, project.name, RIGHT, y, PROSE(0.8))
      drawText(ctx, project.position, RIGHT, y + 22 + 8, LINE(0.6))
      drawText(ctx, project.technologies.join(', '), RIGHT, y + 22 + 8 + 17 + 8, LINE(0.5))
      y = paragraphs(ctx, project.paragraphs, y + 22 + 8 + 17 + 8 + 17 + 24)
    })
  }

  links.forEach(link => {
    y += 24
    drawText(ctx, link.name, RIGHT, y, PROSE(0.5))
    underline(ctx, link.name, RIGHT, y, PROSE(0.5))
    y += 22
  })

  return Math.max(top + 17, y)
}

const heading = (ctx: Draw, text: string, top: number) => {
  drawText(ctx, text, 0, top, LINE(1))

  return top + 17
}

export const drawCvPreview = (ctx: Draw) => {
  let y = heading(ctx, 'Work Experience', 0) + SECTION_GAP

  const groups: [string | null, CVSection[]][] = [
    [null, cv.workExperience],
    ['Side Projects', cv.sideProjects],
    ['Education', cv.education],
  ]

  groups.forEach(([title, sections], groupIndex) => {
    if (groupIndex > 0) {
      y += SECTION_GAP
    }

    if (title) {
      y = heading(ctx, title, y) + SECTION_GAP
    }

    sections.forEach((each, index) => {
      if (y > CV_PREVIEW_HEIGHT) {
        return
      }

      if (index > 0) {
        y += SECTION_GAP
      }

      y = section(ctx, each, y)
    })
  })
}
