'use client'

import {useFrame, useThree} from '@react-three/fiber'
import {type FC, useEffect, useState} from 'react'

import {updateView, view} from './view'

export const CameraRig: FC = () => {
  const events = useThree(state => state.events)
  const [pointer] = useState(() => ({move: null as PointerEvent | null}))

  useEffect(() => {
    const target: HTMLElement | undefined = events.connected

    if (!target) {
      return
    }

    const controller = new AbortController()
    const track = (event: PointerEvent) => {
      pointer.move = event
    }

    target.addEventListener('pointerenter', track, {signal: controller.signal})
    target.addEventListener('pointermove', track, {passive: true, signal: controller.signal})
    target.addEventListener(
      'pointerleave',
      () => {
        pointer.move = null
      },
      {signal: controller.signal}
    )

    return () => controller.abort()
  }, [events.connected, pointer])

  useFrame(({camera, size}) => {
    const movedAt = view.movedAt
    updateView(size.width, size.height)
    camera.position.set(view.x, -view.y, 100)

    if (camera.zoom !== view.scale) {
      camera.zoom = view.scale
      camera.updateProjectionMatrix()
    }

    // A wheel, a trackpad, the keys or a fling move the grid under a pointer that stays put, and no pointer event
    // says what it is over now: ask again at its last position, so a card it has left stops playing as if hovered.
    // The ask replays the pointer's last move, not r3f's last event (`events.update`): after a trackpad scroll that
    // is a wheel, which has no `pointerType`, so the card the pointer lands on would take the hover as no mouse's and
    // never start its clip, nor start it on the next move, since r3f counts it as hovered already.
    if (view.movedAt !== movedAt && pointer.move) {
      camera.updateMatrixWorld()
      events.handlers?.onPointerMove(pointer.move)
    }
  }, -1)

  return null
}
