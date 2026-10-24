import {sendGAEvent} from '@next/third-parties/google'

// The site's GA4 property. A measurement ID is public, it is in every page's
// source, so it lives here; the environment can still point a build elsewhere.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-VKC9021KN1'

// Production deployments only: not `next dev`, and not Vercel's previews, which
// are production builds too but would count every review as a visit.
export const isAnalyticsEnabled = (): boolean =>
  process.env.NODE_ENV === 'production' && (process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'production') === 'production'

export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  label?: string
  attribution?: Record<string, unknown>
}

export interface GAEvent {
  action: string
  category?: string
  label?: string
  value?: number
  custom_parameters?: Record<string, unknown>
}

export function reportWebVitals(metric: WebVitalsMetric): void {
  if (!isAnalyticsEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      // biome-ignore lint/suspicious/noConsole: intentional dev-only diagnostic
      console.info('Web Vitals (dev):', metric)
    }
    return
  }

  const webVitals = ['FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'INP']

  if (!webVitals.includes(metric.name)) {
    return
  }

  const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value)

  sendGAEvent({
    custom_parameters: metric.attribution || {},
    event_category: 'Web Vitals',
    event_label: metric.name,
    event_name: 'web_vitals',
    metric_delta: metric.delta,
    metric_id: metric.id,
    metric_rating: metric.rating,
    value: value,
  })
}

export function trackProjectView(projectTitle: string): void {
  if (!isAnalyticsEnabled()) {
    return
  }
  sendGAEvent({
    event_name: 'view_project',
    project_title: projectTitle,
  })
}

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void
  }
}
