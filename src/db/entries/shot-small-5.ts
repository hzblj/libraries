import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -109, y: 70},
    origin: 'bottom left',
    to: {delay: 0.2, duration: 1.2, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's5',
  description:
    "I built the end-to-end service flow technicians use on the shop floor: look up a car by license plate, pull its full service history, then log parts, labor, prices, and photos as the repair happens. That report goes straight to the client's app, where they see the total cost and approve it without a phone call.",
  image: '/jpg/shot-small-5.jpg',
  properties: [
    {
      name: 'Product',
      value: 'Volvista - Service Technician',
    },
    {
      name: 'Technology',
      value: 'Expo, React Native, TypeScript',
    },
    {
      name: 'Industry',
      value: 'Automotive / Field Service / B2B',
    },
    {
      name: 'Link',
      url: 'https://qest.cz',
      value: 'qest.cz',
    },
    {
      name: 'Year',
      value: '2020',
    },
  ],
  size: 'small',
  slug: 'volvista-vehicle-service-management',
  title: 'Volvista - Vehicle Service Management',
  variant: 'shot',
}

export default shot
