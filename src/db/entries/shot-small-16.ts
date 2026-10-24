import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: 37, y: 0},
    origin: 'center right',
    to: {delay: 0.1, duration: 0.8, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's16',
  description:
    'I built this version specifically for Zebra handheld scanners used on the shop floor, where drop-off and pickup flows need to survive real store conditions — weak signal, gloved hands, a queue of customers waiting. Offline-first architecture and a scan-first UI keep it fast and reliable on dedicated hardware, not just in a demo.',
  image: '/jpg/shot-small-16.jpg',
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
  slug: 'dpd-zebra-device',
  title: 'DPD - Zebra Device',
  variant: 'shot',
}

export default shot
