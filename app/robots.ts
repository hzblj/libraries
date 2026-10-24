import type {MetadataRoute} from 'next'

import {Config} from '@/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{allow: '/', disallow: ['/_next/'], userAgent: '*'}],
    sitemap: `${Config.site}/sitemap.xml`,
  }
}
