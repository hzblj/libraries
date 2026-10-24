import {
  type Group,
  type Mesh,
  OrthographicCamera,
  type ShaderMaterial,
  type WebGLRenderer,
  WebGLRenderTarget,
} from 'three'

import type {EntitySize} from './EntityContext'

export type BakedSlot = {
  outer: Group | null
  inner: Group | null
  quad: Mesh | null
  material: ShaderMaterial
  size: EntitySize
  target: WebGLRenderTarget | null
  ratio: number
  dirty: boolean
  visible: boolean
  hiddenAt: number
}

const MARGIN = 8
const RELEASE_AFTER = 10000
const SETTLE = 150

const slots = new Set<BakedSlot>()
const camera = new OrthographicCamera()
const state = {changed: true, gridVersion: 0, ratio: 0, ratioChangedAt: 0, version: 0}

export const createBakedSlot = (size: EntitySize, material: ShaderMaterial): BakedSlot => ({
  dirty: true,
  hiddenAt: 0,
  inner: null,
  material,
  outer: null,
  quad: null,
  ratio: 0,
  size,
  target: null,
  visible: false,
})

export const registerBakedSlot = (slot: BakedSlot) => {
  slots.add(slot)

  return () => {
    slots.delete(slot)
    slot.target?.dispose()
    slot.target = null
    state.changed = true
  }
}

export const markSceneChanged = () => {
  state.changed = true
}

export const takeSceneChanged = () => {
  const changed = state.changed
  state.changed = false

  return changed
}

export const sceneVersion = () => state.version

export const bumpSceneVersion = () => {
  state.version += 1
}

export const gridVersion = () => state.gridVersion

export const bumpGridVersion = () => {
  state.gridVersion += 1
}

export const bakedQuadSize = (slot: BakedSlot) =>
  slot.target ? {height: slot.target.height / slot.ratio, width: slot.target.width / slot.ratio} : null

const release = (slot: BakedSlot) => {
  slot.target?.dispose()
  slot.target = null
  slot.material.uniforms.uMap.value = null
}

const fit = (slot: BakedSlot, ratio: number) => {
  const width = Math.ceil((slot.size.width + MARGIN * 2) * ratio)
  const height = Math.ceil((slot.size.height + MARGIN * 2) * ratio)

  if (slot.target) {
    slot.target.setSize(width, height)
  } else {
    slot.target = new WebGLRenderTarget(width, height, {depthBuffer: false})
    slot.material.uniforms.uMap.value = slot.target.texture
  }

  slot.ratio = ratio
}

const bake = (gl: WebGLRenderer, slot: BakedSlot) => {
  const {outer, inner, target} = slot

  if (!outer || !inner || !target) {
    return
  }

  const width = target.width / slot.ratio
  const height = target.height / slot.ratio

  outer.updateMatrixWorld(true)
  camera.left = -width / 2
  camera.right = width / 2
  camera.top = height / 2
  camera.bottom = -height / 2
  camera.near = 0.1
  camera.far = 1000
  camera.position.set(outer.position.x, outer.position.y, 100)
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()

  const clearAlpha = gl.getClearAlpha()
  inner.visible = true
  gl.setRenderTarget(target)
  gl.setClearAlpha(0)
  gl.render(inner, camera)
  gl.setClearAlpha(clearAlpha)
  inner.visible = false
}

export const bakeSlots = (gl: WebGLRenderer, ratio: number, now: number) => {
  if (ratio !== state.ratio) {
    state.ratio = ratio
    state.ratioChangedAt = now
  }

  const settled = now - state.ratioChangedAt > SETTLE
  let baked = false

  for (const slot of slots) {
    if (!slot.visible) {
      if (slot.target && now - slot.hiddenAt > RELEASE_AFTER) {
        release(slot)
      }
      continue
    }

    const refit = !slot.target || (settled && slot.ratio !== ratio)
    if (!refit && !slot.dirty) {
      continue
    }

    if (refit) {
      fit(slot, ratio)
    }

    bake(gl, slot)
    slot.dirty = false
    baked = true
  }

  if (baked) {
    gl.setRenderTarget(null)
    state.changed = true
  }
}
