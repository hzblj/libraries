'use client'

import type {FC} from 'react'

import type {EntryProfile} from '@/db'

import {SafeSuspense} from '../../boundary'
import {Entity, Surface} from '../../entity'
import {ProfileContent} from './ProfileContent'

type ProfileCardProps = {
  entry: EntryProfile
}

export const ProfileCard: FC<ProfileCardProps> = ({entry}) => {
  return (
    <Entity entry={entry}>
      <SafeSuspense fallback={<Surface />}>
        <ProfileContent />
      </SafeSuspense>
    </Entity>
  )
}
