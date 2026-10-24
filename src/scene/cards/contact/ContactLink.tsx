'use client'

import type {FC} from 'react'

import {FocusRing, type Motion, TextLayer} from '../../entity'
import type {Rect} from '../../grid'
import {focusIds} from '../../state'
import {UnderlineLayer} from '../shared'
import {ContactDot} from './ContactDot'
import {LINK} from './styles'

type ContactLinkProps = {
  label: string
  link: Rect
  underline: Rect
  underlineMotion: Motion
  hasDivider: boolean
  entrance?: Motion
}

export const ContactLink: FC<ContactLinkProps> = ({label, link, underline, underlineMotion, hasDivider, entrance}) => {
  return (
    <>
      <TextLayer text={label} style={LINK} x={link.x} top={link.y} order={1} motion={entrance} />
      <UnderlineLayer rect={underline} motion={underlineMotion} order={2} />
      <FocusRing id={focusIds.contact(label)} rect={link} radius={6} />
      {hasDivider && <ContactDot x={link.x + link.width + 12} top={link.y} motion={entrance} />}
    </>
  )
}
