import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -37, y: 0},
    origin: 'center left',
    to: {delay: 0.15, duration: 1, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's18',
  description:
    "Built with Black Box Infinite, this is a highly detailed model of the Las Vegas circuit — rotate or zoom in and you'll find the Fountains of Bellagio, the interior of The Sphere, and dozens of other landmarks rendered in real detail. A helicopter even flies over every five minutes, because small touches like that are what make a spatial scene feel alive rather than just accurate.",
  image: '/webp/shot-small-18.webp',
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
  slug: 'lapz-watch-f1-in-visionos-map',
  title: 'Lapz - Map',
  variant: 'shot',
  videos: {
    mp4: '/mp4/shot-small-18.mp4',
    webm: '/webm/shot-small-18.webm',
  },
}

export default shot
