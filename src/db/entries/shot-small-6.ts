import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -109, y: 70},
    origin: 'bottom left',
    to: {delay: 0.2, duration: 1.2, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's6',
  description:
    'The settings panel went through several redesigns before it clicked: one place to control driver cams, audio and broadcast channel, and every 3D map overlay — cars, DRS zones, corner numbers. I settled on an ornament with nested navigation sheets so the main player stays uncluttered no matter how many options live underneath it.',
  image: '/jpg/shot-small-6.jpg',
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
  slug: 'lapz-watch-f1-in-visionos-player-settings',
  title: 'Lapz - Player Settings',
  variant: 'shot',
}

export default shot
