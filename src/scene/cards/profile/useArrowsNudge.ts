import gsap from 'gsap'
import {useEffect} from 'react'

import {useMotion} from '../../entity'

export const useArrowsNudge = () => {
  const motion = useMotion({x: 0, y: 0})

  useEffect(() => {
    const timeline = gsap.timeline({defaults: {ease: 'power2.out'}, repeat: -1, repeatDelay: 0.8})

    timeline
      .to(motion, {duration: 0.6, y: -4})
      .to(motion, {duration: 0.6, x: -4, y: 0}, '+=0.25')
      .to(motion, {duration: 0.8, ease: 'power2.inOut', x: 0, y: 0}, '+=0.25')

    return () => {
      timeline.kill()
    }
  }, [motion])

  return motion
}
