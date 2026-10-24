'use client'

import type {FC} from 'react'

import type {EntryMap} from '@/db'

import {SafeSuspense} from '../../boundary'
import {Entity, Surface} from '../../entity'
import {BLACK} from '../../graphics'
import {MapContent} from './MapContent'

type MapCardProps = {
  entry: EntryMap
}

export const MapCard: FC<MapCardProps> = ({entry}) => {
  return (
    <Entity entry={entry}>
      <SafeSuspense fallback={<Surface fill={BLACK} />}>
        <MapContent />
      </SafeSuspense>
    </Entity>
  )
}
