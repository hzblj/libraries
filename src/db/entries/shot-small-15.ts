import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 73, y: 0},
    origin: 'center right',
    to: {delay: 0.15, duration: 1, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's15',
  description:
    'Drop-off and courier pickup run as two clearly separated flows, built offline-first since pickup points often have spotty connectivity and share data across multiple devices. Every action is stored locally first and synced later, so staff never have to stop working because the network did.',
  image: '/jpg/shot-small-15.jpg',
  properties: [
    {
      name: 'Product',
      value: 'DPD - My Pickup',
    },
    {
      name: 'Technology',
      value: 'Expo, React Native, TypeScript',
    },
    {
      name: 'Industry',
      value: 'Logistics / Last-Mile Delivery',
    },
    {
      name: 'Link',
      url: 'https://qest.cz',
      value: 'qest.cz',
    },
    {
      name: 'Year',
      value: '2022',
    },
  ],
  size: 'small',
  slug: 'dpd-my-pickup-parcel-handover-flows',
  title: 'DPD - Parcel Handover Flows',
  variant: 'shot',
}

export default shot
