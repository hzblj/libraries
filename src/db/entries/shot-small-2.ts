import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 109, y: 70},
    origin: 'bottom right',
    to: {delay: 0.2, duration: 1.2, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's2',
  description:
    'I integrated Adyen to bring native Apple Pay and Google Pay checkout to the app, cutting payment down to a single tap. Fewer form fields and fewer redirects meant less drop-off at exactly the point customers were most likely to abandon.',
  image: '/jpg/shot-small-2.jpg',
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
  slug: 'footshop-native-payments',
  title: 'Footshop - Native Payments',
  variant: 'shot',
}

export default shot
