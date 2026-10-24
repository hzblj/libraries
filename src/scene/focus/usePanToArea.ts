import gsap from 'gsap'
import {useCallback, useEffect, useRef} from 'react'

import {calculateScale} from '@/providers/CameraProvider/const'
import {actionOnScroll, useCameraDispatch} from '@/providers/CameraProvider/context'

import {nearestScreenRect, view} from '../camera'
import {getAreaRect} from '../grid'

const MARGIN = 48

const fitsOnScreen = ({x, y, width, height}: {x: number; y: number; width: number; height: number}) =>
  x >= MARGIN && y >= MARGIN && x + width <= view.width - MARGIN && y + height <= view.height - MARGIN

export const usePanToArea = () => {
  const dispatch = useCameraDispatch()
  const tween = useRef<gsap.core.Tween | null>(null)

  useEffect(() => () => void tween.current?.kill(), [])

  return useCallback(
    (area: string) => {
      const rect = nearestScreenRect(getAreaRect(area))

      if (view.width === 0 || fitsOnScreen(rect)) {
        return
      }

      const base = calculateScale(view.width)
      const proxy = {x: 0, y: 0}
      let last = {x: 0, y: 0}

      tween.current?.kill()
      tween.current = gsap.to(proxy, {
        duration: 0.7,
        ease: 'power3.inOut',
        onUpdate: () => {
          actionOnScroll(dispatch, {x: (proxy.x - last.x) / base, y: (proxy.y - last.y) / base})
          last = {...proxy}
        },
        x: rect.x + rect.width / 2 - view.width / 2,
        y: rect.y + rect.height / 2 - view.height / 2,
      })
    },
    [dispatch]
  )
}
