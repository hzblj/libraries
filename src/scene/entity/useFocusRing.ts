import gsap from 'gsap'
import {useEffect} from 'react'

import {useSceneStore} from '../state'
import {useMotion} from './useMotion'

export const useFocusRing = (id: string) => {
  const focused = useSceneStore(state => state.focused === id)
  const motion = useMotion({opacity: 0, scale: 1.04})

  useEffect(() => {
    gsap.to(motion, {
      duration: focused ? 0.25 : 0.2,
      ease: focused ? 'power2.out' : 'power2.in',
      opacity: focused ? 1 : 0,
      scale: focused ? 1 : 1.04,
    })
  }, [focused, motion])

  return motion
}
