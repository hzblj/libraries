'use client'

import type {FC} from 'react'

import type {EntryContact} from '@/db'

import {SafeSuspense} from '../../boundary'
import {Entity, Surface} from '../../entity'
import {ContactContent} from './ContactContent'

type ContactCardProps = {
  entry: EntryContact
}

export const ContactCard: FC<ContactCardProps> = ({entry}) => {
  return (
    <Entity entry={entry}>
      <SafeSuspense fallback={<Surface />}>
        <ContactContent contacts={entry.contacts} />
      </SafeSuspense>
    </Entity>
  )
}
