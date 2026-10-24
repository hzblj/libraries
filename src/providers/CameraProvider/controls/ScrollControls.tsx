'use client'

import {useCallback, useEffect} from 'react'

import {actionOnScroll, useCameraDispatch} from '../context'

export const ScrollControls = () => {
  const dispatch = useCameraDispatch()

  const wheelHandler = useCallback(
    (e: WheelEvent) => {
      // Ctrl/Cmd + wheel (and trackpad pinch, which the browser reports as a
      // ctrl-wheel) is a zoom gesture handled by ZoomControls — leave it alone.
      if (e.ctrlKey || e.metaKey) {
        return
      }

      e.preventDefault()
      actionOnScroll(dispatch, {x: e.deltaX, y: e.deltaY})
    },
    [dispatch]
  )

  useEffect(() => {
    const controller = new AbortController()

    window.addEventListener('wheel', wheelHandler, {passive: false, signal: controller.signal})

    return () => {
      controller.abort()
    }
  }, [wheelHandler])

  return null
}
