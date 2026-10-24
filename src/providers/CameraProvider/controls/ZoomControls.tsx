'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {createPortal} from 'react-dom'

import {useAdaptiveGlass, useControlFade} from '@/hooks'
import {callAll, cn} from '@/utils'

import {MAX_ZOOM, MIN_ZOOM, stepZoom, WHEEL_NOTCH_THRESHOLD, ZOOM_TRACKPAD_SENSITIVITY, ZOOM_WHEEL_STEP} from '../const'
import {useCameraState} from '../context'
import {useZoomController} from './useZoomController'

// Compared with an epsilon so floating-point drift near the bounds doesn't
// leave a button subtly enabled when it should be off.
const EPSILON = 0.01

// Safari fires trackpad-pinch as its own non-standard gesture events carrying a
// cumulative `scale`, rather than the ctrl-wheel other browsers emit.
type GestureLikeEvent = Event & {scale?: number}

const screenCenter = () => ({x: window.innerWidth / 2, y: window.innerHeight / 2})

export const ZoomControls = () => {
  const {scale, zoomBy, zoomTo} = useZoomController(MIN_ZOOM)
  const {isModalOpen} = useCameraState()

  // Out with an opening modal, back with its close. The pill stays mounted while
  // it is gone so it can fade on the shared control curve instead of blinking
  // out of the dock — the gestures below come off either way.
  const fade = useControlFade(!isModalOpen)
  const glass = useAdaptiveGlass()
  const ref = useMemo(() => callAll(fade, glass), [fade, glass])

  const [mounted, setMounted] = useState(false)
  const pointer = useRef({x: 0, y: 0})
  const gestureScale = useRef(1)

  useEffect(() => {
    pointer.current = screenCenter()
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      return
    }

    const controller = new AbortController()
    const {signal} = controller

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        return
      }

      e.preventDefault()

      // Discrete mouse notch → fixed step; trackpad pinch → proportional.
      const magnitude = Math.abs(e.deltaY)
      const exponent =
        magnitude >= WHEEL_NOTCH_THRESHOLD
          ? Math.sign(e.deltaY) * ZOOM_WHEEL_STEP
          : e.deltaY * ZOOM_TRACKPAD_SENSITIVITY

      zoomBy(Math.exp(-exponent), {x: e.clientX, y: e.clientY})
    }

    const onPointerMove = (e: PointerEvent) => {
      pointer.current = {x: e.clientX, y: e.clientY}
    }

    const onGestureStart = (e: Event) => {
      e.preventDefault()
      gestureScale.current = (e as GestureLikeEvent).scale ?? 1
    }

    const onGestureChange = (e: Event) => {
      e.preventDefault()

      const next = (e as GestureLikeEvent).scale ?? 1
      const factor = gestureScale.current ? next / gestureScale.current : 1
      gestureScale.current = next

      zoomBy(factor, pointer.current)
    }

    const onGestureEnd = (e: Event) => {
      e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, {passive: false, signal})
    window.addEventListener('pointermove', onPointerMove, {passive: true, signal})
    window.addEventListener('gesturestart', onGestureStart, {passive: false, signal})
    window.addEventListener('gesturechange', onGestureChange, {passive: false, signal})
    window.addEventListener('gestureend', onGestureEnd, {passive: false, signal})

    return () => {
      controller.abort()
    }
  }, [isModalOpen, zoomBy])

  if (!mounted) {
    return null
  }

  const canZoomIn = scale < MAX_ZOOM - EPSILON
  const canZoomOut = scale > MIN_ZOOM + EPSILON

  const dock = document.getElementById('controls-dock') ?? document.body

  return createPortal(
    <div
      ref={ref}
      className="glass order-2 flex select-none items-center gap-1 rounded-full p-1 backdrop-blur-xl"
      onPointerDown={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
    >
      <button
        aria-label="Zoom out"
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition-colors',
          canZoomOut ? 'glass-hover cursor-pointer' : 'cursor-not-allowed opacity-30'
        )}
        disabled={!canZoomOut}
        onClick={() => zoomTo(stepZoom(scale, -1), screenCenter())}
        type="button"
      >
        −
      </button>

      <button
        aria-label="Reset zoom"
        className={cn(
          'min-w-[3.25rem] rounded-full px-2 text-center text-sm tabular-nums transition-colors',
          canZoomOut ? 'glass-hover cursor-pointer' : 'cursor-default opacity-60'
        )}
        disabled={!canZoomOut}
        onClick={() => zoomTo(MIN_ZOOM, screenCenter())}
        type="button"
      >
        {Math.round(scale * 100)}%
      </button>

      <button
        aria-label="Zoom in"
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition-colors',
          canZoomIn ? 'glass-hover cursor-pointer' : 'cursor-not-allowed opacity-30'
        )}
        disabled={!canZoomIn}
        onClick={() => zoomTo(stepZoom(scale, 1), screenCenter())}
        type="button"
      >
        +
      </button>
    </div>,
    dock
  )
}
