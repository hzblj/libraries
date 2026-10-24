'use client'

import Link from 'next/link'
import {type MouseEvent, useCallback, useEffect, useMemo, useState} from 'react'
import {createPortal} from 'react-dom'

import {ico} from '@/db'
import {useAdaptiveGlass, useControlFade} from '@/hooks'
// Straight from the module rather than `@/providers`: the camera renders this
// control, so going through the barrel would import it back into itself.
import {useCameraState} from '@/providers/CameraProvider/context'
import {useViewTransitionNavigate} from '@/providers/NavigationProvider'
import {callAll} from '@/utils'

import {ControlTooltip} from './control-tooltip'

// A business card rather than a document or a badge: the page on the other end is
// one, and the two lines read as a label and the number under it.
const IconBusinessCard = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
    <path d="M7 10.5h4" />
    <path d="M7 14.5h10" />
  </svg>
)

/**
 * The business details, one pill along from the sound and zoom controls. No card
 * on the grid expands into /ico — it is registry data rather than work — so the
 * dock is where it can sit without pretending to be a card, and it stops the page
 * being reachable only from an invoice.
 *
 * Leaves with the zoom controls whenever a modal opens: corner chrome floating
 * over an open card is the one thing the dock should never be.
 *
 * A real anchor, so the route stays crawlable and middle-clickable; the click
 * handler only takes over to wrap the push in the same forward view transition
 * every other page is entered through.
 */
export const IcoLink = () => {
  const navigate = useViewTransitionNavigate()
  const {isModalOpen} = useCameraState()
  const fade = useControlFade(!isModalOpen)
  const glass = useAdaptiveGlass()
  const ref = useMemo(() => callAll(fade, glass), [fade, glass])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // New tab, new window, download — leave those to the browser.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
      }

      event.preventDefault()
      navigate({direction: 'forward', to: '/ico'})
    },
    [navigate]
  )

  if (!mounted) {
    return null
  }

  const dock = document.getElementById('controls-dock') ?? document.body

  return createPortal(
    // Pointer and wheel events stop here: the pill sits over the canvas, and the
    // camera would otherwise read a press on it as the start of a pan.
    <div
      ref={ref}
      className="glass order-3 flex select-none items-center rounded-full p-1 backdrop-blur-xl"
      onPointerDown={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
    >
      {/* No `title`: the native tooltip would turn up a beat later, under this
          one, saying the same thing in the browser's own chrome. */}
      <ControlTooltip label="Business details">
        <Link
          aria-label={`Business details — IČO ${ico.ico}`}
          className="glass-hover flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
          href="/ico"
          onClick={handleClick}
        >
          <IconBusinessCard />
        </Link>
      </ControlTooltip>
    </div>,
    dock
  )
}
