'use client'

import type {FC} from 'react'

import type {EntryTechnologies} from '@/db'

import {SafeSuspense} from '../../boundary'
import {Entity, Surface} from '../../entity'
import {TechnologiesContent} from './TechnologiesContent'

type TechnologiesCardProps = {
  entry: EntryTechnologies
}

export const TechnologiesCard: FC<TechnologiesCardProps> = ({entry}) => {
  return (
    <Entity entry={entry}>
      <SafeSuspense fallback={<Surface />}>
        <TechnologiesContent />
      </SafeSuspense>
    </Entity>
  )
}
