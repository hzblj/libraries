'use client'

import type {FC} from 'react'

import type {EntryCV} from '@/db'

import {SafeSuspense} from '../../boundary'
import {Entity, Surface} from '../../entity'
import {CVContent} from './CVContent'
import {CV_BORDER_ANGLE} from './preview'

type CVCardProps = {
  entry: EntryCV
}

export const CVCard: FC<CVCardProps> = ({entry}) => {
  return (
    <Entity entry={entry}>
      <SafeSuspense fallback={<Surface border={CV_BORDER_ANGLE} />}>
        <CVContent entry={entry} />
      </SafeSuspense>
    </Entity>
  )
}
