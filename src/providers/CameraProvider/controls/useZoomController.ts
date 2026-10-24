'use client'

import {gsap} from 'gsap'
import {useCallback, useEffect, useRef} from 'react'

import {clampZoom, MIN_ZOOM} from '../const'
import {actionOnZoom, useCameraDispatch, useCameraState} from '../context'
import {CameraOffset} from '../context/types'

// Continuous inputs (wheel, pinch) glide to a moving target; discrete inputs
// (buttons, reset) get a springy overshoot so the motion feels alive.
const GLIDE = {duration: 0.4, ease: 'power3.out'} as const
const SPRING = {duration: 0.55, ease: 'back.out(1.7)'} as const

/**
 * Drives desktop zoom through GSAP so it matches the rest of the site's motion.
 * Inputs retarget a single proxy tween; every frame re-anchors the camera on
 * `focal`, keeping the point under the cursor fixed for the whole animation.
 */
export const useZoomController = (min: number = MIN_ZOOM) => {
  const dispatch = useCameraDispatch()
  const {scale} = useCameraState()

  const live = useRef(scale)
  const proxy = useRef({value: scale})
  const focal = useRef<CameraOffset>({x: 0, y: 0})

  useEffect(() => {
    live.current = scale
  }, [scale])

  const apply = useCallback(() => {
    actionOnZoom(dispatch, {focal: focal.current, scaleTo: proxy.current.value})
  }, [dispatch])

  useEffect(() => {
    const target = proxy.current
    return () => {
      gsap.killTweensOf(target)
    }
  }, [])

  // Re-baseline the proxy on the actually-rendered scale before a fresh gesture
  // so the tween never starts from a stale value after an idle period.
  const settle = useCallback(() => {
    if (!gsap.isTweening(proxy.current)) {
      proxy.current.value = live.current
    }
  }, [])

  const zoomBy = useCallback(
    (factor: number, at: CameraOffset) => {
      settle()
      focal.current = at
      gsap.to(proxy.current, {
        ...GLIDE,
        onUpdate: apply,
        overwrite: true,
        value: clampZoom(proxy.current.value * factor, min),
      })
    },
    [apply, min, settle]
  )

  const zoomTo = useCallback(
    (scaleTo: number, at: CameraOffset) => {
      settle()
      focal.current = at
      gsap.to(proxy.current, {
        ...SPRING,
        onUpdate: apply,
        overwrite: true,
        value: clampZoom(scaleTo, min),
      })
    },
    [apply, min, settle]
  )

  return {scale, zoomBy, zoomTo}
}
