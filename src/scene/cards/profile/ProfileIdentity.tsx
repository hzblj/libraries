'use client'

import type {FC} from 'react'

import {Config} from '@/config'

import {type Motion, SplitTextLayer} from '../../entity'
import {NAME, NAME_TOP, SUBJECT, TAGLINE, TAGLINE_TOP} from './styles'

type ProfileIdentityProps = {
  nameX: number
  taglineX: number
  subjectX: number
  name: readonly Motion[]
  tagline: readonly Motion[]
  subject: readonly Motion[]
}

export const ProfileIdentity: FC<ProfileIdentityProps> = ({nameX, taglineX, subjectX, name, tagline, subject}) => {
  return (
    <>
      <SplitTextLayer text={Config.handle} style={NAME} x={nameX} top={NAME_TOP} order={1} motions={name} />
      <SplitTextLayer
        text={Config.tagline.prefix}
        style={TAGLINE}
        x={taglineX}
        top={TAGLINE_TOP}
        order={1}
        motions={tagline}
      />
      <SplitTextLayer
        text={Config.tagline.subject}
        style={SUBJECT}
        x={subjectX}
        top={TAGLINE_TOP}
        order={1}
        motions={subject}
      />
    </>
  )
}
