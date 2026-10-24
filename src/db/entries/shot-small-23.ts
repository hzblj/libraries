import type {EntryShot} from '../types'

const shot: EntryShot = {
  animation: {
    from: {opacity: 0, scale: 0.88, x: -37, y: -15},
    origin: 'top left',
    to: {delay: 0.15, duration: 1, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
  },
  area: 's23',
  description:
    'I built a custom video player with FairPlay DRM for protected F1 streams and a fully custom progress bar, supporting both live and archived races. From the player you can pop out floating windows for driver cams, live telemetry, and team radio, with an audio controller tucked into the corner for quick access.',
  image: '/webp/shot-small-23.webp',
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
  slug: 'lapz-watch-f1-in-visionos-spatial-video-player',
  title: 'Lapz - Spatial Video Player',
  variant: 'shot',
  videos: {
    mp4: '/mp4/shot-small-23.mp4',
    webm: '/webm/shot-small-23.webm',
  },
}

export default shot
