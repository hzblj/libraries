'use client'

import gsap from 'gsap'
import {ScrollSmoother} from 'gsap/ScrollSmoother'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {type FC, type ReactNode, useLayoutEffect, useRef} from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

export type SmoothScrollProps = {
  children: ReactNode
}

/**
 * Wraps a page in GSAP's ScrollSmoother.
 *
 * Two things it needs that this site does not hand over for free. It drives the
 * *document* scroll, and html/body are locked shut for the camera on `/` — hence
 * `data-smooth-scroll`, which the stylesheet keys off to give the document back.
 * And it moves its content with a transform, so anything `position: fixed`
 * inside would ride along with the scroll: backgrounds and pinned controls
 * belong outside this component, not in its children.
 */
export const SmoothScroll: FC<SmoothScrollProps> = ({children}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!wrapperRef.current || !contentRef.current) {
      return
    }

    // Smoothing is momentum the visitor did not ask for; if they have asked for
    // less motion, the native scroll is the honest answer.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const smoother = ScrollSmoother.create({
      content: contentRef.current,
      // Takes touch and wheel over from the browser, which also settles the
      // `touch-action` lock this site puts on the document.
      normalizeScroll: true,
      smooth: 1,
      smoothTouch: 0.1,
      wrapper: wrapperRef.current,
    })

    return () => {
      smoother.kill()
    }
  }, [])

  return (
    <div ref={wrapperRef} data-smooth-scroll="true">
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
