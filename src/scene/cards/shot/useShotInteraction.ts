import {useCallback} from 'react'

import type {EntryLink, EntryShot} from '@/db'
import {trackProjectView} from '@/lib/analytics'

import {useEntity} from '../../entity'
import {openExternal, setCursor} from '../../interaction'
import {openCard} from '../../state'
import {useHoverVideo} from './useHoverVideo'

type PointerLike = {pointerType: string}

export const useShotInteraction = (entry: EntryShot | EntryLink) => {
  const {slot, worldRect} = useEntity()
  const video = useHoverVideo(entry.videos)

  const onPointerEnter = useCallback(
    (_: unknown, event: PointerLike) => {
      if (event.pointerType !== 'mouse') {
        return
      }

      setCursor(true)
      video.play()
    },
    [video]
  )

  const onPointerLeave = useCallback(
    (_: unknown, event: PointerLike) => {
      if (event.pointerType !== 'mouse') {
        return
      }

      setCursor(false)
      video.stop()
    },
    [video]
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

  return {handlers: {onClick, onPointerEnter, onPointerLeave}, video: video.source}
}
