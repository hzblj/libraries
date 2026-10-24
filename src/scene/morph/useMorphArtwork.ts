import {useFrame} from '@react-three/fiber'
import {useLayoutEffect, useMemo, useState} from 'react'

import type {EntryShot} from '@/db'

import {shotImageWidth} from '../cards'
import {createLayerMaterial, naturalSize, useDisposable, useImage} from '../graphics'
import {insetRect, lerp, lerpRect} from '../grid'
import {type CardSource, morph} from '../state'
import {placeInWorld, showArtwork} from './placement'
import type {MorphFrame} from './useMorphFrame'
import {useOverlayMesh} from './useOverlayMesh'

export const useMorphArtwork = (entry: EntryShot, source: CardSource, frame: MorphFrame) => {
  const image = useImage(entry.image, shotImageWidth(entry.size))
  const media = source.media ?? image
  const material = useDisposable(useMemo(() => createLayerMaterial(), []))
  const mesh = useOverlayMesh()
  const [from] = useState(() => insetRect(source.rect, 1))

  useLayoutEffect(() => {
    material.uniforms.uMap.value = media
    material.uniforms.uHasMap.value = 1
  }, [material, media])

  useFrame(() => {
    showArtwork(mesh.mesh.current)

    if (morph.stage !== 'webgl') {
      return
    }

    const {targets} = frame
    const t = morph.progress
    const rect = targets?.media ? lerpRect(from, targets.media, t) : from
    const natural = naturalSize(media)

    placeInWorld(mesh.mesh.current, rect)
    material.uniforms.uRect.value.set(rect.x, rect.y, rect.width, rect.height)
    material.uniforms.uRadius.value = lerp(15, targets?.mediaRadius ?? 15, t)
    material.uniforms.uMapSize.value.set(natural.width, natural.height)
  })

  return {material, mesh}
}
