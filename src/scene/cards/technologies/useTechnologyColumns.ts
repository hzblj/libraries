import gsap from 'gsap'
import {use, useEffect, useMemo, useState} from 'react'

import {loadFonts, measureText} from '../../graphics'
import {openExternal, useHotspots} from '../../interaction'
import {COLUMN_HEIGHT, GAP, ICON, LIFT_EASE, TECHNOLOGIES, TOP, titleStyle, WIDTH} from './technologies'

const layoutColumns = () => {
  const widths = TECHNOLOGIES.map(({ink, title}) => Math.max(ICON.width, measureText(title, titleStyle(ink))))
  let cursor = (WIDTH - widths.reduce((sum, width) => sum + width, 0) - GAP * (widths.length - 1)) / 2

  return widths.map(width => {
    const x = cursor
    cursor += width + GAP

    return {height: COLUMN_HEIGHT, width, x, y: TOP}
  })
}

export const useTechnologyColumns = () => {
  use(loadFonts())
  const [lifts] = useState(() => TECHNOLOGIES.map(() => ({y: 0})))
  const columns = useMemo(layoutColumns, [])

  useEffect(() => () => gsap.killTweensOf(lifts), [lifts])

  const hotspots = useMemo(
    () =>
      TECHNOLOGIES.map(({url}, index) => ({
        onClick: () => openExternal(url),
        onEnter: () => gsap.to(lifts[index], {duration: 0.5, ease: LIFT_EASE, y: -12}),
        onLeave: () => gsap.to(lifts[index], {duration: 0.5, ease: LIFT_EASE, y: 0}),
        rect: columns[index],
      })),
    [columns, lifts]
  )

  return {columns, lifts, pointer: useHotspots(hotspots)}
}
