'use client'

import {useEffect, useMemo, useState} from 'react'
import {createPortal} from 'react-dom'

import {useAdaptiveGlass, useControlFade} from '@/hooks'
// Straight from the modules rather than `@/providers`: the camera renders this
// control, so going through the barrel would import it back into itself.
import {useCameraState} from '@/providers/CameraProvider/context'
import {useSoundContext} from '@/providers/SoundProvider'
import {callAll} from '@/utils'

import {ControlTooltip} from './control-tooltip'

const IconSound = () => (
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
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
)

const IconMuted = () => (
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
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <line x1="23" x2="17" y1="9" y2="15" />
    <line x1="17" x2="23" y1="9" y2="15" />
  </svg>
)

/**
 * Mutes the interface sounds, from the first pill in the corner dock.
 *
 * Leaves with the zoom and business-details pills whenever a modal opens, and
 * comes back with its close: an open card is the whole screen on a phone, and
 * corner chrome floating over it is the one thing the dock should never be. It
 * stays mounted while it is gone so it can fade on the shared control curve
 * rather than blinking out of the dock — and so the sounds it governs are never
 * unreachable, only out of the way.
 */
export const SoundControls = () => {
  const {isMuted, toggleMuted} = useSoundContext()
  const {isModalOpen} = useCameraState()
  const fade = useControlFade(!isModalOpen)
  const glass = useAdaptiveGlass()
  const ref = useMemo(() => callAll(fade, glass), [fade, glass])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const dock = document.getElementById('controls-dock') ?? document.body

  return createPortal(
    <div
      ref={ref}
      className="glass order-1 flex select-none items-center rounded-full p-1 backdrop-blur-xl"
      onPointerDown={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
    >
      <ControlTooltip label={isMuted ? 'Unmute sounds' : 'Mute sounds'}>
        <button
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          aria-pressed={isMuted}
          className="glass-hover flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
          onClick={toggleMuted}
          type="button"
        >
          {isMuted ? <IconMuted /> : <IconSound />}
        </button>
      </ControlTooltip>
    </div>,
    dock
  )
}
