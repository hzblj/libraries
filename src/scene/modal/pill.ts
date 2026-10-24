import gsap from 'gsap'

const SLIDE = {duration: 0.7, ease: 'card-morph'}
const OUT = {duration: 0.17, ease: 'power2.in', opacity: 0, rotate: -90, scale: 0.5}
const IN_FROM = {opacity: 0, rotate: 90, scale: 0.5}
const IN_TO = {duration: 0.25, ease: 'power2.out', opacity: 1, rotate: 0, scale: 1}

const glyph = (pill: HTMLElement | null, name: 'expand' | 'collapse') =>
  pill?.querySelector<SVGElement>(`[data-glyph="${name}"]`) ?? null

export const turnGlyph = (
  timeline: gsap.core.Timeline,
  pill: HTMLElement | null,
  to: 'expand' | 'collapse',
  at = 0
) => {
  const from = to === 'collapse' ? 'expand' : 'collapse'

  timeline.to(glyph(pill, from), OUT, at).fromTo(glyph(pill, to), IN_FROM, {...IN_TO}, at + OUT.duration)
}

export const isDesktop = () => window.matchMedia('(min-width: 768px)').matches

export const pageAlignment = (pill: HTMLElement | null) => {
  if (!pill || isDesktop()) {
    return 0
  }

  const {left, width} = pill.getBoundingClientRect()

  return window.innerWidth / 2 - (left + width / 2)
}

export const alignPill = (timeline: gsap.core.Timeline, pill: HTMLElement | null, x: number) => {
  const current = pill ? Number(gsap.getProperty(pill, 'x')) : 0

  if (!pill || (x === 0 && current === 0)) {
    return
  }

  timeline.to(pill, {...SLIDE, clearProps: x === 0 ? 'transform' : '', x}, 0)
}
