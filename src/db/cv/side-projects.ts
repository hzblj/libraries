import {CVSections} from '../types'

export const sideProjects: CVSections = [
  {
    links: [
      {
        name: 'Forbes: This Incredible F1 App Is The Best Reason Yet To Buy A Vision Pro ↗',
        url: 'https://www.forbes.com/sites/barrycollins/2024/10/02/this-incredible-f1-app-is-the-best-reason-yet-to-buy-a-vision-pro',
      },
      {
        name: 'MacRumors: Lapz App Lets You Watch Formula 1 Races on Apple Vision Pro ↗',
        url: 'https://www.macrumors.com/2024/10/18/lapz-formula-1-app-vision-pro',
      },
      {
        name: 'The Verge: Vision Pro’s viral Lapz app put on hold after F1 complaint ↗',
        url: 'https://www.theverge.com/2024/11/20/24301420/apple-vision-pro-viral-lapz-app-f1-complaint',
      },
      {
        name: 'Instagram: Watching Formula 1 with Lapz on the Apple Vision Pro has transformed how races are viewed forever ↗',
        url: 'https://www.instagram.com/reel/DA8771vtJAE',
      },
    ],
    location: 'Prague, CZ / Remote',
    paragraphs: [
      'I co-founded Lapz to reinvent how motorsport fans experience Formula 1 and other racing series on Apple Vision Pro. By merging real-time data with Mixed Reality, Lapz transforms race-watching into something you can feel, not just see. What began as a side project is now being hailed as “…The Best Reason Yet To Buy a Vision Pro” – Forbes, 2024.',
      'Building the core application in SwiftUI while exploring the possibilities of visionOS and spatial computing. Collaborating closely with UI designers and 3D artists to create interactive race environments and intuitive spatial interfaces. Working with HLS live streaming and implementing FairPlay DRM to deliver synchronized, secure video content within the spatial experience. Additionally, reverse engineering Formula 1 APIs to access and integrate real-time data such as car positions, telemetry, and live event updates.',
    ],
    positions: [{company: 'Lapz', title: 'Co-Founder & VisionOS Developer', url: 'https://lapz.io'}],
    projects: [],
    technologies: ['SwiftUI', 'VisionOS'],
    year: '2024 - Now',
  },
  {
    links: [],
    location: 'Prague, CZ',
    paragraphs: [
      'Meetback was a web app designed to help teams reflect on the value of their recurring online meetings during the peak of the COVID era. It aimed to bring clarity to whether meetings were a good use of time by collecting structured feedback from attendees. I was one of four co-founders, responsible for designing and building the entire frontend application as the sole React developer. I closely collaborated with our UI/UX designer and backend developer to ensure a cohesive and responsive user experience, as well as smooth integration with the backend services, from initial architecture through to deployment.',
    ],
    positions: [{company: 'Meetback', title: 'Co-founder', url: 'https://meetback.webflow.io'}],
    projects: [],
    technologies: ['React', 'TypeScript'],
    year: '2021 - 2022',
  },
]
