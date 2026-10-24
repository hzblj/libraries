import {INK_STRONG, type TextStyle} from '../../graphics'
import {getAreaRect} from '../../grid'

// One column wide, so everything sits on the card's centre line: the handle,
// what it makes, and the two places to find it.
export const WIDTH = getAreaRect('profile').width
export const NAME_TOP = 62
export const TAGLINE_TOP = NAME_TOP + 30
export const HINTS_TOP = TAGLINE_TOP + 42

export const NAME: TextStyle = {gradient: INK_STRONG, lineHeight: 26, shadow: true, size: 20, weight: 500}
export const TAGLINE: TextStyle = {color: 'rgba(255, 255, 255, 0.5)', lineHeight: 20, size: 15, weight: 500}
export const SUBJECT: TextStyle = {gradient: INK_STRONG, lineHeight: 20, shadow: true, size: 15, weight: 500}

const HINT: TextStyle = {
  color: 'rgba(255, 255, 255, 0.5)',
  lineHeight: 12,
  size: 12,
  strut: {lineHeight: 24, size: 16},
}

type Hint =
  | {kind: 'arrows'; width: number; gap: number}
  | {kind: 'keyboard'; width: number; gap: number}
  | {kind: 'text'; text: string; style: TextStyle; gap: number}

export const HINTS: readonly Hint[] = [
  {gap: 28, kind: 'text', style: HINT, text: 'GitHub'},
  {gap: 0, kind: 'text', style: HINT, text: 'npm'},
]
