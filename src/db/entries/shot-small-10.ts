import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 1, y: 14.5},
    origin: 'bottom right',
    to: {delay: 0.1, duration: 0.8, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's10',
  description:
    "I built a custom pickup-points map for checkout that handles thousands of locations without leaning on a heavy third-party maps SDK. Clustering keeps it readable at every zoom level, and owning the implementation gave me full control over performance and UX instead of fighting someone else's abstraction.",
  image: '/jpg/shot-small-10.jpg',
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
  size: 'small',
  slug: 'footshop-pickup-points',
  title: 'Footshop - Pickup Points',
  variant: 'shot',
}

export default shot
