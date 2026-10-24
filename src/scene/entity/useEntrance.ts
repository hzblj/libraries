import gsap from 'gsap'
import {useEffect, useState} from 'react'

import type {AnimationConfig} from '@/db'
import {useIntro} from '@/providers/IntroProvider'

import {useMotion} from './useMotion'

const AT_REST = {opacity: 1, scale: 1, x: 0, y: 0}

export const parseOrigin = (origin?: string): [number, number] => {
  let x = 0
  let y = 0

  for (const word of origin?.split(' ') ?? []) {
    if (word === 'left' || word === 'right') {
      x = word === 'left' ? -1 : 1
    } else if (word === 'top' || word === 'bottom') {
      y = word === 'top' ? -1 : 1
    }
  }

  return [x, y]
}

export const useEntrance = (animation?: AnimationConfig) => {
  const {introComplete} = useIntro()
  const [skip] = useState(introComplete)
  const enter = useMotion(!skip && animation ? animation.from : AT_REST)

  useEffect(() => {
    if (skip || !introComplete || !animation) {
      return
    }

    const {delay, duration, ease, opacity, scale, x, y} = animation.to
    const tween = gsap.to(enter, {delay, duration, ease, opacity, scale, x, y})

    return () => {
      tween.kill()
    }
  }, [animation, enter, introComplete, skip])

  return enter
}
