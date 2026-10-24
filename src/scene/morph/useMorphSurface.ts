import {useFrame} from '@react-three/fiber'
import {useLayoutEffect, useMemo} from 'react'

import {createSurfaceMaterial, type RGBA, setRGBA, useDisposable} from '../graphics'
import {lerpRect} from '../grid'
import {type CardSource, morph} from '../state'
import {placeSurface} from './placement'
import type {MorphFrame} from './useMorphFrame'
import {useOverlayMesh} from './useOverlayMesh'

export type MorphSurfaceLook = {
  fill: RGBA | 'card'
  border: RGBA | number
}

export const useMorphSurface = (source: CardSource, frame: MorphFrame, {fill, border}: MorphSurfaceLook) => {
  const material = useDisposable(useMemo(() => createSurfaceMaterial(), []))
  const mesh = useOverlayMesh()

  useLayoutEffect(() => {
    const {uniforms} = material
    uniforms.uSolid.value = 1

    if (fill === 'card') {
      uniforms.uFill.value.set(0, 0, 0, -1)
    } else {
      setRGBA(uniforms.uFill.value, fill)
    }

    if (typeof border === 'number') {
      uniforms.uBorder.value.set(0, 0, 0, -1)
      uniforms.uBorderAngle.value = border
    } else {
      setRGBA(uniforms.uBorder.value, border)
    }
  }, [border, fill, material])

  useFrame(() => {
    const {targets} = frame
    const t = morph.progress
    const card = targets ? lerpRect(source.rect, targets.surface, t) : source.rect

    placeSurface(material, mesh.mesh.current, card, t, targets?.surfaceRadius)
  })

  return {material, mesh}
}
