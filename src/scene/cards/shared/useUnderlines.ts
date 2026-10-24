import gsap from 'gsap'
import {useEffect, useState} from 'react'

type Underline = {
  motion: {width: number}
  enter: () => void
  leave: () => void
}

const createUnderline = (): Underline => {
  const motion = {width: 0}

  return {
    enter: () => {
      gsap.killTweensOf(motion)
      gsap.to(motion, {delay: 0.15, duration: 0.4, ease: 'power3.out', width: 1})
    },
    leave: () => {
      gsap.killTweensOf(motion)
      gsap.to(motion, {duration: 0.2, ease: 'power3.in', width: 0})
    },
    motion,
  }
}

export const useUnderlines = (count: number) => {
  const [underlines] = useState(() => Array.from({length: count}, createUnderline))

  useEffect(() => () => gsap.killTweensOf(underlines.map(underline => underline.motion)), [underlines])

  return underlines
}
