'use client'

import gsap from 'gsap'
import {type FC, type PointerEvent, type ReactNode, useCallback, useEffect, useRef} from 'react'

import {Config} from '@/config'
import {useHasHover} from '@/hooks'
import {cn} from '@/utils'

// How far the label travels on its way in, and how long a pointer has to rest on
// the control before it is asking what the control does rather than passing over
// it on the way somewhere else.
const OFFSET = -6
const HOVER_INTENT = 0.18

// How close a centred label may come to the edge of the window before it is
// nudged back in. The dock sits in the corner, so the first control in it is
// always narrower than the words underneath it.
const MARGIN = 8

/** How far a centred label has to move to clear both edges of the window. */
const clampToViewport = (element: HTMLElement) => {
  gsap.set(element, {x: 0})

  const {left, right} = element.getBoundingClientRect()

  if (left < MARGIN) {
    return MARGIN - left
  }

  const overshoot = right - (window.innerWidth - MARGIN)

  return overshoot > 0 ? -overshoot : 0
}

export type ControlTooltipProps = {
  /** The control the label belongs to. */
  children: ReactNode
  /** What the control does, in as few words as it takes. */
  label: string
  className?: string
}

/**
 * The label under a dock control. Icons in a corner say what they are at best,
 * never what they do, and the dock is the one place on the site with no copy
 * around to explain them.
 *
 * Rides the shared control curve — see `Config.controls` — so it belongs to the
 * same family as the pill it hangs off. `aria-hidden`, because the control it
 * wraps already carries the same sentence as its accessible name; a screen
 * reader should hear it once, not twice.
 *
 * Nothing of it reaches a touch device. Hover there is a tap that sticks, and a
 * label left hanging over the canvas until the next tap elsewhere is worse than
 * no label at all — so on a pointer that cannot hover it is never rendered.
 */
export const ControlTooltip: FC<ControlTooltipProps> = ({children, label, className}) => {
  const hasHover = useHasHover()
  const ref = useRef<HTMLSpanElement>(null)

  // Centred on the control by GSAP rather than by a class: the show and hide
  // tweens write the whole transform, and a translate in the markup would be the
  // first thing they overwrote. Sets the offset it slides in from at the same
  // time, while the label is still hidden and nothing of it can be seen moving.
  //
  // Waits on `hasHover`, which only turns true a render in: before that there is
  // no label in the tree to place.
  useEffect(() => {
    if (!hasHover) {
      return
    }

    gsap.set(ref.current, {xPercent: -50, y: OFFSET})
  }, [hasHover])

  const show = useCallback(() => {
    const element = ref.current

    if (!element) {
      return
    }

    gsap.killTweensOf(element)
    gsap.to(element, {
      autoAlpha: 1,
      delay: HOVER_INTENT,
      duration: Config.controls.enterDuration,
      ease: Config.controls.enterEase,
      // Measured on the way in rather than once on mount: the label is centred on
      // a control that moves with the window, and the words themselves change.
      x: clampToViewport(element),
      y: 0,
    })
  }, [])

  const hide = useCallback(() => {
    gsap.killTweensOf(ref.current)
    gsap.to(ref.current, {
      autoAlpha: 0,
      duration: Config.controls.exitDuration,
      ease: Config.controls.exitEase,
      y: OFFSET,
    })
  }, [])

  const handleEnter = useCallback(
    (event: PointerEvent) => {
      // A stylus or a mouse plugged into a tablet gets one anyway; a finger on
      // the same screen does not.
      if (event.pointerType !== 'mouse') {
        return
      }

      show()
    },
    [show]
  )

  if (!hasHover) {
    return children
  }

  return (
    // Focus as well as hover: the dock is reachable by keyboard, and an icon
    // with no label is no clearer for having been tabbed to.
    <div
      className={cn('relative flex items-center', className)}
      onBlur={hide}
      onFocus={show}
      onPointerEnter={handleEnter}
      onPointerLeave={hide}
    >
      {children}
      <span
        ref={ref}
        aria-hidden="true"
        className="invisible pointer-events-none absolute left-1/2 top-full mt-2 whitespace-nowrap rounded-full border border-white/12 bg-black/55 px-2.5 py-1 text-[12px] leading-[18px] text-white/85 opacity-0 backdrop-blur-xl"
      >
        {label}
      </span>
    </div>
  )
}
