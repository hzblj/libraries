import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -37, y: 14.5},
    origin: 'bottom left',
    to: {delay: 0.1, duration: 0.8, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's12',
  description:
    "A small detail with an outsized effect on first impressions: a Lottie-animated splash screen that adapts automatically to the system's light or dark mode.",
  image: '/webp/shot-small-12.webp',
  properties: [
    {
      name: 'Product',
      value: 'Queens',
    },
    {
      name: 'Technology',
      value: 'Expo, React Native, TypeScript',
    },
    {
      name: 'Industry',
      value: 'E-commerce / Apparel / Sneakers',
    },
    {
      name: 'Link',
      url: 'https://queens.com',
      value: 'queens.com',
    },
    {
      name: 'Year',
      value: '2025',
    },
  ],
  size: 'small',
  slug: 'queens-splash-screen',
  title: 'Queens - Splash Screen',
  variant: 'shot',
  videos: {
    mp4: '/mp4/shot-small-12.mp4',
    webm: '/webm/shot-small-12.webm',
  },
}

export default shot
