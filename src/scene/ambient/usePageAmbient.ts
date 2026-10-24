import gsap from 'gsap'
import {usePathname} from 'next/navigation'
import {useCallback, useLayoutEffect, useRef, useState} from 'react'

import {morphTargets, SCENE_PATH, useSceneStore} from '../state'
import {variantOfPath} from './variants'

const FADE_OUT = {duration: 0.4, ease: 'power2.out', opacity: 0}

export const usePageAmbient = () => {
  const pathname = usePathname()
  const onPage = pathname !== SCENE_PATH
  const requested = useSceneStore(state => state.ambient)
  const variant = onPage ? variantOfPath(pathname) : requested
  const element = useRef<HTMLDivElement | null>(null)
  const [initialOpacity] = useState(onPage ? 1 : 0)

  const attach = useCallback((node: HTMLDivElement | null) => {
    element.current = node
    morphTargets.ambient = node
  }, [])

  useLayoutEffect(() => {
    if (onPage) {
      gsap.killTweensOf(element.current)
      gsap.set(element.current, {opacity: 1})
    } else if (!useSceneStore.getState().away) {
      gsap.to(element.current, FADE_OUT)
    }
  }, [onPage])

  return {attach, initialOpacity, variant}
}
