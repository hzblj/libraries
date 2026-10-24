'use client'

import type {FC} from 'react'

import {Config} from '@/config'

import {FocusRing, Surface} from '../../entity'
import {useHotspots} from '../../interaction'
import {focusIds} from '../../state'
import {UnderlineLayer} from '../shared'
import {ProfileHints} from './ProfileHints'
import {ProfileIdentity} from './ProfileIdentity'
import {ProfileLinks} from './ProfileLinks'
import {useProfileEntrance} from './useProfileEntrance'
import {useProfileLayout} from './useProfileLayout'
import {useProfileLinks} from './useProfileLinks'

export const ProfileContent: FC = () => {
  const layout = useProfileLayout()
  const entrance = useProfileEntrance()
  const links = useProfileLinks(layout.links, layout.subjectX, layout.subjectWidth)
  const pointer = useHotspots(links.hotspots)

  return (
    <>
      <Surface {...pointer} />
      <ProfileIdentity taglineX={layout.taglineX} subjectX={layout.subjectX} entrance={entrance} />
      <UnderlineLayer rect={links.subject.underline} motion={links.subject.motion} order={3} />
      <FocusRing id={focusIds.contact(Config.tagline.subject)} rect={links.subject.link} radius={6} />
      <ProfileLinks pills={layout.links} rects={links.rects} hovers={links.hovers} entrance={entrance.links} />
      <ProfileHints xs={layout.hintX} motions={entrance.hints} />
    </>
  )
}
