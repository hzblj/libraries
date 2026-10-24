import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -1, y: 14.5},
    origin: 'bottom left',
    to: {delay: 0.1, duration: 0.8, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's11',
  description:
    "When Footshop launched its sister brand Queens, I restructured the codebase into a Turborepo monorepo so both apps could share core logic, UI components, and business rules. That let us ship a second brand's app without duplicating a single screen, while shared packages keep both apps consistent and still leave room for brand-specific styling.",
  image: '/jpg/shot-small-11.jpg',
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
  slug: 'queens-mobile-app',
  title: 'Queens - Mobile App',
  variant: 'shot',
}

export default shot
