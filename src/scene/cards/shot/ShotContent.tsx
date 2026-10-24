'use client'

import {type FC, useMemo} from 'react'

import type {EntryLink, EntryShot} from '@/db'

import {SafeSuspense} from '../../boundary'
import {FocusRing, PaperLayer, Surface, useEntity} from '../../entity'
import {BLACK, HAIRLINE} from '../../graphics'
import {insetRect} from '../../grid'
import {focusIds} from '../../state'
import {ShotArtwork} from './ShotArtwork'
import {ShotLabel} from './ShotLabel'
import {useShotInteraction} from './useShotInteraction'
import {VideoBadge} from './VideoBadge'

type ShotContentProps = {
  entry: EntryShot | EntryLink
}

export const ShotContent: FC<ShotContentProps> = ({entry}) => {
  const {size} = useEntity()
  const card = useMemo(() => ({x: 0, y: 0, ...size}), [size])
  const artwork = useMemo(() => insetRect(card, 1), [card])
  const {badge, handlers, video} = useShotInteraction(entry)

  return (
    <>
      <Surface fill={BLACK} border={HAIRLINE} {...handlers} />
      <FocusRing id={focusIds.shot(entry.slug)} rect={card} radius={16} />
      <SafeSuspense fallback={null}>
        <ShotArtwork entry={entry} rect={artwork} video={video} />
        {entry.videos && <VideoBadge motion={badge} />}
        <PaperLayer rect={artwork} radius={15} order={4} />
        <ShotLabel title={entry.title} subtitle={entry.subtitle} clip={artwork} />
      </SafeSuspense>
    </>
  )
}
