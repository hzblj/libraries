import gsap from 'gsap'
import {useCallback, useEffect, useState} from 'react'

import {useSound} from '@/hooks/use-sound'

import type {Point} from '../../grid'
import {setCursor} from '../../interaction'
import {openGallery} from '../../state'
import {FADED, GROWN, type Panel, PHOTOS, panelAt, SHRUNK} from './panels'

type PointerLike = {pointerType: string}

export const useGalleryPanels = () => {
  const sound = useSound('photos')
  const [panels] = useState<Panel[]>(() => PHOTOS.map(() => ({grow: 1, opacity: FADED})))
  const [hovered] = useState(() => ({index: -1}))

  useEffect(() => () => gsap.killTweensOf(panels), [panels])

  const expand = useCallback(
    (index: number) => {
      if (index < 0 || index === hovered.index) {
        return
      }

      hovered.index = index
      gsap.to(panels, {duration: 0.5, ease: 'power3.out', grow: SHRUNK, opacity: FADED})
      gsap.to(panels[index], {duration: 0.5, ease: 'power3.out', grow: GROWN, opacity: 1})
    },
    [hovered, panels]
  )

  const onPointerMove = useCallback(
    (point: Point, event: PointerLike) => {
      if (event.pointerType !== 'mouse') {
        return
      }

      setCursor(true)
      expand(panelAt(panels, point.x))
    },
    [expand, panels]
  )

  const onPointerLeave = useCallback(
    (_: Point, event: PointerLike) => {
      if (event.pointerType !== 'mouse') {
        return
      }

      setCursor(false)
      hovered.index = -1
      gsap.to(panels, {duration: 0.5, ease: 'power3.out', grow: 1, opacity: FADED})
    },
    [hovered, panels]
  )

  const onClick = useCallback(() => {
    sound.open()
    openGallery()
  }, [sound])

  return {handlers: {onClick, onPointerLeave, onPointerMove}, panels}
}
