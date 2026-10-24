'use client'

import {useFrame} from '@react-three/fiber'
import {type FC, useState} from 'react'
import {Vector2} from 'three'

import {view} from '../camera'
import {bakeSlots, bumpGridVersion, bumpSceneVersion, takeSceneChanged} from '../entity'
import {flushUploads, glass} from '../graphics'
import {morph, useSceneStore} from '../state'
import {frameDue, morphChanged, viewMoved} from './renderGate'
import {takeSnapshot} from './snapshot'
import {useCanvasProbe} from './useCanvasProbe'
import {useGlassBlur} from './useGlassBlur'

export const Renderer: FC = () => {
  const renderGlass = useGlassBlur()
  const probeCanvas = useCanvasProbe()
  const [buffer] = useState(() => new Vector2())

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime * 1000

    if (!frameDue(now, delta)) {
      return
    }

    const {gl, scene, camera, size} = state
    const ratio = view.scale * gl.getPixelRatio()

    const {card, galleryOpen} = useSceneStore.getState()
    const covered = galleryOpen || (card !== null && morph.stage === 'dom')

    flushUploads(gl)

    if (!covered) {
      bakeSlots(gl, ratio, performance.now())
    }

    const gridChanged = !covered && takeSceneChanged()
    const moved = viewMoved(size.width, size.height, ratio)
    const overlaid = morphChanged()
    const morphing = card !== null && morph.stage !== 'dom'
    const render = gridChanged || moved || overlaid || morphing

    if (gridChanged || moved) {
      bumpGridVersion()
    }

    if (render) {
      glass.uResolution.value.copy(gl.getDrawingBufferSize(buffer))
      glass.uWorldScale.value = ratio
      glass.uPixelRatio.value = gl.getPixelRatio()

      if (card) {
        renderGlass(state)
      }

      gl.setRenderTarget(null)
      gl.render(scene, camera)
      bumpSceneVersion()
    }

    takeSnapshot(gl, scene, camera)
    probeCanvas(state)
  }, 1)

  return null
}
