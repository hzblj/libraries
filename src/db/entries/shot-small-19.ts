import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 37, y: -15},
    origin: 'top right',
    to: {delay: 0.1, duration: 0.8, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's19',
  description:
    "Every story is pre-rendered as a shareable image the moment it's created, so tapping share is instant instead of waiting on a screenshot. It hooks into the native share sheet, which made sending a match moment to WhatsApp or Instagram feel like a normal part of the app instead of a bolted-on feature.",
  image: '/webp/shot-small-19.webp',
  properties: [
    {
      name: 'Product',
      value: 'Sportlito',
    },
    {
      name: 'Technology',
      value: 'Expo, React Native, TypeScript',
    },
    {
      name: 'Industry',
      value: 'Sport / Media / Entertainment',
    },
    {
      name: 'Link',
      url: 'https://www.linkedin.com/company/sportlito',
      value: 'sportlito.com',
    },
    {
      name: 'Year',
      value: '2020',
    },
  ],
  size: 'small',
  slug: 'sportlito-story-sharing',
  title: 'Sportlito - Story Sharing',
  variant: 'shot',
  videos: {
    mp4: '/mp4/shot-small-19.mp4',
    webm: '/webm/shot-small-19.webm',
  },
}

export default shot
