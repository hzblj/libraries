import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 109, y: -70},
    origin: 'top right',
    to: {delay: 0.2, duration: 1.2, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's26',
  description:
    'Live matches play out as Instagram-style stories, with key moments generated in real time as the game evolves — built in React Native and Expo, animated with Reanimated, so a goal in minute 89 shows up in the feed before the fans in the stadium finish celebrating.',
  image: '/jpg/shot-small-26.jpg',
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
  slug: 'sportlito-live-match-stories',
  title: 'Sportlito - Live Match Stories',
  variant: 'shot',
}

export default shot
