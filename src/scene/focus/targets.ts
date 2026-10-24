import {Config} from '@/config'
import type {Entry} from '@/db'

import {TECHNOLOGIES} from '../cards'
import {getAreaRect} from '../grid'
import {focusIds, type OpenCard} from '../state'

type Base = {id: string; label: string; area: string}

export type FocusTarget =
  | (Base & {kind: 'card'; href: string; card: OpenCard})
  | (Base & {kind: 'gallery'})
  | (Base & {kind: 'external'; href: string})

const byPosition = (a: Entry, b: Entry) => {
  const first = getAreaRect(a.area)
  const second = getAreaRect(b.area)

  return first.y - second.y || first.x - second.x
}

const targetsOf = (entry: Entry): FocusTarget[] => {
  const {area} = entry

  switch (entry.variant) {
    case 'shot':
      return [
        {
          area,
          card: {entry, kind: 'shot'},
          href: `/${entry.slug}`,
          id: focusIds.shot(entry.slug),
          kind: 'card',
          label: entry.title,
        },
      ]
    case 'link':
      return [{area, href: entry.url, id: focusIds.shot(entry.slug), kind: 'external', label: entry.title}]
    case 'cv':
      return [{area, card: {entry, kind: 'cv'}, href: '/cv', id: focusIds.cv, kind: 'card', label: 'CV'}]
    case 'gallery':
      return [{area, id: focusIds.gallery, kind: 'gallery', label: 'Personal Gallery'}]
    case 'profile':
      return [
        {area, href: 'https://github.com/hzblj', id: focusIds.contact('GitHub'), kind: 'external', label: 'GitHub'},
        {area, href: 'https://www.npmjs.com/~hzblj', id: focusIds.contact('npm'), kind: 'external', label: 'npm'},
      ]
    case 'contact':
      return entry.contacts.map(({type, url}) => ({
        area,
        href: url,
        id: focusIds.contact(type),
        kind: 'external',
        label: type,
      }))
    case 'technologies':
      return TECHNOLOGIES.map(({title, url}) => ({
        area,
        href: url,
        id: focusIds.technology(title),
        kind: 'external',
        label: title,
      }))
    case 'map':
      return [{area, href: Config.location.mapUrl, id: focusIds.map, kind: 'external', label: Config.location.city}]
  }
}

export const focusTargetsOf = (entries: readonly Entry[]) => [...entries].sort(byPosition).flatMap(targetsOf)
