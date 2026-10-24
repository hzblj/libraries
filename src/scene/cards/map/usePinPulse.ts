import gsap from 'gsap'
import {useEffect} from 'react'

import {useMotion} from '../../entity'

export const usePinPulse = () => {
  const pulse = useMotion({scale: 1})

  useEffect(() => {
    const tween = gsap.to(pulse, {
      keyframes: [
        {duration: 0.8, ease: 'power2.out', scale: 1.2},
        {duration: 1.2, ease: 'power2.inOut', scale: 0.9},
      ],
      repeat: -1,
    })

    return () => {
      tween.kill()
    }
  }, [pulse])

  return pulse
}
