import type {Metadata, Viewport} from 'next'
import type {ReactNode} from 'react'

import {GoogleAnalytics, WebVitals} from '@/components'
import {Config} from '@/config'

import './styles.css'

const OG_IMAGE = {alt: 'hzblj, libraries for Expo and React Native', height: 630, url: '/png/og-image.png', width: 1200}

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    title: Config.handle,
  },
  authors: [{name: Config.fullName, url: Config.portfolio}],
  creator: Config.fullName,
  description: Config.description,
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      {sizes: '32x32', type: 'image/png', url: '/favicon-32x32.png'},
      {sizes: '16x16', type: 'image/png', url: '/favicon-16x16.png'},
    ],
    shortcut: '/favicon.ico',
  },
  keywords: [
    'Expo libraries',
    'React Native libraries',
    'Expo modules',
    'Expo design system',
    'SwiftUI',
    'Jetpack Compose',
    'Expo Router zoom transition',
    'Expo SVG icons',
    'native SVG icons',
    'alternate app icons',
    'haptics',
    'country flags',
    'Expo PayPal',
    'React Native PayPal',
    'Expo speech to text',
    'React Native speech recognition',
    'Expo translation',
    'on-device translation',
    'React Native audio waveform',
    'Expo waveform',
    'React Native charts',
    'Expo monorepo',
    'agent skills',
    'Claude Code skills',
    'Kara',
    'Zyplot',
    'hzblj',
    'Jan Blazej',
  ],
  manifest: '/site.webmanifest',
  metadataBase: new URL(Config.site),
  openGraph: {
    description: Config.description,
    images: [OG_IMAGE],
    locale: 'en_US',
    siteName: `${Config.handle} libraries`,
    title: Config.title,
    type: 'website',
    url: Config.site,
  },
  publisher: Config.fullName,
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  title: {
    default: Config.title,
    template: `%s | ${Config.handle}`,
  },
  twitter: {
    card: 'summary_large_image',
    description: Config.description,
    images: [OG_IMAGE.url],
    title: Config.title,
  },
}

export default function Layout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics />
        <WebVitals />
      </body>
    </html>
  )
}
