import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 73, y: -15},
    origin: 'top right',
    to: {delay: 0.2, duration: 1.2, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 'l2',
  description:
    'Sportlito turns live football data into Instagram-style story feeds, personalized per fan and generated in real time by an algorithm that tracks goals, cards, and key moments as they happen. I built the mobile app end to end in React Native, from the live-update pipeline to the story player and sharing flow.',
  image: '/webp/shot-large-2.webp',
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
  size: 'large',
  slug: 'sportlito-mobile-app',
  title: 'Sportlito - Mobile App',
  variant: 'shot',
  videos: {
    mp4: '/mp4/shot-large-2.mp4',
    webm: '/webm/shot-large-2.webm',
  },
}

export default shot
