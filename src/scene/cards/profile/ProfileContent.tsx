'use client'

import type {FC} from 'react'

import {Surface} from '../../entity'
import {ContactLink} from '../contact/ContactLink'
import {useContactLinks} from '../contact/useContactLinks'
import {ProfileIdentity} from './ProfileIdentity'
import {HINTS_TOP, WIDTH} from './styles'
import {useProfileEntrance} from './useProfileEntrance'
import {useProfileLayout} from './useProfileLayout'

const CONTACTS = [
  {type: 'GitHub', url: 'https://github.com/hzblj'},
  {type: 'npm', url: 'https://www.npmjs.com/~hzblj'},
]

export const ProfileContent: FC = () => {
  const layout = useProfileLayout()
  const entrance = useProfileEntrance()
  const {links, pointer, underlines} = useContactLinks(CONTACTS, HINTS_TOP, WIDTH)

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
