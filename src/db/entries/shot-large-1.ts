import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 1, y: 41.5},
    origin: 'bottom right',
    to: {delay: 0.15, duration: 1, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 'l1',
  description:
    "I joined Footshop to build its mobile app from the ground up for iOS and Android. What began as a lean MVP covering the core shopping flow grew into the company's primary mobile channel. I chose Expo and React Native to ship fast on both platforms without compromising performance, then kept the architecture flexible enough to scale as the product and team grew.",
  image: '/jpg/shot-large-1.jpg',
  properties: [
    {
      name: 'Product',
      value: 'Footshop',
    },
    {
      name: 'Technology',
      value: 'Expo, React Native, TypeScript',
    },
    {
      name: 'Industry',
      value: 'E-commerce / Fashion / Sneakers',
    },
    {
      name: 'Link',
      url: 'https://footshop.com',
      value: 'footshop.com',
    },
    {
      name: 'Year',
      value: '2023',
    },
  ],
  size: 'large',
  slug: 'footshop-mobile-app',
  title: 'Footshop - Mobile App',
  variant: 'shot',
}

export default shot
