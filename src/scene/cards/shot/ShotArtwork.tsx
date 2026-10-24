'use client'

import type {FC} from 'react'

import type {EntryLink, EntryShot} from '@/db'

import {Layer, type VideoSource} from '../../entity'
import {useImage} from '../../graphics'
import type {Rect} from '../../grid'
import {shotImageWidth} from './imageWidth'

type ShotArtworkProps = {
  entry: EntryShot | EntryLink
  rect: Rect
  video: VideoSource
}

export const ShotArtwork: FC<ShotArtworkProps> = ({entry, rect, video}) => {
  const map = useImage(entry.image, shotImageWidth(entry.size))

  return <Layer rect={rect} radius={15} map={map} order={1} video={video} />
}
