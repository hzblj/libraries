import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -73, y: 41.5},
    origin: 'bottom left',
    to: {delay: 0.15, duration: 1, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's7',
  description:
    'Several core screens are built in pure SwiftUI — upcoming and past races, results tables, and a circuit detail view that surfaces stats next to a 3D track map. I stayed native rather than reaching for a cross-platform layer, since predictable performance on visionOS mattered more than code reuse here.',
  image: '/jpg/shot-small-7.jpg',
  properties: [
    {
      name: 'Product',
      value: 'Lapz - Watch F1 in visionOS',
    },
    {
      name: 'Technology',
      value: 'Swift, visionOS, RealityKit',
    },
    {
      name: 'Industry',
      value: 'AR / Motorsports',
    },
    {
      name: 'Link',
      url: 'https://lapz.io',
      value: 'lapz.io',
    },
    {
      name: 'Year',
      value: '2024',
    },
  ],
  size: 'small',
  slug: 'lapz-watch-f1-in-visionos-visionos-ui',
  title: 'Lapz - visionOS UI',
  variant: 'shot',
}

export default shot
