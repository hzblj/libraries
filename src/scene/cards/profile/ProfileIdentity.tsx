'use client'

import {type FC, useMemo} from 'react'

import {Config} from '@/config'

import {Layer, type Motion, SplitTextLayer} from '../../entity'
import {useSvg} from '../../graphics'
import {SUBJECT, TAGLINE, TAGLINE_TOP, WIDTH, WORDMARK, WORDMARK_TOP} from './styles'

const BLEED = 8

type ProfileIdentityProps = {
  taglineX: number
  subjectX: number
  entrance: {
    wordmark: Motion
    tagline: readonly Motion[]
    subject: readonly Motion[]
  }
}

// The handle as the wordmark, the favicon's "h" leading it, and what it makes
// under it.
export const ProfileIdentity: FC<ProfileIdentityProps> = ({taglineX, subjectX, entrance}) => {
  const wordmark = useSvg('/svg/wordmark.svg', WORDMARK)
  const rect = useMemo(() => ({...WORDMARK, x: (WIDTH - WORDMARK.width) / 2, y: WORDMARK_TOP}), [])

  return (
    <>
      <Layer rect={rect} map={wordmark} fit="fill" motion={entrance.wordmark} bleed={BLEED} order={3} />
      <SplitTextLayer
        text={Config.tagline.prefix}
        style={TAGLINE}
        x={taglineX}
        top={TAGLINE_TOP}
        order={3}
        motions={entrance.tagline}
      />
      <SplitTextLayer
        text={Config.tagline.subject}
        style={SUBJECT}
        x={subjectX}
        top={TAGLINE_TOP}
        order={3}
        motions={entrance.subject}
      />
    </>
  )
}
