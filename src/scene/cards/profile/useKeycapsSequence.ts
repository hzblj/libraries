import gsap from 'gsap'
import {useEffect, useState} from 'react'

export const KEYS = [
  {name: 'w', x: 9.5, y: 4},
  {name: 'a', x: 3, y: 10.5},
  {name: 's', x: 9.5, y: 10.5},
  {name: 'd', x: 16, y: 10.5},
] as const

const ORDER = ['w', 'd', 'a', 's'] as const

type KeyName = (typeof KEYS)[number]['name']

export const useKeycapsSequence = () => {
  const [keys] = useState<Record<KeyName, {opacity: number; scale: number}>>(() => ({
    a: {opacity: 0.2, scale: 1},
    d: {opacity: 0.2, scale: 1},
    s: {opacity: 0.2, scale: 1},
    w: {opacity: 0.2, scale: 1},
  }))

  useEffect(() => {
    const timeline = gsap.timeline({repeat: -1})

    for (const name of ORDER) {
      timeline
        .to(keys[name], {duration: 0.8, ease: 'power2.out', opacity: 0.8, scale: 0.8})
        .to(keys[name], {duration: 0.4})
        .to(keys[name], {duration: 0.3, ease: 'power2.inOut', opacity: 0.2, scale: 1})
    }

    timeline.to({}, {duration: 0.4})

    return () => {
      timeline.kill()
    }
  }, [keys])

  return keys
}
