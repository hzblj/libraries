import {INK_STRONG, type TextStyle} from '../../graphics'
import {getAreaRect} from '../../grid'

// One column wide and three rows tall, with the border of the portfolio's CV
// card (lit in the top-left and bottom-right corners): a row for every example
// down from the top, each its app icon, its name and what it shows, and the
// card's own name in the bottom-left corner the way every shot names itself.
export const WIDTH = getAreaRect('examples').width
export const TOP = 12
export const ROW = 35
// The highlight under a hovered row stops short of the card's edge and of the
// rows beside it.
export const INSET = 8
export const ROW_GAP = 2
export const ICON = {height: 28, width: 28}
export const ICON_X = 18
export const TEXT_X = ICON_X + ICON.width + 11
export const ARROW = {height: 12, width: 12}
export const ARROW_X = WIDTH - INSET - 14 - ARROW.width
export const TEXT_WIDTH = ARROW_X - 10 - TEXT_X

export const TITLE_LINE = 16
export const DESCRIPTION_LINE = 14
export const TITLE: TextStyle = {gradient: INK_STRONG, lineHeight: TITLE_LINE, shadow: true, size: 13, weight: 500}
export const DESCRIPTION: TextStyle = {color: 'rgba(255, 255, 255, 0.5)', lineHeight: DESCRIPTION_LINE, size: 11}
export const TITLE_OPACITY = 0.85
export const ARROW_OPACITY = 0.28
