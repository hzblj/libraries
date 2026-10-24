'use client'

import type {FC} from 'react'

import type {EntryGallery} from '@/db'

import {SafeSuspense} from '../../boundary'
import {Entity, Surface} from '../../entity'
import {GalleryContent} from './GalleryContent'

type GalleryCardProps = {
  entry: EntryGallery
}

export const GalleryCard: FC<GalleryCardProps> = ({entry}) => {
  return (
    <Entity entry={entry}>
      <SafeSuspense fallback={<Surface />}>
        <GalleryContent />
      </SafeSuspense>
    </Entity>
  )
}
