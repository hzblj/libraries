import {INK, INK_STRONG, type TextStyle} from '../../graphics'
import {getAreaRect} from '../../grid'

// Two columns wide and one row tall, as on the portfolio, everything on the
// card's centre line: the wordmark, what it makes, where to find it, and how
// to get about the grid.
export const WIDTH = getAreaRect('profile').width
export const HEIGHT = getAreaRect('profile').height

// public/svg/wordmark.svg, its 224×104 drawn at 0.36.
export const WORDMARK = {height: 37.44, width: 80.64}
export const WORDMARK_TOP = 32

export const TAGLINE_TOP = WORDMARK_TOP + 42
export const TAGLINE_LINE = 22
export const LINKS_TOP = TAGLINE_TOP + TAGLINE_LINE + 12
export const PILL = {gap: 8, height: 30, padding: 12, radius: 15}
// Each pill: the place's own glyph, its name, and an arrow out.
export const GLYPH = {height: 14, width: 14}
export const GLYPH_GAP = 7
export const ARROW = {height: 9, width: 9}
export const ARROW_GAP = 6
export const HINTS_TOP = HEIGHT - 30 - 24

export const TAGLINE: TextStyle = {color: 'rgba(255, 255, 255, 0.5)', lineHeight: TAGLINE_LINE, size: 16, weight: 500}
export const SUBJECT: TextStyle = {gradient: INK_STRONG, lineHeight: TAGLINE_LINE, shadow: true, size: 16, weight: 500}
export const LINK: TextStyle = {gradient: INK, lineHeight: 18, shadow: true, size: 13, weight: 500}

const HINT: TextStyle = {
  color: 'rgba(255, 255, 255, 0.5)',
  lineHeight: 12,
  size: 12,
  strut: {lineHeight: 24, size: 16},
}

const HINT_MUTED: TextStyle = {...HINT, color: 'rgba(255, 255, 255, 0.3)'}

type Hint =
  | {kind: 'arrows'; width: number; gap: number}
  | {kind: 'keyboard'; width: number; gap: number}
  | {kind: 'text'; text: string; style: TextStyle; gap: number}

// The portfolio's own hints, with drag for its scroll: the grid pans either way.
export const HINTS: readonly Hint[] = [
  {gap: 6, kind: 'arrows', width: 16},
  {gap: 6, kind: 'text', style: HINT, text: 'Drag'},
  {gap: 6, kind: 'text', style: HINT_MUTED, text: 'or use'},
  {gap: 4, kind: 'keyboard', width: 25},
  {gap: 6, kind: 'text', style: HINT, text: 'WSAD keys'},
  {gap: 0, kind: 'text', style: HINT_MUTED, text: 'to explore'},
]
