'use client'

import {useCallback, useEffect, useRef} from 'react'

import {MOBILE_MIN_ZOOM} from '../const'
import {actionOnScroll, actionOnZoom, useCameraDispatch} from '../context'

type ToucheControlsProps = {
  speed: number
  friction: number
}

const touchDistance = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)

const touchMidpoint = (a: Touch, b: Touch) => ({
  x: (a.clientX + b.clientX) / 2,
  y: (a.clientY + b.clientY) / 2,
})

export const ToucheControls = ({friction, speed}: ToucheControlsProps) => {
  const dispatch = useCameraDispatch()

  const isDragging = useRef(false)
  const lastTouch = useRef<{x: number; y: number; time: number} | null>(null)
  const velocity = useRef<{x: number; y: number}>({x: 0, y: 0})
  const rafId = useRef<number | null>(null)

  const isPinching = useRef(false)
  const lastPinchDistance = useRef<number | null>(null)

  const startInertia = useCallback(() => {
    const step = () => {
      actionOnScroll(dispatch, {x: velocity.current.x, y: velocity.current.y})

      velocity.current.x *= friction
      velocity.current.y *= friction

      if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1) {
        rafId.current = requestAnimationFrame(step)
      } else {
        rafId.current = null
      }
    }

    if (rafId.current == null) {
      rafId.current = requestAnimationFrame(step)
    }
  }, [dispatch, friction])

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }

    // Two fingers: start a pinch and suspend panning.
    if (e.touches.length >= 2) {
      isPinching.current = true
      isDragging.current = false
      lastTouch.current = null
      lastPinchDistance.current = touchDistance(e.touches[0], e.touches[1])
      return
    }

    if (e.touches.length === 1) {
      isDragging.current = true
      const t = e.touches[0]
      lastTouch.current = {time: e.timeStamp, x: t.clientX, y: t.clientY}
    }
  }, [])

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      // Pinch: zoom directly toward the midpoint so it tracks the fingers 1:1
      // (a spring would feel laggy here). Mobile may zoom out below 100 %.
      if (isPinching.current && e.touches.length >= 2) {
        e.preventDefault()

        const distance = touchDistance(e.touches[0], e.touches[1])
        const last = lastPinchDistance.current

        if (last && distance > 0) {
          actionOnZoom(dispatch, {
            focal: touchMidpoint(e.touches[0], e.touches[1]),
            minScale: MOBILE_MIN_ZOOM,
            scaleBy: distance / last,
          })
        }

        lastPinchDistance.current = distance
        return
      }

      if (!isDragging.current || e.touches.length !== 1) {
        return
      }

      const t = e.touches[0]
      const last = lastTouch.current

      if (last) {
        const dt = e.timeStamp - last.time

        if (dt > 0) {
          const dx = (last.x - t.clientX) * speed
          const dy = (last.y - t.clientY) * speed

          actionOnScroll(dispatch, {x: dx, y: dy})

          velocity.current.x = dx / (dt / 16.67) // normalize to ~60fps
          velocity.current.y = dy / (dt / 16.67)
        }

        lastTouch.current = {time: e.timeStamp, x: t.clientX, y: t.clientY}
      }
    },
    [dispatch, speed]
  )

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (isPinching.current) {
        lastPinchDistance.current = null

        // Lifting one finger of a pinch: hand the remaining finger back to pan
        // without a jump; otherwise fully end the pinch.
        if (e.touches.length === 1) {
          const t = e.touches[0]
          isPinching.current = false
          isDragging.current = true
          velocity.current = {x: 0, y: 0}
          lastTouch.current = {time: e.timeStamp, x: t.clientX, y: t.clientY}
        } else if (e.touches.length === 0) {
          isPinching.current = false
          isDragging.current = false
          lastTouch.current = null
        }

        return
      }

      if (e.touches.length > 0) {
        return
      }

      isDragging.current = false
      lastTouch.current = null
      startInertia()
    },
    [startInertia]
  )

  useEffect(() => {
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current)
    }

    const controller = new AbortController()

    window.addEventListener('touchstart', onTouchStart, {passive: false, signal: controller.signal})
    window.addEventListener('touchmove', onTouchMove, {passive: false, signal: controller.signal})
    window.addEventListener('touchend', onTouchEnd, {passive: false, signal: controller.signal})
    window.addEventListener('touchcancel', onTouchEnd, {passive: false, signal: controller.signal})

    return () => {
      controller.abort()

      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [onTouchStart, onTouchMove, onTouchEnd])

  return null
}
