'use client'

import gsap from 'gsap'
import {useCallback, useEffect, useRef, useState} from 'react'

import {Config} from '@/config'

export type ControlFadeOptions = {
  /** Held back on the way in, for a control that has to arrive after something else. */
  enterDelay?: number
}

/**
 * Fades a floating control in and out on the shared control curve, so the corner
 * dock, the pills inside it and the pill over an open modal all come and go the
 * same way — see `Config.controls`. Returns the ref to hand the element.
 *
 * `autoAlpha` rather than opacity alone: a control on its way out has to leave
 * hit-testing as well as the screen, and one that is merely transparent would
 * still swallow a click meant for the canvas underneath.
 *
 * The element arrives through a callback ref rather than one passed in, because
 * every one of these controls portals into the dock and so attaches a render
 * after it mounts — a ref object would still be empty on the first pass, and the
 * resting frame below would never be written.
 */
export const useControlFade = (visible: boolean, {enterDelay = 0}: ControlFadeOptions = {}) => {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const settled = useRef(false)

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element) {
      return
    }

    gsap.killTweensOf(element)

    const frame = visible ? {autoAlpha: 1, scale: 1} : {autoAlpha: 0, scale: Config.controls.scale}

    // The first pass lands on the resting frame instead of animating towards it:
    // a control mounts either already at rest, or hidden because the state it
    // reflects was restored from the session, and a restored state never moved.
    if (!settled.current) {
      settled.current = true
      gsap.set(element, frame)

      return
    }

    gsap.to(element, {
      ...frame,
      delay: visible ? enterDelay : 0,
      duration: visible ? Config.controls.enterDuration : Config.controls.exitDuration,
      ease: visible ? Config.controls.enterEase : Config.controls.exitEase,
    })
  }, [element, enterDelay, visible])

  return ref
}
