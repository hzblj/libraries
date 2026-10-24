'use client'

import {useCallback, useEffect, useRef} from 'react'
import {actionOnScroll, useCameraDispatch} from '../context'

export type DragControlsProps = {
  scaleX?: number
  scaleY?: number
  inertia?: boolean
  damping?: number
  restSpeed?: number
  maxSpeed?: number
  clickThreshold?: number
  suppressClickOnDrag?: boolean
}

export const DragControls = ({
  scaleX = 1,
  scaleY = 1,
  inertia = true,
  damping = 0.92,
  restSpeed = 0.05,
  maxSpeed = 3.0,
  clickThreshold = 4,
  suppressClickOnDrag = true,
}: DragControlsProps = {}) => {
  const dispatch = useCameraDispatch()

  const dragging = useRef(false)
  const pointerId = useRef<number | null>(null)
  const lastX = useRef(0)
  const lastY = useRef(0)
  const startX = useRef(0)
  const startY = useRef(0)
  const lastT = useRef(0)

  const accX = useRef(0)
  const accY = useRef(0)
  const raf = useRef<number | null>(null)

  const vx = useRef(0)
  const vy = useRef(0)
  const inertiaRaf = useRef<number | null>(null)

  const showDragging = useCallback(() => {
    document.documentElement.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
    ;(document.body.style as any).touchAction = 'none'
  }, [])

  const resetDragging = useCallback(() => {
    document.documentElement.style.cursor = ''
    document.body.style.userSelect = ''
    ;(document.body.style as any).touchAction = ''
  }, [])

  const flush = useCallback(() => {
    raf.current = null
    const dx = accX.current
    const dy = accY.current
    if (dx !== 0 || dy !== 0) {
      actionOnScroll(dispatch, {x: dx, y: dy})
      accX.current = 0
      accY.current = 0
    }
  }, [dispatch])

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (dragging.current || !e.isPrimary) {
        return
      }

      if (e.pointerType === 'mouse' && e.button !== 0) {
        return
      }

      if (inertiaRaf.current != null) {
        cancelAnimationFrame(inertiaRaf.current)
        inertiaRaf.current = null
      }

      vx.current = 0
      vy.current = 0

      dragging.current = true
      pointerId.current = e.pointerId
      lastX.current = e.clientX
      lastY.current = e.clientY
      startX.current = e.clientX
      startY.current = e.clientY
      lastT.current = performance.now()

      e.preventDefault()
      showDragging()
    },
    [showDragging]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current || pointerId.current !== e.pointerId) {
        return
      }

      e.preventDefault()

      const now = performance.now()
      const dt = Math.max(1, now - lastT.current)

      const dxRaw = e.clientX - lastX.current
      const dyRaw = e.clientY - lastY.current

      lastX.current = e.clientX
      lastY.current = e.clientY
      lastT.current = now

      const dx = -dxRaw * scaleX
      const dy = -dyRaw * scaleY

      accX.current += dx
      accY.current += dy

      if (raf.current == null) {
        raf.current = requestAnimationFrame(flush)
      }

      const instVx = dxRaw / dt
      const instVy = dyRaw / dt

      const clamp = (v: number) => Math.max(-maxSpeed, Math.min(maxSpeed, v))

      vx.current = clamp(vx.current * 0.8 + instVx * 0.2)
      vy.current = clamp(vy.current * 0.8 + instVy * 0.2)
    },
    [flush, scaleX, scaleY, maxSpeed]
  )

  const blockNextClick = useCallback(() => {
    const handler = (ev: MouseEvent) => {
      ev.stopPropagation()
      ev.preventDefault()
      document.removeEventListener('click', handler, true)
    }
    document.addEventListener('click', handler, true)
  }, [])

  const endDrag = useCallback(() => {
    if (!dragging.current) {
      return
    }

    const totalDx = lastX.current - startX.current
    const totalDy = lastY.current - startY.current
    const movedFar = Math.abs(totalDx) > clickThreshold || Math.abs(totalDy) > clickThreshold

    dragging.current = false
    pointerId.current = null

    if (raf.current != null) {
      cancelAnimationFrame(raf.current)
      raf.current = null
    }

    if (accX.current || accY.current) {
      actionOnScroll(dispatch, {x: accX.current, y: accY.current})
      accX.current = 0
      accY.current = 0
    }

    if (suppressClickOnDrag && movedFar) {
      blockNextClick()
    }

    resetDragging()

    if (!inertia) {
      vx.current = 0
      vy.current = 0
      return
    }

    let prev = performance.now()

    const step = () => {
      const now = performance.now()
      const dt = now - prev
      prev = now

      const dx = -vx.current * dt * scaleX
      const dy = -vy.current * dt * scaleY
      if (dx !== 0 || dy !== 0) {
        actionOnScroll(dispatch, {x: dx, y: dy})
      }

      vx.current *= damping
      vy.current *= damping

      if (Math.abs(vx.current) < restSpeed && Math.abs(vy.current) < restSpeed) {
        inertiaRaf.current = null
        vx.current = 0
        vy.current = 0
        return
      }
      inertiaRaf.current = requestAnimationFrame(step)
    }
    inertiaRaf.current = requestAnimationFrame(step)
  }, [
    dispatch,
    resetDragging,
    inertia,
    damping,
    restSpeed,
    scaleX,
    scaleY,
    clickThreshold,
    suppressClickOnDrag,
    blockNextClick,
  ])

  useEffect(() => {
    const controller = new AbortController()
    const {signal} = controller

    window.addEventListener('pointerdown', onPointerDown, {passive: false, signal})
    window.addEventListener('pointermove', onPointerMove, {passive: false, signal})
    window.addEventListener('pointerup', endDrag as any, {passive: true, signal})
    window.addEventListener('pointercancel', endDrag as any, {passive: true, signal})
    window.addEventListener('blur', endDrag as any, {passive: true, signal})

    return () => {
      controller.abort()

      if (raf.current != null) {
        cancelAnimationFrame(raf.current)
      }

      if (inertiaRaf.current != null) {
        cancelAnimationFrame(inertiaRaf.current)
      }

      resetDragging()
    }
  }, [onPointerDown, onPointerMove, endDrag, resetDragging])

  return null
}
