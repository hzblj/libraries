import type {FC} from 'react'

import type {OpenCard} from '../state'
import {CVModalBody} from './CVModalBody'
import {ShotModalBody} from './ShotModalBody'

type CardModalBodyProps = {
  card: OpenCard
}

export const CardModalBody: FC<CardModalBodyProps> = ({card}) => {
  if (card.kind === 'shot') {
    return <ShotModalBody entry={card.entry} />
  }

  return <CVModalBody />
}
