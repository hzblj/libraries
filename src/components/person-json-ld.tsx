import {Config} from '@/config'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CZ',
    addressLocality: 'Prague',
  },
  email: 'hello@janblazej.dev',
  image: `${Config.site}/png/profile@3x.png`,
  jobTitle: 'Lead Mobile Developer & Founder',
  knowsAbout: [
    'React Native',
    'Expo',
    'TypeScript',
    'iOS Development',
    'Android Development',
    'Mobile App Development',
    'Swift',
    'visionOS',
    'RealityKit',
  ],
  name: 'Jan Blazej',
  sameAs: ['https://www.linkedin.com/in/hzblj', 'https://github.com/hzblj', 'https://www.instagram.com/hzblj'],
  url: Config.site,
  worksFor: {
    '@type': 'Organization',
    name: 'Footshop',
    url: 'https://footshop.com',
  },
}

/**
 * Personal identity structured data. Rendered per route rather than site-wide,
 * so pages about the sole proprietorship (/ico) aren't tied to an employer.
 */
export const PersonJsonLd = () => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
)
