import gsap from 'gsap'
import {useEffect, useMemo, useState} from 'react'

import type {EntryExample} from '@/db'
import {useIntro} from '@/providers/IntroProvider'

import {openExternal, useHotspots} from '../../interaction'
import {ARROW_OPACITY, INSET, ROW, ROW_GAP, TITLE_OPACITY, TOP, WIDTH} from './styles'

const SPRING = 'back.out(2)'

const createRow = () => ({
  arrow: {opacity: ARROW_OPACITY, x: -3, y: 3},
  // Every row comes in once the intro is over, one after another down the list.
  entrance: {blur: 4, opacity: 0, y: 6},
  highlight: {opacity: 0},
  icon: {scale: 1},
  name: {opacity: TITLE_OPACITY},
})

export type ExampleRowMotion = ReturnType<typeof createRow>

const stillMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const enter = ({arrow, highlight, icon, name}: ExampleRowMotion) => {
  const still = stillMotion()
  gsap.killTweensOf([arrow, highlight, icon, name])
  gsap.to(highlight, {duration: 0.25, ease: 'power2.out', opacity: 1})
  gsap.to(name, {duration: 0.25, ease: 'power2.out', opacity: 1})
  gsap.to(arrow, {duration: still ? 0.25 : 0.45, ease: still ? 'power2.out' : SPRING, opacity: 1, x: 0, y: 0})
  gsap.to(icon, {duration: still ? 0 : 0.45, ease: SPRING, scale: still ? 1 : 1.08})
}

const leave = ({arrow, highlight, icon, name}: ExampleRowMotion) => {
  gsap.killTweensOf([arrow, highlight, icon, name])
  gsap.to(highlight, {duration: 0.3, ease: 'power2.out', opacity: 0})
  gsap.to(name, {duration: 0.3, ease: 'power2.out', opacity: TITLE_OPACITY})
  gsap.to(arrow, {duration: 0.3, ease: 'power2.out', opacity: ARROW_OPACITY, x: -3, y: 3})
  gsap.to(icon, {duration: 0.35, ease: 'power2.out', scale: 1})
}

export const useExampleRows = (examples: readonly EntryExample[]) => {
  const {introComplete} = useIntro()
  const [motions] = useState(() => examples.map(createRow))

  const rows = useMemo(
    () =>
      examples.map((_, index) => ({
        height: ROW - ROW_GAP,
        width: WIDTH - INSET * 2,
        x: INSET,
        y: TOP + index * ROW + ROW_GAP / 2,
      })),
    [examples]
  )

  useEffect(() => () => gsap.killTweensOf(motions.flatMap(motion => Object.values(motion))), [motions])

  useEffect(() => {
    if (!introComplete) {
      return
    }

    const tween = gsap.to(
      motions.map(motion => motion.entrance),
      {blur: 0, delay: 0.5, duration: 0.6, ease: 'quart.out', opacity: 1, stagger: 0.035, y: 0}
    )

    return () => {
      tween.kill()
    }
  }, [introComplete, motions])

  const hotspots = useMemo(
    () =>
      examples.map(({url}, index) => ({
        onClick: () => openExternal(url),
        onEnter: () => enter(motions[index]),
        onLeave: () => leave(motions[index]),
        rect: rows[index],
      })),
    [examples, motions, rows]
  )

  return {motions, pointer: useHotspots(hotspots), rows}
}
