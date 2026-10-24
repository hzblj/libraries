'use client'

import {type FC, useMemo} from 'react'

import {Config} from '@/config'

import {FocusRing, Surface} from '../../entity'
import {useHotspots} from '../../interaction'
import {focusIds} from '../../state'
import {ContactLink} from '../contact/ContactLink'
import {useContactLinks} from '../contact/useContactLinks'
import {UnderlineLayer} from '../shared'
import {ProfileIdentity} from './ProfileIdentity'
import {HINTS_TOP, WIDTH} from './styles'
import {useProfileEntrance} from './useProfileEntrance'
import {useProfileLayout} from './useProfileLayout'
import {useSubjectLink} from './useSubjectLink'

const CONTACTS = [
  {type: 'GitHub', url: 'https://github.com/hzblj'},
  {type: 'npm', url: 'https://www.npmjs.com/~hzblj'},
]

export const ProfileContent: FC = () => {
  const layout = useProfileLayout()
  const entrance = useProfileEntrance()
  const {hotspots, links, underlines} = useContactLinks(CONTACTS, HINTS_TOP, WIDTH)
  const subject = useSubjectLink(layout.subjectX, layout.subjectWidth)
  const pointer = useHotspots(useMemo(() => [subject.hotspot, ...hotspots], [hotspots, subject.hotspot]))

  return (
    <>
      <Surface {...pointer} />
      <ProfileIdentity
        nameX={layout.nameX}
        taglineX={layout.taglineX}
        subjectX={layout.subjectX}
        name={entrance.name}
        tagline={entrance.tagline}
        subject={entrance.subject}
      />
      <UnderlineLayer rect={subject.underline} motion={subject.motion} order={2} />
      <FocusRing id={focusIds.contact(Config.tagline.subject)} rect={subject.link} radius={6} />
      {links.map(({contact, link, underline}, index) => (
        <ContactLink
          key={contact.type}
          label={contact.type}
          link={link}
          underline={underline}
          underlineMotion={underlines[index].motion}
          hasDivider={index < links.length - 1}
          entrance={entrance.hints[index][0]}
        />
      ))}
    </>
  )
}
