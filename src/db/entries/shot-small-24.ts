import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 37, y: -15},
    origin: 'top right',
    to: {delay: 0.15, duration: 1, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's24',
  description:
    "Rich push notifications carry a story image generated live from the match — every score update triggers a fresh image built from a real photo of the moment. Pre-generating it server-side kept delivery fast and stable, so fans see it on the lock screen before they'd think to open the app.",
  image: '/jpg/shot-small-24.jpg',
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
  slug: 'sportlito-live-match-notifications',
  title: 'Sportlito - Live Match Notifications',
  variant: 'shot',
}

export default shot
