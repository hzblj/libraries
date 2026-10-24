'use client'

import type {FC} from 'react'

import type {Entries} from '@/db'

import {ContactCard} from './contact'
import {CVCard} from './cv'
import {GalleryCard} from './gallery'
import {MapCard} from './map'
import {ProfileCard} from './profile'
import {ShotCard} from './shot'
import {TechnologiesCard} from './technologies'

type CardsProps = {
  entries: Entries
}

export const Cards: FC<CardsProps> = ({entries}) => {
  return entries.map(entry => {
    switch (entry.variant) {
      case 'contact':
        return <ContactCard key={entry.area} entry={entry} />
      case 'cv':
        return <CVCard key={entry.area} entry={entry} />
      case 'gallery':
        return <GalleryCard key={entry.area} entry={entry} />
      case 'map':
        return <MapCard key={entry.area} entry={entry} />
      case 'profile':
        return <ProfileCard key={entry.area} entry={entry} />
      case 'link':
      case 'shot':
        return <ShotCard key={entry.area} entry={entry} />
      case 'technologies':
        return <TechnologiesCard key={entry.area} entry={entry} />
    }
  })
}
