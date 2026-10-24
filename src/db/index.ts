import profile from './entries/profile'
import type {AnimationConfig, Entries, EntryExample} from './types'

// Every card grows out of the corner that faces the profile, so the collection
// opens outwards from the middle.
const growFrom = (origin: string, x: number, y: number, delay: number): AnimationConfig => ({
  from: {opacity: 0, scale: 0.88, x, y},
  origin,
  to: {delay, duration: 1.1, ease: 'bezier-out-back', opacity: 1, scale: 1, x: 0, y: 0},
})

// Every library's example app lives in its repository's apps/example, and its
// icon in public/examples (drawn by artwork/render.mjs).
const example = (title: string, repository: string, description: string): EntryExample => ({
  description,
  icon: `/examples/${repository}.png`,
  title,
  url: `https://github.com/hzblj/${repository}/tree/main/apps/example`,
})

export const entries: Entries = [
  profile,
  {
    animation: growFrom('bottom right', 40, 40, 0.25),
    area: 'l1',
    description:
      'A native-first design system for Expo. Real SwiftUI and Jetpack Compose components, with one token-typed styling surface.',
    image: '/libraries/kara-ui.png',
    properties: [
      {name: 'Website', url: 'https://www.kara.janblazej.dev', value: 'kara.janblazej.dev'},
      {name: 'Documentation', url: 'https://www.kara.janblazej.dev/docs', value: 'Kara docs'},
      {name: 'GitHub', url: 'https://github.com/hzblj/kara-ui', value: 'hzblj/kara-ui'},
      {name: 'npm', url: 'https://www.npmjs.com/package/@hzblj/kara-ui', value: '@hzblj/kara-ui'},
    ],
    size: 'large',
    slug: 'kara-ui',
    subtitle: 'Design system for Expo',
    title: 'Kara',
    variant: 'shot',
    videos: {mp4: '/libraries/kara-ui.mp4', webm: '/libraries/kara-ui.webm'},
  },
  {
    animation: growFrom('bottom', 0, 40, 0.1),
    area: 's2',
    description: 'Alternate app icons for Expo on iOS and Android. Generate at prebuild, switch at runtime.',
    image: '/libraries/expo-app-icons.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-app-icons', value: 'hzblj/expo-app-icons'},
      {name: 'npm', url: 'https://www.npmjs.com/package/@hzblj/expo-app-icons', value: '@hzblj/expo-app-icons'},
    ],
    size: 'small',
    slug: 'expo-app-icons',
    subtitle: 'Switch icons at runtime',
    title: 'App Icons',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-app-icons.mp4', webm: '/libraries/expo-app-icons.webm'},
  },
  {
    animation: growFrom('bottom', 0, 40, 0.25),
    area: 's1',
    description:
      'A starter for Expo apps that are meant to grow: a Turborepo monorepo with shared UI, theming, state and feature packages, all in TypeScript.',
    image: '/libraries/react-native-expo-monorepo.png',
    properties: [
      {
        name: 'GitHub',
        url: 'https://github.com/hzblj/react-native-expo-monorepo',
        value: 'hzblj/react-native-expo-monorepo',
      },
    ],
    size: 'small',
    slug: 'react-native-expo-monorepo',
    subtitle: 'Turborepo starter for Expo',
    title: 'Expo Monorepo',
    variant: 'shot',
    videos: {mp4: '/libraries/react-native-expo-monorepo.mp4', webm: '/libraries/react-native-expo-monorepo.webm'},
  },
  {
    animation: growFrom('top left', -40, -40, 0.3),
    area: 'l7',
    description:
      'Native zoom transitions for Expo Router. UIKit zoom on iOS and Material container transforms on Android, with interactive dismissal.',
    image: '/libraries/expo-zoom-transition.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-zoom-transition', value: 'hzblj/expo-zoom-transition'},
      {
        name: 'npm',
        url: 'https://www.npmjs.com/package/@hzblj/expo-zoom-transition',
        value: '@hzblj/expo-zoom-transition',
      },
    ],
    size: 'large',
    slug: 'expo-zoom-transition',
    subtitle: 'Expo Router transitions',
    title: 'Zoom Transition',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-zoom-transition.mp4', webm: '/libraries/expo-zoom-transition.webm'},
  },
  {
    animation: growFrom('left', -40, 0, 0.3),
    area: 's7',
    description:
      '255 native vector flags for iOS, Android and web. Sharp at every size, with typed country codes and localized names.',
    image: '/libraries/expo-flags-kit.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-flags-kit', value: 'hzblj/expo-flags-kit'},
      {name: 'npm', url: 'https://www.npmjs.com/package/@hzblj/expo-flags-kit', value: '@hzblj/expo-flags-kit'},
    ],
    size: 'small',
    slug: 'expo-flags-kit',
    subtitle: '255 country flags',
    title: 'Flags Kit',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-flags-kit.mp4', webm: '/libraries/expo-flags-kit.webm'},
  },
  {
    animation: growFrom('right', 40, 0, 0.25),
    area: 's3',
    description:
      'Platform-native feedback for Expo. Semantic events and custom patterns, powered by Core Haptics and Android haptic primitives.',
    image: '/libraries/expo-rich-haptics.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-rich-haptics', value: 'hzblj/expo-rich-haptics'},
      {
        name: 'npm',
        url: 'https://www.npmjs.com/package/@hzblj/expo-rich-haptics',
        value: '@hzblj/expo-rich-haptics',
      },
    ],
    size: 'small',
    slug: 'expo-rich-haptics',
    subtitle: 'Haptic patterns for Expo',
    title: 'Rich Haptics',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-rich-haptics.mp4', webm: '/libraries/expo-rich-haptics.webm'},
  },
  {
    animation: growFrom('top', 0, -40, 0.15),
    area: 'l6',
    description:
      'One chart API for React and Expo, native on every platform: Swift Charts on iOS, Jetpack Compose on Android, ECharts and uPlot on the web.',
    image: '/libraries/zyplot.png',
    properties: [
      {name: 'Website', url: 'https://www.zyplot.janblazej.dev', value: 'zyplot.janblazej.dev'},
      {name: 'Documentation', url: 'https://www.zyplot.janblazej.dev/docs', value: 'Zyplot docs'},
      {name: 'GitHub', url: 'https://github.com/hzblj/zyplot', value: 'hzblj/zyplot'},
      {name: 'npm', url: 'https://www.npmjs.com/package/@hzblj/zyplot', value: '@hzblj/zyplot'},
    ],
    size: 'large',
    slug: 'zyplot',
    subtitle: 'Native charts everywhere',
    title: 'Zyplot',
    variant: 'shot',
    videos: {mp4: '/libraries/zyplot.mp4', webm: '/libraries/zyplot.webm'},
  },
  {
    animation: growFrom('right', 40, 0, 0.1),
    area: 's4',
    description:
      'Your own SVG icons as native assets for Expo. iOS asset catalog images and Android vector drawables at prebuild, typed names, and a native view that tints them.',
    image: '/libraries/expo-native-icons.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-native-icons', value: 'hzblj/expo-native-icons'},
      {
        name: 'npm',
        url: 'https://www.npmjs.com/package/@hzblj/expo-native-icons',
        value: '@hzblj/expo-native-icons',
      },
    ],
    size: 'small',
    slug: 'expo-native-icons',
    subtitle: 'Your SVGs as native icons',
    title: 'Native Icons',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-native-icons.mp4', webm: '/libraries/expo-native-icons.webm'},
  },
  {
    animation: growFrom('top right', 40, -40, 0.3),
    area: 'l4',
    description:
      'PayPal Checkout with App Switch, Pay Later and PayPal Credit, vaulting, and card payments with 3D Secure, behind one promise-based API. PayPal’s own buttons come along as native views.',
    image: '/libraries/expo-paypal.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-paypal', value: 'hzblj/expo-paypal'},
      {name: 'npm', url: 'https://www.npmjs.com/package/@hzblj/expo-paypal', value: '@hzblj/expo-paypal'},
    ],
    size: 'large',
    slug: 'expo-paypal',
    subtitle: 'PayPal on the native SDK',
    title: 'PayPal',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-paypal.mp4', webm: '/libraries/expo-paypal.webm'},
  },
  {
    animation: growFrom('bottom left', -40, 40, 0.25),
    area: 'l3',
    description:
      'Agent skills for React and React Native engineers: animations that feel native, components that stay reusable and clean code, as small SKILL.md files for Claude Code, Codex, Cursor and other agents.',
    image: '/libraries/skills.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/skills', value: 'hzblj/skills'},
      {name: 'skills.sh', url: 'https://skills.sh/hzblj/skills', value: 'skills.sh/hzblj/skills'},
    ],
    size: 'large',
    slug: 'skills',
    subtitle: 'Agent skills for building apps',
    title: 'Skills',
    variant: 'shot',
    videos: {mp4: '/libraries/skills.mp4', webm: '/libraries/skills.webm'},
  },
  {
    animation: growFrom('left', -40, 0, 0.2),
    area: 's6',
    description:
      'Speech to text for Expo on the platforms’ own speech APIs: SpeechAnalyzer on iOS, with SFSpeechRecognizer before it, and the on-device SpeechRecognizer on Android. Files or the microphone, with every word’s timing for titles that follow the audio.',
    image: '/libraries/expo-speech.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-speech', value: 'hzblj/expo-speech'},
      {name: 'npm', url: 'https://www.npmjs.com/package/@hzblj/expo-speech', value: '@hzblj/expo-speech'},
    ],
    size: 'small',
    slug: 'expo-speech',
    subtitle: 'Speech to text, natively',
    title: 'Speech',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-speech.mp4', webm: '/libraries/expo-speech.webm'},
  },
  {
    animation: growFrom('left', -40, 0, 0.1),
    area: 's5',
    image: '/libraries/portfolio.png',
    size: 'small',
    slug: 'portfolio',
    subtitle: 'Apps, work and CV',
    title: 'Portfolio',
    url: 'https://www.janblazej.dev',
    variant: 'link',
    videos: {mp4: '/libraries/portfolio.mp4', webm: '/libraries/portfolio.webm'},
  },
  {
    animation: growFrom('bottom', 0, 40, 0.15),
    area: 'l2',
    description:
      'On-device translation for Expo on the platforms’ own engines: Apple’s Translation framework on iOS, with Google’s ML Kit for the languages it lacks, and ML Kit on Android. Downloads, language identification, batches, a cache and hooks.',
    image: '/libraries/expo-translation.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-translation', value: 'hzblj/expo-translation'},
      {
        name: 'npm',
        url: 'https://www.npmjs.com/package/@hzblj/expo-translation',
        value: '@hzblj/expo-translation',
      },
    ],
    size: 'large',
    slug: 'expo-translation',
    subtitle: 'Translation on the device',
    title: 'Translation',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-translation.mp4', webm: '/libraries/expo-translation.webm'},
  },
  {
    animation: growFrom('top', 0, -40, 0.15),
    area: 'l5',
    description:
      'Native audio waveforms for Expo, analysed on the device and cached, drawn by a native view that follows playback at the display’s frame rate, seeks by drag or tap with haptics, and meters a recording live.',
    image: '/libraries/expo-waveform.png',
    properties: [
      {name: 'GitHub', url: 'https://github.com/hzblj/expo-waveform', value: 'hzblj/expo-waveform'},
      {name: 'npm', url: 'https://www.npmjs.com/package/@hzblj/expo-waveform', value: '@hzblj/expo-waveform'},
    ],
    size: 'large',
    slug: 'expo-waveform',
    subtitle: 'Native audio waveforms',
    title: 'Waveform',
    variant: 'shot',
    videos: {mp4: '/libraries/expo-waveform.mp4', webm: '/libraries/expo-waveform.webm'},
  },
  {
    animation: growFrom('right', 40, 0, 0.35),
    area: 'examples',
    examples: [
      example('App Icons', 'expo-app-icons', 'A family of icons to switch'),
      example('Flags Kit', 'expo-flags-kit', 'Every flag, searchable'),
      example('Kara', 'kara-ui', 'Every component and story'),
      example('Native Icons', 'expo-native-icons', 'Material Symbols, natively'),
      example('PayPal', 'expo-paypal', 'Every flow on the sandbox'),
      example('Rich Haptics', 'expo-rich-haptics', 'Every haptic and a composer'),
      example('Speech', 'expo-speech', 'Team radio, transcribed'),
      example('Translation', 'expo-translation', '15 Wikipedias, translated'),
      example('Waveform', 'expo-waveform', 'Team radio you can scrub'),
      example('Zoom Transition', 'expo-zoom-transition', 'Photos zooming into pages'),
      example('Zyplot', 'zyplot', 'Every chart, in five apps'),
    ],
    slug: 'examples',
    subtitle: 'Every library, built with Kara',
    title: 'Example apps',
    variant: 'examples',
  },
]

export * from './cv'
export * from './ico'
export * from './types'

export const getEntryBySlug = (slug: string) => entries.find(entry => entry.slug === slug)
