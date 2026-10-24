import {useFrame} from '@react-three/fiber'
import {useCallback, useEffect, useState} from 'react'
import type {Group, Mesh} from 'three'

import type {Entry} from '@/db'
import {view, viewBounds} from '../camera'
import {createCacheMaterial} from '../graphics'
import {firstCopy, getAreaRect, mod, PERIOD} from '../grid'
import {isSourceSlot} from '../state'
import {bakedQuadSize, createBakedSlot, markSceneChanged, registerBakedSlot} from './bake'
import type {EntityValue} from './EntityContext'
import {parseOrigin, useEntrance} from './useEntrance'

export const SLOTS = [0, 1, 2, 3] as const

const REST = 150

const snap = (edge: number, ratio: number) => (Math.round(edge) - edge) / ratio

export const useSlots = (entry: Entry) => {
  const rect = getAreaRect(entry.area)
  const enter = useEntrance(entry.animation)
  const [originX, originY] = parseOrigin(entry.animation?.origin)

  const [placed] = useState(() => SLOTS.map(() => ({x: rect.x, y: rect.y})))
  const [baked] = useState(() =>
    SLOTS.map(() => createBakedSlot({height: rect.height, width: rect.width}, createCacheMaterial()))
  )
  const [shown] = useState(() => ({opacity: Number.NaN, scale: Number.NaN, x: Number.NaN, y: Number.NaN}))

  const [contexts] = useState(() =>
    SLOTS.map(
      (slot): EntityValue => ({
        invalidate: () => {
          baked[slot].dirty = true
        },
        isVisible: () => baked[slot].visible,
        size: {height: rect.height, width: rect.width},
        slot,
        slug: entry.slug,
        worldRect: () => ({height: rect.height, width: rect.width, ...placed[slot]}),
      })
    )
  )

  useEffect(() => {
    const releases = baked.map(registerBakedSlot)

    return () => {
      for (const release of releases) {
        release()
      }

      for (const slot of baked) {
        slot.material.dispose()
      }
    }
  }, [baked])

  useFrame(({gl, size}) => {
    const {left, top, right, bottom} = viewBounds()
    const firstX = firstCopy(rect.x, rect.width, PERIOD.x, left)
    const firstY = firstCopy(rect.y, rect.height, PERIOD.y, top)
    const shiftX = enter.x + (rect.width / 2) * (1 - enter.scale) * originX
    const shiftY = enter.y + (rect.height / 2) * (1 - enter.scale) * originY
    const dpr = gl.getPixelRatio()
    const ratio = view.scale * dpr
    const now = performance.now()
    const resting = now - view.movedAt > REST

    if (enter.opacity !== shown.opacity || enter.scale !== shown.scale || enter.x !== shown.x || enter.y !== shown.y) {
      shown.opacity = enter.opacity
      shown.scale = enter.scale
      shown.x = enter.x
      shown.y = enter.y
      markSceneChanged()
    }

    for (const slot of SLOTS) {
      const record = baked[slot]
      const {outer, inner, quad} = record

      if (!outer || !inner || !quad) {
        continue
      }

      const x = rect.x + (firstX + mod((slot & 1) - firstX, 2)) * PERIOD.x
      const y = rect.y + (firstY + mod((slot >> 1) - firstY, 2)) * PERIOD.y
      const open = isSourceSlot(entry.slug, slot)
      const visible = x < right && y < bottom && !open

      if (visible !== record.visible || x !== placed[slot].x || y !== placed[slot].y) {
        record.hiddenAt = visible ? record.hiddenAt : now
        record.visible = visible
        markSceneChanged()
      }

      // The open card keeps its bake for the way back, however long it stays open.
      if (open) {
        record.hiddenAt = now
      }

      placed[slot].x = x
      placed[slot].y = y

      outer.visible = visible
      outer.position.set(x + rect.width / 2, -(y + rect.height / 2), 0)
      inner.visible = false

      const quadSize = bakedQuadSize(record)

      // A bake lands after this frame's check, so the quad turns on a frame later and that frame must draw too.
      if (quad.visible !== (quadSize !== null)) {
        quad.visible = quadSize !== null
        markSceneChanged()
      }

      if (!quadSize) {
        continue
      }

      const aligned = resting && record.ratio === ratio && enter.scale === 1
      const quadLeft = x + rect.width / 2 - quadSize.width / 2
      const quadTop = y + rect.height / 2 - quadSize.height / 2
      const dx = aligned ? snap((quadLeft - view.x) * ratio + (size.width * dpr) / 2, ratio) : 0
      const dy = aligned ? snap((quadTop - view.y) * ratio + (size.height * dpr) / 2, ratio) : 0

      const quadX = dx + shiftX
      const quadY = -(dy + shiftY)
      const quadWidth = quadSize.width * enter.scale
      const quadHeight = quadSize.height * enter.scale

      if (
        quadX !== quad.position.x ||
        quadY !== quad.position.y ||
        quadWidth !== quad.scale.x ||
        quadHeight !== quad.scale.y
      ) {
        quad.position.set(quadX, quadY, 0)
        quad.scale.set(quadWidth, quadHeight, 1)
        markSceneChanged()
      }

      record.material.uniforms.uOpacity.value = enter.opacity
    }
  }, -0.3)

  const setOuter = useCallback(
    (slot: number, node: Group | null) => {
      baked[slot].outer = node
    },
    [baked]
  )

  const setInner = useCallback(
    (slot: number, node: Group | null) => {
      baked[slot].inner = node

      if (node) {
        node.visible = false
      }
    },
    [baked]
  )

  const setQuad = useCallback(
    (slot: number, node: Mesh | null) => {
      baked[slot].quad = node
    },
    [baked]
  )

  return {baked, contexts, setInner, setOuter, setQuad}
}
