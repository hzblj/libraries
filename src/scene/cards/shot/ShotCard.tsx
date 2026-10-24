'use client'

import type {FC} from 'react'

import type {EntryLink, EntryShot} from '@/db'

import {Entity} from '../../entity'
import {ShotContent} from './ShotContent'

type ShotCardProps = {
  entry: EntryShot | EntryLink
}

export const ShotCard: FC<ShotCardProps> = ({entry}) => {
  return (
    <Entity entry={entry}>
      <ShotContent entry={entry} />
    </Entity>
  )
}
