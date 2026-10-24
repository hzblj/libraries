import gsap from 'gsap'
import {useCallback, useEffect, useState} from 'react'

import type {EntryCV} from '@/db'

import {useEntity, useMotion} from '../../entity'
import {setCursor} from '../../interaction'
import {openCard} from '../../state'

type PointerLike = {pointerType: string}

export const useCvPeek = (entry: EntryCV) => {
  const {slot, worldRect} = useEntity()
  const scroll = useMotion({y: 0})
  const [animation] = useState(() => ({current: null as gsap.core.Timeline | gsap.core.Tween | null}))

  useEffect(
    () => () => {
      animation.current?.kill()
    },
    [animation]
  )

  const onPointerEnter = useCallback(
    (_: unknown, event: PointerLike) => {
      if (event.pointerType !== 'mouse') {
        return
      }

      setCursor(true)
      animation.current?.kill()
      animation.current = gsap
        .timeline()
        .to(scroll, {duration: 0.8, ease: 'power3.out', y: -80})
        .to(scroll, {duration: 0.6, ease: 'power2.inOut', y: 0})
    },
    [animation, scroll]
  )

  const onPointerLeave = useCallback(
    (_: unknown, event: PointerLike) => {
      if (event.pointerType !== 'mouse') {
        return
      }

      setCursor(false)
      animation.current?.kill()
      animation.current = gsap.to(scroll, {duration: 0.5, ease: 'power3.inOut', y: 0})
    },
    [animation, scroll]
  )

  const onClick = useCallback(() => {
    openCard({entry, kind: 'cv'}, {rect: worldRect(), slot, slug: entry.slug})
  }, [entry, slot, worldRect])

  return {handlers: {onClick, onPointerEnter, onPointerLeave}, scroll}
}
