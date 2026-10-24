import type {ThreeEvent} from '@react-three/fiber'
import {useMemo} from 'react'

import type {Point} from '../grid'
import {type EntitySize, useEntity} from './EntityContext'

type PointerHandler = (point: Point, event: ThreeEvent<PointerEvent>) => void

export type SurfacePointer = {
  onClick?: (point: Point) => void
  onPointerEnter?: PointerHandler
  onPointerLeave?: PointerHandler
  onPointerMove?: PointerHandler
}

const CLICK_SLOP = 4

const toLocal = (event: ThreeEvent<PointerEvent | MouseEvent>, size: EntitySize): Point => ({
  x: (event.uv?.x ?? 0) * size.width,
  y: (1 - (event.uv?.y ?? 0)) * size.height,
})

export const useSurfacePointer = ({onClick, onPointerEnter, onPointerLeave, onPointerMove}: SurfacePointer) => {
  const {size} = useEntity()

  return useMemo(
    () => ({
      onClick:
        onClick &&
        ((event: ThreeEvent<MouseEvent>) => {
          if (event.delta > CLICK_SLOP) {
            return
          }

          event.stopPropagation()
          onClick(toLocal(event, size))
        }),
      onPointerEnter:
        onPointerEnter && ((event: ThreeEvent<PointerEvent>) => onPointerEnter(toLocal(event, size), event)),
      onPointerLeave:
        onPointerLeave && ((event: ThreeEvent<PointerEvent>) => onPointerLeave(toLocal(event, size), event)),
      onPointerMove: onPointerMove && ((event: ThreeEvent<PointerEvent>) => onPointerMove(toLocal(event, size), event)),
    }),
    [onClick, onPointerEnter, onPointerLeave, onPointerMove, size]
  )
}
