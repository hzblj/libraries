import {use, useMemo} from 'react'

import {Config} from '@/config'

import {loadFonts, measureText} from '../../graphics'
import {ARROW, ARROW_GAP, GLYPH, GLYPH_GAP, HINTS, LINK, PILL, SUBJECT, TAGLINE, WIDTH} from './styles'

const SPACE = 4

const centered = (width: number) => (WIDTH - width) / 2

const hintWidth = (hint: (typeof HINTS)[number]) =>
  hint.kind === 'text' ? measureText(hint.text, hint.style) : hint.width

const layoutHints = () => {
  const widths = HINTS.map(hintWidth)
  let cursor = centered(widths.reduce((sum, width, index) => sum + width + HINTS[index].gap, 0))

  return widths.map((width, index) => {
    const x = cursor
    cursor += width + HINTS[index].gap

    return x
  })
}

// Every link a pill of its own, its glyph, its label and an arrow out, in a row
// under the tagline.
const pillWidths = () =>
  Config.links.map(
    ({name}) => PILL.padding * 2 + GLYPH.width + GLYPH_GAP + measureText(name, LINK) + ARROW_GAP + ARROW.width
  )

export const useProfileLayout = () => {
  use(loadFonts())

  return useMemo(() => {
    const prefix = measureText(Config.tagline.prefix, TAGLINE)
    const subjectWidth = measureText(Config.tagline.subject, SUBJECT)
    const taglineX = centered(prefix + SPACE + subjectWidth)
    const widths = pillWidths()

    let cursor = centered(widths.reduce((sum, width) => sum + width, 0) + PILL.gap * (widths.length - 1))
    const links = widths.map(width => {
      const x = cursor
      cursor += width + PILL.gap

      return {glyphX: x + PILL.padding, labelX: x + PILL.padding + GLYPH.width + GLYPH_GAP, width, x}
    })

    return {
      hintX: layoutHints(),
      links,
      subjectWidth,
      subjectX: taglineX + prefix + SPACE,
      taglineX,
    }
  }, [])
}
