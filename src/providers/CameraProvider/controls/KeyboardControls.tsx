'use client'

import {useCallback, useEffect, useRef} from 'react'

import {actionOnScroll, useCameraDispatch} from '../context'

const ALLOWED_KEYS = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'])
const MOVE_SPEED = 10

export const KeyboardControls = () => {
  const dispatch = useCameraDispatch()

  const pressedKeys = useRef(new Set<string>())
  const animationFrameId = useRef<number | null>(null)

  const updateOffset = useCallback(() => {
    let dx = 0
    let dy = 0

    const pressed = pressedKeys.current

    if (pressed.has('w') || pressed.has('arrowup')) {
      dy = -MOVE_SPEED
    }

    if (pressed.has('s') || pressed.has('arrowdown')) {
      dy = MOVE_SPEED
    }

    if (pressed.has('a') || pressed.has('arrowleft')) {
      dx = -MOVE_SPEED
    }

    if (pressed.has('d') || pressed.has('arrowright')) {
      dx = MOVE_SPEED
    }

    actionOnScroll(dispatch, {x: dx, y: dy})

    if ([...pressed].some(key => ALLOWED_KEYS.has(key))) {
      animationFrameId.current = requestAnimationFrame(updateOffset)
    } else {
      animationFrameId.current = null
    }
  }, [dispatch])

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      // Arrow keys scroll the page natively — WASD doesn't — so suppress that.
      if (key.startsWith('arrow')) {
        e.preventDefault()
      }

      pressedKeys.current.add(key)

      if (ALLOWED_KEYS.has(key) && animationFrameId.current === null) {
        updateOffset()
      }
    },
    [updateOffset]
  )

  const keyUpHandler = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase()

    pressedKeys.current.delete(key)

    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    window.addEventListener('keydown', keyDownHandler, {signal: controller.signal})
    window.addEventListener('keyup', keyUpHandler, {signal: controller.signal})

    return () => {
      controller.abort()

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [keyDownHandler, keyUpHandler])

  return null
}
