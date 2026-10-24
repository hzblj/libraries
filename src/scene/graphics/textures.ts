'use client'

import {useLoader} from '@react-three/fiber'
import {use} from 'react'
import {CanvasTexture, LinearFilter, LinearMipmapLinearFilter, NoColorSpace, type Texture, TextureLoader} from 'three'

import {drawText, glyphExtent, loadFonts, measureText, type TextStyle} from './text'
import {queueUpload, trackLoad} from './uploads'

type Size = {width: number; height: number}

const textureScale = () => Math.min(4, Math.max(1, window.devicePixelRatio || 1) * 2)

const prepare = <T extends Texture>(texture: T, size: Size) => {
  texture.colorSpace = NoColorSpace
  texture.premultiplyAlpha = true
  texture.generateMipmaps = true
  texture.minFilter = LinearMipmapLinearFilter
  texture.magFilter = LinearFilter
  texture.anisotropy = 8
  texture.userData.size = size
  texture.needsUpdate = true
  queueUpload(texture)

  return texture
}

export const naturalSize = (texture: Texture): Size => texture.userData.size ?? {height: 0, width: 0}

class PreparedTextureLoader extends TextureLoader {
  load(
    url: string,
    onLoad?: (texture: Texture<HTMLImageElement>) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void
  ) {
    let settle: () => void = () => undefined
    trackLoad(
      new Promise<void>(resolve => {
        settle = resolve
      })
    )

    return super.load(
      url,
      texture => {
        const {naturalHeight, naturalWidth} = texture.image
        const ready = () => {
          onLoad?.(prepare(texture, {height: naturalHeight, width: naturalWidth}))
          settle()
        }

        texture.image.decode().then(ready, ready)
      },
      onProgress,
      error => {
        settle()
        onError?.(error)
      }
    )
  }
}

const imageUrl = (src: string, width: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`

export const useImage = (src: string, width: number) => useLoader(PreparedTextureLoader, imageUrl(src, width))

const paint = (size: Size, natural: Size, draw: (ctx: CanvasRenderingContext2D) => void, scale = textureScale()) => {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.ceil(size.width * scale))
  canvas.height = Math.max(1, Math.ceil(size.height * scale))

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas 2D is not available')
  }

  ctx.scale(canvas.width / size.width, canvas.height / size.height)
  draw(ctx)

  return prepare(new CanvasTexture(canvas), natural)
}

const drawn = new Map<string, CanvasTexture>()

export const useCanvasTexture = (
  key: string,
  size: Size,
  draw: (ctx: CanvasRenderingContext2D) => void,
  scale?: number
) => {
  use(loadFonts())

  const cacheKey = `${key}@${size.width}x${size.height}`
  let texture = drawn.get(cacheKey)

  if (!texture) {
    texture = paint(size, {height: 0, width: 0}, draw, scale)
    drawn.set(cacheKey, texture)
  }

  return texture
}

export type TextTexture = {
  texture: CanvasTexture
  width: number
  box: {x: number; y: number; width: number; height: number}
}

const texts = new Map<string, TextTexture>()

export const useText = (text: string, style: TextStyle): TextTexture => {
  use(loadFonts())

  const key = JSON.stringify([text, style])
  let entry = texts.get(key)

  if (!entry) {
    const width = measureText(text, style)
    const {top, bottom} = glyphExtent(style)
    const pad = style.shadow ? 3 : 1
    const box = {height: Math.ceil(bottom - top) + pad * 2, width: Math.ceil(width) + pad * 2, x: -pad, y: top - pad}

    entry = {box, texture: paint(box, {height: 0, width: 0}, ctx => drawText(ctx, text, pad, pad - top, style)), width}
    texts.set(key, entry)
  }

  return entry
}

const rasters = new Map<string, Promise<CanvasTexture>>()

const rasterize = (src: string, box: Size) => {
  const key = `${src}@${box.width}x${box.height}`
  let raster = rasters.get(key)

  if (!raster) {
    raster = trackLoad(
      new Promise<CanvasTexture>((resolve, reject) => {
        const image = new Image()

        image.onload = () => {
          const natural = {height: image.naturalHeight, width: image.naturalWidth}
          const cover = Math.max(box.width / natural.width, box.height / natural.height)
          const size = {height: natural.height * cover, width: natural.width * cover}

          resolve(paint(size, natural, ctx => ctx.drawImage(image, 0, 0, size.width, size.height)))
        }
        image.onerror = reject
        image.src = src
      })
    )

    rasters.set(key, raster)
  }

  return raster
}

export const useSvg = (src: string, box: Size) => use(rasterize(src, box))
