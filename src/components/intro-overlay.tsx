'use client'

import {createRef, type RefObject, useEffect, useLayoutEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom'

import {useIntro} from '@/providers'

type TargetRect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>

export type IntroOverlayProps = {
  getTargetRect: () => TargetRect | null
}

type IntroParts = {
  overlay: RefObject<HTMLDivElement | null>
  card: RefObject<HTMLDivElement | null>
  ring: RefObject<HTMLDivElement | null>
  fill: RefObject<HTMLDivElement | null>
}

const IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'
const OUT = 'cubic-bezier(0.5, 1, 0.89, 1)'

const LINE = 500
const OPEN = 300
const FADE = 400
const CARD_FADE = 300
const HAND_OVER = LINE + OPEN - 200
const RADIUS = 16
const BORDER = 1

const inset = (y: number, x: number, radius: number) => `inset(${y}px ${x}px round ${radius}px)`

const playReveal = ({overlay, card, ring, fill}: IntroParts, rect: TargetRect) => {
  const line = (rect.height - BORDER * 2) / 2
  const opensAt = LINE / (LINE + OPEN)
  const timing = {duration: LINE + OPEN, fill: 'both'} as const
  const after = {delay: LINE + OPEN, fill: 'forwards'} as const
  const played: Animation[] = []

  const play = (element: HTMLElement | null, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = element?.animate(keyframes, options)

    if (animation) {
      played.push(animation)
    }

    return animation
  }

  const reveal = (by: number, radius: number): Keyframe[] => [
    {clipPath: inset(line + by, rect.width / 2 + by, radius), easing: IN_OUT, offset: 0},
    {clipPath: inset(line + by, by, radius), easing: IN_OUT, offset: opensAt},
    {clipPath: inset(by, by, radius), offset: 1},
  ]

  play(ring.current, reveal(0, RADIUS), timing)
  play(fill.current, reveal(BORDER, RADIUS - BORDER), timing)
  play(card.current, [{opacity: 1}, {opacity: 0}], {...after, duration: CARD_FADE, easing: OUT})

  const fade = play(overlay.current, [{opacity: 1}, {opacity: 0}], {...after, duration: FADE, easing: OUT})

  return {fade, played}
}

const createParts = (): IntroParts => ({
  card: createRef<HTMLDivElement>(),
  fill: createRef<HTMLDivElement>(),
  overlay: createRef<HTMLDivElement>(),
  ring: createRef<HTMLDivElement>(),
})

const useIntroReveal = (getTargetRect: IntroOverlayProps['getTargetRect']) => {
  const {introComplete, setIntroComplete} = useIntro()
  const [mounted, setMounted] = useState(false)
  const [rect, setRect] = useState<TargetRect | null>(null)
  const [parts] = useState(createParts)
  // Read once, on the first render of this mount: `introComplete` flips to true
  // at the end of the reveal, and reacting to that would be reading our own
  // output. What matters is whether the session had already seen it.
  const alreadySeenRef = useRef(introComplete)

  useLayoutEffect(() => {
    if (alreadySeenRef.current) {
      return
    }

    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || rect) {
      return
    }

    let frame = 0

    const measure = () => {
      const target = getTargetRect()

      if (target) {
        setRect(target)
      } else {
        frame = requestAnimationFrame(measure)
      }
    }

    frame = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [getTargetRect, mounted, rect])

  useLayoutEffect(() => {
    if (!rect) {
      return
    }

    const {fade, played} = playReveal(parts, rect)
    const handOver = window.setTimeout(() => setIntroComplete(true), HAND_OVER)
    let finished = false

    fade?.finished.then(
      () => {
        finished = true
        setMounted(false)
      },
      () => undefined
    )

    return () => {
      window.clearTimeout(handOver)

      if (!finished) {
        for (const animation of played) {
          animation.cancel()
        }
      }
    }
  }, [parts, rect, setIntroComplete])

  return {mounted, parts, rect}
}

export const IntroOverlay = ({getTargetRect}: IntroOverlayProps) => {
  const {mounted, parts, rect} = useIntroReveal(getTargetRect)

  if (!mounted) {
    return null
  }

  const portalRoot = typeof document !== 'undefined' ? document.getElementById('main') : null

  if (!portalRoot) {
    return null
  }

  return ReactDOM.createPortal(
    <div ref={parts.overlay} className="pointer-events-none fixed inset-0 z-50 bg-black">
      {rect && (
        <div
          ref={parts.card}
          className="fixed"
          style={{height: rect.height, left: rect.left, top: rect.top, width: rect.width}}
        >
          <div ref={parts.ring} className="absolute inset-0 bg-white/15 will-change-[clip-path]" />
          <div
            ref={parts.fill}
            className="absolute inset-0 bg-black will-change-[clip-path]"
            style={{backgroundImage: 'var(--card-bg)'}}
          />
        </div>
      )}
    </div>,
    portalRoot
  )
}
