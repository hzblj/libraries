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
  links: Config.links.map(hidden),
  subject: hiddenWords(Config.tagline.subject),
  tagline: hiddenWords(Config.tagline.prefix),
  wordmark: hidden(),
})

type Entrance = ReturnType<typeof createEntrance>

const allMotions = ({hints, links, subject, tagline, wordmark}: Entrance) => [
  wordmark,
  ...tagline,
  ...subject,
  ...links,
  ...hints.flat(),
]

// The wordmark first, then the tagline word by word, the links, and last the
// hints at the foot.
export const useProfileEntrance = () => {
  const {introComplete} = useIntro()
  const [entrance] = useState(createEntrance)

  useEffect(() => () => gsap.killTweensOf(allMotions(entrance)), [entrance])

  useEffect(() => {
    if (!introComplete) {
      return
    }

    const timeline = gsap
      .timeline({delay: 0.4})
      .to(entrance.wordmark, {...REVEAL, duration: 0.5}, 0)
      .to([...entrance.tagline, ...entrance.subject], {...REVEAL, duration: 0.5, stagger: 0.06}, 0.08)
      .to(entrance.links, {...REVEAL, duration: 0.5, stagger: 0.06}, 0.3)

    entrance.hints.forEach((motions, index) => {
      timeline.to(motions, {...REVEAL, duration: 0.6}, 0.2 + 0.03 * index)
    })

    return () => {
      timeline.kill()
    }
  }, [entrance, introComplete])

  return entrance
}
