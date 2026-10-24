import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -37, y: 14.5},
    origin: 'bottom left',
    to: {delay: 0.15, duration: 1, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's13',
  description:
    'F1 strategy lives and dies by weather radar, so I recreated that same tool for viewers at home: a large 3D entity hovering above the room, rendering an animated heatmap of live weather data over the circuit.',
  image: '/webp/shot-small-13.webp',
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
  slug: 'lapz-weather-radar',
  title: 'Lapz - Weather Radar',
  variant: 'shot',
  videos: {
    mp4: '/mp4/shot-small-13.mp4',
    webm: '/webm/shot-small-13.webm',
  },
}

export default shot
