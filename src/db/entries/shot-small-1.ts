import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 109, y: 70},
    origin: 'bottom right',
    to: {delay: 0.2, duration: 1.2, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's1',
  description:
    "I built a Trending feature that ranks the top 10 products per category — Shoes, Apparel, Accessories — for individual cities like Prague, Berlin, and Paris. It turns raw sales data into a discovery tool, so shoppers see what's actually popular locally instead of a generic global chart.",
  image: '/jpg/shot-small-1.jpg',
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
      value: '2025',
    },
  ],
  size: 'small',
  slug: 'footshop-trending',
  title: 'Footshop - Trending',
  variant: 'shot',
}

export default shot
