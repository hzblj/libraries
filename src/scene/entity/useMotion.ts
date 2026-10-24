import gsap from 'gsap'
import {useEffect, useState} from 'react'

export const useMotion = <T extends object>(initial: T) => {
  const [motion] = useState(() => ({...initial}))

  useEffect(() => () => gsap.killTweensOf(motion), [motion])

  return motion
}
