'use client'

import type {FC} from 'react'

import {Layer, type Motion} from '../../entity'
import {useSvg} from '../../graphics'
import {HINTS_TOP} from './styles'
import {KEYS, useKeycapsSequence} from './useKeycapsSequence'

const KEYCAP = {height: 6, width: 6}
const BLEED = 16

type ProfileKeyboardProps = {
  x: number
  entrance: Motion
}

export const ProfileKeyboard: FC<ProfileKeyboardProps> = ({x, entrance}) => {
  const map = useSvg('/svg/key-cap.svg', KEYCAP)
  const keys = useKeycapsSequence()

  return KEYS.map(key => (
    <Layer
      key={key.name}
      rect={{...KEYCAP, x: x + key.x, y: HINTS_TOP + 4 + key.y}}
      map={map}
      fit="fill"
      order={1}
      motion={[keys[key.name], entrance]}
      bleed={BLEED}
    />
  ))
}
