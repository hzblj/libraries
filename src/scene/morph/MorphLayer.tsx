'use client'

import type {FC} from 'react'

import {useSceneStore} from '../state'
import {CVMorph} from './CVMorph'
import {ShotMorph} from './ShotMorph'
import {useHandover} from './useHandover'

export const MorphLayer: FC = () => {
  const card = useSceneStore(state => state.card)
  const source = useSceneStore(state => state.source)
  useHandover()

  if (!card || !source) {
    return null
  }

  return (
    <group>
      {card.kind === 'shot' ? (
        <ShotMorph key={source.slug} entry={card.entry} source={source} />
      ) : (
        <CVMorph key={source.slug} source={source} />
      )}
    </group>
  )
}
