import {useFrame} from '@react-three/fiber'
import {useLayoutEffect, useMemo} from 'react'
import type {Mesh, ShaderMaterial} from 'three'

import {cvLabelClip, cvLabelHost, RAMP} from '../cards'
import {FOOT_LABEL, FOOT_LABEL_OPACITY, footLabelRect, footRampRect, useRampTexture} from '../cards/shared'
import {createLayerMaterial, TEXT_ALPHA_GAMMA, useDisposable, useText} from '../graphics'
import {lerp, lerpRect, offsetRect, type Rect} from '../grid'
import {type CardSource, morph} from '../state'
import {placeInWorld, showArtwork} from './placement'
import type {MorphFrame} from './useMorphFrame'
import {useOverlayMesh} from './useOverlayMesh'

const LANDING = 0.3
const NO_CLIP = {height: 0, width: 0, x: 0, y: 0}

const landed = (t: number) => {
  const v = Math.min(1, t / LANDING)

  return 1 - v * v * (3 - 2 * v)
}

const placeLayer = (
  material: ShaderMaterial,
  mesh: Mesh | null,
  rect: Rect,
  clip: Rect,
  radius: number,
  opacity: number
) => {
  placeInWorld(mesh, rect)

  material.uniforms.uRect.value.set(rect.x, rect.y, rect.width, rect.height)
  material.uniforms.uClip.value.set(clip.x, clip.y, clip.width, clip.height)
  material.uniforms.uClipRadius.value = radius
  material.uniforms.uOpacity.value = opacity
}

export const useMorphFoot = (source: CardSource, frame: MorphFrame) => {
  const text = useText('CV', FOOT_LABEL)
  const ramp = useRampTexture(RAMP)
  const rampMaterial = useDisposable(useMemo(() => createLayerMaterial(), []))
  const labelMaterial = useDisposable(useMemo(() => createLayerMaterial(), []))
  const rampMesh = useOverlayMesh()
  const labelMesh = useOverlayMesh()

  useLayoutEffect(() => {
    rampMaterial.uniforms.uMap.value = ramp
    rampMaterial.uniforms.uHasMap.value = 1
    labelMaterial.uniforms.uMap.value = text.texture
    labelMaterial.uniforms.uHasMap.value = 1
    labelMaterial.uniforms.uAlphaGamma.value = TEXT_ALPHA_GAMMA
  }, [labelMaterial, ramp, rampMaterial, text])

  useFrame(() => {
    showArtwork(rampMesh.mesh.current)
    showArtwork(labelMesh.mesh.current)

    if (morph.stage !== 'webgl') {
      return
    }

    const {targets} = frame
    const t = morph.progress
    const card = targets ? lerpRect(source.rect, targets.surface, t) : source.rect
    const host = offsetRect(cvLabelHost(card), card)
    const clip = offsetRect(cvLabelClip(card), card)
    const radius = lerp(16, targets?.surfaceRadius ?? 16, t)
    const opacity = landed(t)

    placeLayer(rampMaterial, rampMesh.mesh.current, footRampRect(host), clip, radius, opacity)
    placeLayer(
      labelMaterial,
      labelMesh.mesh.current,
      footLabelRect(host, text),
      NO_CLIP,
      0,
      opacity * FOOT_LABEL_OPACITY
    )
  })

  return {labelMaterial, labelMesh, rampMaterial, rampMesh}
}
