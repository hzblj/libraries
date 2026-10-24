import gsap from 'gsap'
import {useCallback} from 'react'

import type {EntryLink, EntryShot} from '@/db'
import {trackProjectView} from '@/lib/analytics'

import {useEntity, useMotion} from '../../entity'
import {openExternal, setCursor} from '../../interaction'
import {openCard} from '../../state'
import {useHoverVideo} from './useHoverVideo'

type PointerLike = {pointerType: string}

export const useShotInteraction = (entry: EntryShot | EntryLink) => {
  const {slot, worldRect} = useEntity()
  const video = useHoverVideo(entry.videos)
  const badge = useMotion({opacity: 1, scale: 1})

  const onPointerEnter = useCallback(
    (_: unknown, event: PointerLike) => {
      if (event.pointerType !== 'mouse') {
        return
      }

      setCursor(true)
      gsap.to(badge, {duration: 0.35, ease: 'power2.out', opacity: 0, scale: 0.9})
      video.play()
    },
    [badge, video]
  )

  const onPointerLeave = useCallback(
    (_: unknown, event: PointerLike) => {
      if (event.pointerType !== 'mouse') {
        return
      }

      setCursor(false)
      gsap.to(badge, {delay: 0.05, duration: 0.35, ease: 'power2.out', opacity: 1, scale: 1})
      video.stop()
    },
    [badge, video]
  )

  const onClick = useCallback(() => {
    if (entry.variant === 'link') {
      openExternal(entry.url)
      return
    }

    trackProjectView(entry.title)
    video.lend()
    openCard(
      {entry, kind: 'shot'},
      {media: video.source.texture ?? undefined, rect: worldRect(), slot, slug: entry.slug}
    )
  }, [entry, slot, video, worldRect])

  return {badge, handlers: {onClick, onPointerEnter, onPointerLeave}, video: video.source}
}
