import {useFrame} from '@react-three/fiber'
import {useLayoutEffect, useMemo, useState} from 'react'

import {CV_PREVIEW_HEIGHT, CV_WIDTH, cvPreviewClip, cvPreviewRect, useCvPreview} from '../cards'
import {createLayerMaterial, useDisposable} from '../graphics'
import {lerp, lerpRect, offsetRect} from '../grid'
import {type CardSource, morph} from '../state'
import {placeInWorld, showArtwork} from './placement'
import type {MorphFrame} from './useMorphFrame'
import {useOverlayMesh} from './useOverlayMesh'

const fadeOut = (t: number) => 1 - Math.min(1, Math.max(0, (t - 0.5) / 0.4))

export const useMorphPreview = (source: CardSource, frame: MorphFrame) => {
  const preview = useCvPreview()
  const material = useDisposable(useMemo(() => createLayerMaterial(), []))
  const mesh = useOverlayMesh()
  const [from] = useState(() => offsetRect(cvPreviewRect(), source.rect))
  const [fromClip] = useState(() => offsetRect(cvPreviewClip(source.rect.width), source.rect))

  useLayoutEffect(() => {
    material.uniforms.uMap.value = preview
    material.uniforms.uHasMap.value = 1
  }, [material, preview])

  useFrame(() => {
    showArtwork(mesh.mesh.current)

    if (morph.stage !== 'webgl') {
      return
    }

    const {targets} = frame
    const t = morph.progress
    const column = targets?.media
    const to = column ? {...column, height: CV_PREVIEW_HEIGHT * (column.width / CV_WIDTH)} : from
    const sheet = lerpRect(from, to, t)
    const clip = targets ? lerpRect(fromClip, targets.surface, t) : fromClip

    placeInWorld(mesh.mesh.current, sheet)
    material.uniforms.uRect.value.set(sheet.x, sheet.y, sheet.width, sheet.height)
    material.uniforms.uClip.value.set(clip.x, clip.y, clip.width, clip.height)
    material.uniforms.uClipRadius.value = lerp(16, targets?.surfaceRadius ?? 16, t)
    material.uniforms.uOpacity.value = morph.keepsPreview ? 1 : fadeOut(t)
  })

  return {material, mesh}
}
