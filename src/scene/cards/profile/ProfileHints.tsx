'use client'

import type {FC} from 'react'

import {type Motion, SplitTextLayer} from '../../entity'
import {ProfileArrows} from './ProfileArrows'
import {ProfileKeyboard} from './ProfileKeyboard'
import {HINTS, HINTS_TOP} from './styles'

type ProfileHintsProps = {
  xs: number[]
  motions: readonly (readonly Motion[])[]
}

export const ProfileHints: FC<ProfileHintsProps> = ({xs, motions}) => {
  return HINTS.map((hint, index) => {
    if (hint.kind === 'arrows') {
      return <ProfileArrows key={hint.kind} x={xs[index]} entrance={motions[index][0]} />
    }

    if (hint.kind === 'keyboard') {
      return <ProfileKeyboard key={hint.kind} x={xs[index]} entrance={motions[index][0]} />
    }

    return (
      <SplitTextLayer
        key={hint.text}
        text={hint.text}
        style={hint.style}
        x={xs[index]}
        top={HINTS_TOP}
        order={1}
        motions={motions[index]}
      />
    )
  })
}
