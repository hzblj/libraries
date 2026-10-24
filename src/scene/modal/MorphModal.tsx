'use client'

import type {FC} from 'react'

import {useSceneStore} from '../state'
import {MorphModalView} from './MorphModalView'

export const MorphModal: FC = () => {
  const card = useSceneStore(state => state.card)

  if (!card) {
    return null
  }

  return <MorphModalView key={card.entry.slug} card={card} />
}
