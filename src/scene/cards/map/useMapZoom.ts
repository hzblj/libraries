import gsap from 'gsap'
import {useMemo} from 'react'

import {Config} from '@/config'

import {useMotion} from '../../entity'
import {openExternal, useHotspots} from '../../interaction'
import {CARTOGRAM} from './layout'

export const useMapZoom = () => {
  const zoom = useMotion({
    scale: 1,
    x: CARTOGRAM.x + CARTOGRAM.width / 2,
    y: CARTOGRAM.y + CARTOGRAM.height / 2,
  })

  const hotspots = useMemo(
    () => [
      {
        onClick: () => openExternal(Config.location.mapUrl),
        onEnter: () => {
          gsap.killTweensOf(zoom)
          gsap.to(zoom, {duration: 0.6, ease: 'power3.out', scale: 1.1})
        },
        onLeave: () => {
          gsap.killTweensOf(zoom)
          gsap.to(zoom, {duration: 0.6, ease: 'power3.inOut', scale: 1})
        },
        rect: CARTOGRAM,
      },
    ],
    [zoom]
  )

  return {pointer: useHotspots(hotspots), zoom}
}
