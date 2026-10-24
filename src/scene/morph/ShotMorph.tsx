'use client'

import type {FC} from 'react'

import type {EntryShot} from '@/db'

import {SafeSuspense} from '../boundary'
import {BLACK, HAIRLINE} from '../graphics'
import type {CardSource} from '../state'
import {MorphArtwork} from './MorphArtwork'
import {MorphSurface} from './MorphSurface'
import {useMorphFrame} from './useMorphFrame'

type ShotMorphProps = {
  entry: EntryShot
  source: CardSource
}

export const ShotMorph: FC<ShotMorphProps> = ({entry, source}) => {
  const frame = useMorphFrame()

  return (
    <>
      <MorphSurface source={source} frame={frame} fill={BLACK} border={HAIRLINE} />
      <SafeSuspense fallback={null}>
        <MorphArtwork entry={entry} source={source} frame={frame} />
      </SafeSuspense>
    </>
  )
}
