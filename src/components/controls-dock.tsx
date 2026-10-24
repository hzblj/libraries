'use client'

import {useControlFade} from '@/hooks'
import {useIntro} from '@/providers'

// Reveal the corner controls a beat after the intro hands off, so they arrive
// once the canvas cards have settled rather than competing with the entrance.
const REVEAL_DELAY = 0.8

/**
 * Fixed anchor the corner controls (sound, zoom, business details) portal into.
 * Lives outside the scaled canvas so it isn't affected by zoom, and stays hidden
 * until the intro animation completes.
 *
 * Hidden in the markup as well as by the fade: the reveal runs from an effect, so
 * without a resting state to render the dock would flash before it.
 */
export const ControlsDock = () => {
  const {introComplete} = useIntro()
  const ref = useControlFade(introComplete, {enterDelay: REVEAL_DELAY})

  return (
    <div ref={ref} className="invisible fixed left-6 top-6 z-50 flex items-center gap-2 opacity-0" id="controls-dock" />
  )
}
