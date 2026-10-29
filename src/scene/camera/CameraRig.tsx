'use client'

import {useFrame, useThree} from '@react-three/fiber'
import {type FC, useEffect, useState} from 'react'

import {updateView, view} from './view'

export const CameraRig: FC = () => {
  const events = useThree(state => state.events)
  const [pointer] = useState(() => ({over: false}))

  useEffect(() => {
    const target: HTMLElement | undefined = events.connected

    if (!target) {
      return
    }

    const controller = new AbortController()
    const enter = () => {
      pointer.over = true
    }

    target.addEventListener('pointerenter', enter, {signal: controller.signal})
    target.addEventListener('pointermove', enter, {passive: true, signal: controller.signal})
    target.addEventListener(
      'pointerleave',
      () => {
        pointer.over = false
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
    if (view.movedAt !== movedAt && pointer.over) {
      camera.updateMatrixWorld()
      events.update?.()
    }
  }, -1)

  return null
}
