import type {Mesh, ShaderMaterial} from 'three'

import {view} from '../camera'
import {lerp, type Rect} from '../grid'
import {morph} from '../state'

export const placeInWorld = (mesh: Mesh | null, {x, y, width, height}: Rect) => {
  mesh?.position.set(x + width / 2, -(y + height / 2), 0)
  mesh?.scale.set(Math.max(width, 1e-3), Math.max(height, 1e-3), 1)
}

const PAGE_GROWTH = 0.06

const grow = ({x, y, width, height}: Rect, by: number): Rect => ({
  height: height * (1 + by),
  width: width * (1 + by),
  x: x - (width * by) / 2,
  y: y - (height * by) / 2,
})

export const placeSurface = (material: ShaderMaterial, mesh: Mesh | null, card: Rect, t: number, radius = 16) => {
  const glass = grow(card, PAGE_GROWTH * morph.page)

  placeInWorld(mesh, glass)
  material.uniforms.uSize.value.set(glass.width, glass.height)
  material.uniforms.uRadius.value = lerp(16, radius, t)
  material.uniforms.uBorderWidth.value = lerp(1, 1 / view.scale, t)
  material.uniforms.uGlass.value = t
  material.uniforms.uOpacity.value = 1 - morph.page
  morph.glassRect = glass
}

export const showArtwork = (mesh: Mesh | null) => {
  if (mesh) {
    mesh.visible = morph.stage === 'webgl'
  }
}
