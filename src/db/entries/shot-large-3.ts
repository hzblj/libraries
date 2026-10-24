import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -73, y: -15},
    origin: 'top left',
    to: {delay: 0.2, duration: 1.2, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 'l3',
  description:
    "Tap any driver's badge on the 3D circuit and their live onboard camera opens right there in the spatial scene, anchored to the moving car with tire compound, speed, gear, and gap-to-leader floating alongside it. It's the kind of interaction that only makes sense on a spatial computer — proof that visionOS can do more than mirror a flat screen into a room.",
  image: '/webp/shot-large-3.webp',
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
  size: 'large',
  slug: 'lapz-watch-f1-in-visionos-driver-cameras',
  title: 'Lapz - Driver Cameras',
  variant: 'shot',
  videos: {
    mp4: '/mp4/shot-large-3.mp4',
    webm: '/webm/shot-large-3.webm',
  },
}

export default shot
