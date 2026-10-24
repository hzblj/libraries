import {useFrame} from '@react-three/fiber'
import {useLayoutEffect, useMemo, useRef, useState} from 'react'
import type {Mesh, Texture} from 'three'
import {createLayerMaterial, naturalSize, type RGBA, setRGBA, useDisposable, WHITE} from '../graphics'
import type {Rect} from '../grid'
import {useEntity} from './EntityContext'
import {createPlacement, factorOf, type Motions, offsetOf, type Pivot, place} from './motion'

export type VideoSource = {texture: Texture | null; mix: number}

export type LayerOptions = {
  rect: Rect
  radius?: number
  clip?: Rect
  clipRadius?: number
  map?: Texture | null
  fit?: 'cover' | 'fill'
  mapPosition?: readonly [number, number]
  color?: RGBA
  opacity?: number
  motion?: Motions
  pivot?: Pivot
  video?: VideoSource
  alphaGamma?: number
  bleed?: number
  ringWidth?: number
  ringColor?: RGBA
}

export const useLayer = ({
  rect,
  radius = 0,
  clip,
  clipRadius = 0,
  map,
  fit = 'cover',
  mapPosition,
  color = WHITE,
  opacity = 1,
  motion,
  pivot,
  video,
  alphaGamma = 1,
  bleed = 0,
  ringWidth = 0,
  ringColor = WHITE,
}: LayerOptions) => {
  const {size: host, invalidate, isVisible} = useEntity()
  const material = useDisposable(useMemo(() => createLayerMaterial(), []))
  const mesh = useRef<Mesh>(null)
  const [placement] = useState(createPlacement)
  const [drawn] = useState(() => ({
    blur: Number.NaN,
    height: Number.NaN,
    mix: Number.NaN,
    opacity: Number.NaN,
    radius: Number.NaN,
    time: Number.NaN,
    width: Number.NaN,
    x: Number.NaN,
    y: Number.NaN,
  }))

  useLayoutEffect(() => {
    const {uniforms} = material
    const natural = map && fit === 'cover' ? naturalSize(map) : {height: 0, width: 0}

    uniforms.uMap.value = map ?? null
    uniforms.uHasMap.value = map ? 1 : 0
    uniforms.uMapSize.value.set(natural.width, natural.height)
    uniforms.uMapPosition.value.set(mapPosition?.[0] ?? 0.5, mapPosition?.[1] ?? 0.5)
    uniforms.uClip.value.set(clip?.x ?? 0, clip?.y ?? 0, clip?.width ?? 0, clip?.height ?? 0)
    uniforms.uClipRadius.value = clipRadius
    uniforms.uAlphaGamma.value = alphaGamma
    uniforms.uBleed.value = bleed
    uniforms.uRingWidth.value = ringWidth
    setRGBA(uniforms.uRingColor.value, ringColor)
    setRGBA(uniforms.uColor.value, color)
    invalidate()

    return invalidate
  }, [alphaGamma, bleed, clip, clipRadius, color, fit, invalidate, map, mapPosition, material, ringColor, ringWidth])

  useFrame(() => {
    const node = mesh.current

    if (!node || !isVisible()) {
      return
    }

    const {x, y, width, height, scale} = place(placement, rect, motion, pivot)
    const {uniforms} = material
    const blur = offsetOf(motion, 'blur')
    const alpha = opacity * factorOf(motion, 'opacity')
    const mix = video?.texture ? video.mix : 0
    const time = video?.texture ? (video.texture.image as HTMLVideoElement).currentTime : 0

    node.position.set(x + width / 2 - host.width / 2, host.height / 2 - y - height / 2, 0)
    node.scale.set(Math.max(width + 2 * bleed, 1e-3), Math.max(height + 2 * bleed, 1e-3), 1)

    uniforms.uRect.value.set(x, y, width, height)
    uniforms.uRadius.value = radius * scale
    uniforms.uBlur.value = blur
    uniforms.uOpacity.value = alpha

    if (video) {
      const size = video.texture ? naturalSize(video.texture) : {height: 0, width: 0}
      uniforms.uVideo.value = video.texture
      uniforms.uVideoMix.value = mix
      uniforms.uVideoSize.value.set(size.width, size.height)
    }

    if (
      x !== drawn.x ||
      y !== drawn.y ||
      width !== drawn.width ||
      height !== drawn.height ||
      scale !== drawn.radius ||
      blur !== drawn.blur ||
      alpha !== drawn.opacity ||
      mix !== drawn.mix ||
      time !== drawn.time
    ) {
      drawn.x = x
      drawn.y = y
      drawn.width = width
      drawn.height = height
      drawn.radius = scale
      drawn.blur = blur
      drawn.opacity = alpha
      drawn.mix = mix
      drawn.time = time
      invalidate()
    }
  })

  return {material, mesh}
}
