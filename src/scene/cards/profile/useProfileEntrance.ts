import gsap from 'gsap'
import {useEffect, useState} from 'react'

import {Config} from '@/config'
import {useIntro} from '@/providers/IntroProvider'

import {type Motion, splitWords} from '../../entity'
import {HINTS} from './styles'

const HIDDEN = {blur: 6, opacity: 0, y: 10}
const REVEAL = {blur: 0, ease: 'quart.out', opacity: 1, y: 0}

const hidden = (): Motion => ({...HIDDEN})

const hiddenWords = (text: string) => splitWords(text).map(hidden)

const createEntrance = () => ({
  hints: HINTS.map(hint => (hint.kind === 'text' ? hiddenWords(hint.text) : [hidden()])),
  name: hiddenWords(Config.handle),
  subject: hiddenWords(Config.tagline.subject),
  tagline: hiddenWords(Config.tagline.prefix),
})

const allMotions = ({hints, name, subject, tagline}: ReturnType<typeof createEntrance>) => [
  ...name,
  ...tagline,
  ...subject,
  ...hints.flat(),
]

export const useProfileEntrance = () => {
  const {introComplete} = useIntro()
  const [entrance] = useState(createEntrance)

  useEffect(() => () => gsap.killTweensOf(allMotions(entrance)), [entrance])

  useEffect(() => {
    if (!introComplete) {
      return
    }

    const timeline = gsap
      .timeline()
      .to(
        [...entrance.name, ...entrance.tagline, ...entrance.subject],
        {...REVEAL, delay: 0.4, duration: 0.5, stagger: 0.06},
        0
      )

    entrance.hints.forEach((motions, index) => {
      timeline.to(motions, {...REVEAL, delay: 0.6, duration: 0.6}, 0.03 * index)
    })

    return () => {
      timeline.kill()
    }
  }, [entrance, introComplete])

  return entrance
}
