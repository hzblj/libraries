'use client'

import type {FC} from 'react'

import type {EntryShot} from '@/db'

import {ignoreRaycast, plane} from '../graphics'
import type {CardSource} from '../state'
import {useMorphArtwork} from './useMorphArtwork'
import type {MorphFrame} from './useMorphFrame'

type MorphArtworkProps = {
  entry: EntryShot
  source: CardSource
  frame: MorphFrame
}

export const MorphArtwork: FC<MorphArtworkProps> = ({entry, source, frame}) => {
  const {material, mesh} = useMorphArtwork(entry, source, frame)

  return <mesh ref={mesh.attach} geometry={plane} material={material} renderOrder={201} raycast={ignoreRaycast} />
}
