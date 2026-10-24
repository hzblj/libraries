'use client'

import type {FC} from 'react'

import type {Contact} from '@/db'

import {Surface, TextLayer} from '../../entity'
import {ContactLink} from './ContactLink'
import {HEIGHT, LINK, WIDTH} from './styles'
import {useContactLinks} from './useContactLinks'

type ContactContentProps = {
  contacts: Contact[]
}

export const ContactContent: FC<ContactContentProps> = ({contacts}) => {
  const {links, pointer, underlines} = useContactLinks(contacts)

  return (
    <>
      <Surface {...pointer} />
      {links.map(({contact, link, underline}, index) => (
        <ContactLink
          key={contact.type}
          label={contact.type}
          link={link}
          underline={underline}
          underlineMotion={underlines[index].motion}
          hasDivider={index < links.length - 1}
        />
      ))}
      <TextLayer
        text="Contact"
        style={LINK}
        x={WIDTH / 2}
        top={HEIGHT - 32 - 21}
        align="center"
        opacity={0.7}
        order={1}
      />
    </>
  )
}
