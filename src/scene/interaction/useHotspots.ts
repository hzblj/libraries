import {useCallback, useMemo, useState} from 'react'

import type {Point, Rect} from '../grid'
import {setCursor} from './cursor'

type Hotspot = {
  rect: Rect
  onEnter?: () => void
  onLeave?: () => void
  onClick?: () => void
}

const contains = ({x, y}: Point, rect: Rect) =>
  x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height

export const useHotspots = (hotspots: readonly Hotspot[]) => {
  const [hovered] = useState(() => ({index: -1}))

  const hover = useCallback(
    (point: Point | null) => {
      const next = point ? hotspots.findIndex(hotspot => contains(point, hotspot.rect)) : -1

      if (next === hovered.index) {
        return
      }

      hotspots[hovered.index]?.onLeave?.()
      hovered.index = next
      hotspots[next]?.onEnter?.()
      setCursor(Boolean(hotspots[next]?.onClick))
    },
    [hotspots, hovered]
  )

  return useMemo(
    () => ({
      onClick: (point: Point) => hotspots.find(hotspot => contains(point, hotspot.rect))?.onClick?.(),
      onPointerLeave: () => hover(null),
      onPointerMove: (point: Point, event: {pointerType: string}) => {
        if (event.pointerType === 'mouse') {
          hover(point)
        }
      },
    }),
    [hotspots, hover]
  )
}
