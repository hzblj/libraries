import type {MetadataRoute} from 'next'

import {Config} from '@/config'

// One page: every library opens in place over the grid rather than at a URL of its own.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{changeFrequency: 'monthly', lastModified: new Date(), priority: 1, url: Config.site}]
}
