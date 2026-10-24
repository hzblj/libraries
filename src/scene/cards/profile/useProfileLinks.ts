import gsap from 'gsap'
import {useEffect, useMemo, useState} from 'react'

import {Config} from '@/config'

import {openExternal} from '../../interaction'
import {useUnderlines} from '../shared'
import {LINKS_TOP, PILL, TAGLINE_LINE, TAGLINE_TOP} from './styles'

const SPRING = 'back.out(2)'
const ARROW_REST = {opacity: 0.5, x: -2, y: 2}

const stillMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Pill = {x: number; width: number; labelX: number}

// The tagline's subject underlines itself like every link on the grid; each
// pill brightens under the pointer and sends its arrow out.
export const useProfileLinks = (pills: readonly Pill[], subjectX: number, subjectWidth: number) => {
  const [underline] = useUnderlines(1)
  const [hovers] = useState(() => Config.links.map(() => ({arrow: {...ARROW_REST}, fill: {opacity: 0}})))

  useEffect(() => () => gsap.killTweensOf(hovers.flatMap(({arrow, fill}) => [arrow, fill])), [hovers])

  return useMemo(() => {
    const subject = {height: TAGLINE_LINE, width: subjectWidth, x: subjectX, y: TAGLINE_TOP}
    const rects = pills.map(({x, width}) => ({height: PILL.height, width, x, y: LINKS_TOP}))

    const enter = (index: number) => {
      const {arrow, fill} = hovers[index]
      const still = stillMotion()
      gsap.killTweensOf([arrow, fill])
      gsap.to(fill, {duration: 0.25, ease: 'power2.out', opacity: 1})
      gsap.to(arrow, {duration: still ? 0.25 : 0.45, ease: still ? 'power2.out' : SPRING, opacity: 1, x: 0, y: 0})
    }

    const leave = (index: number) => {
      const {arrow, fill} = hovers[index]
      gsap.killTweensOf([arrow, fill])
      gsap.to(fill, {duration: 0.3, ease: 'power2.out', opacity: 0})
      gsap.to(arrow, {...ARROW_REST, duration: 0.3, ease: 'power2.out'})
    }

    return {
      hotspots: [
        {
          onClick: () => openExternal(Config.tagline.href),
          onEnter: underline.enter,
          onLeave: underline.leave,
          rect: subject,
        },
        ...Config.links.map(({url}, index) => ({
          onClick: () => openExternal(url),
          onEnter: () => enter(index),
          onLeave: () => leave(index),
          rect: rects[index],
        })),
      ],
      hovers,
      rects,
      subject: {
        link: subject,
        motion: underline.motion,
        underline: {height: 1.5, width: subjectWidth, x: subjectX, y: TAGLINE_TOP + TAGLINE_LINE},
      },
    }
  }, [hovers, pills, subjectWidth, subjectX, underline])
}
