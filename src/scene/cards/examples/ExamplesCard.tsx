'use client'

import type {FC} from 'react'

import type {EntryExamples} from '@/db'

import {SafeSuspense} from '../../boundary'
import {Entity, Surface} from '../../entity'
import {CV_BORDER_ANGLE} from '../cv'
import {ExamplesContent} from './ExamplesContent'

type ExamplesCardProps = {
  entry: EntryExamples
}

export const ExamplesCard: FC<ExamplesCardProps> = ({entry}) => {
  return (
    <Entity entry={entry}>
      <SafeSuspense fallback={<Surface border={CV_BORDER_ANGLE} />}>
        <ExamplesContent entry={entry} />
      </SafeSuspense>
    </Entity>
  )
}
