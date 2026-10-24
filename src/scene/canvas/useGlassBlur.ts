import type {RootState} from '@react-three/fiber'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {WebGLRenderTarget} from 'three'
import {FullScreenQuad} from 'three/examples/jsm/postprocessing/Pass.js'

import {gridVersion} from '../entity'
import {createBlurMaterial, GRID_LAYER, glass, OVERLAY_LAYER, useDisposable} from '../graphics'

const BLUR_RADIUS = 22
const BLUR_TEXEL = 4

const createTarget = () => new WebGLRenderTarget(1, 1, {depthBuffer: false})

export const useGlassBlur = () => {
  const [targets] = useState(() => [createTarget(), createTarget(), createTarget()] as const)
  const [captured] = useState(() => ({height: 0, version: -1, width: 0}))
  const blur = useDisposable(useMemo(() => createBlurMaterial(), []))
  const quad = useDisposable(useMemo(() => new FullScreenQuad(blur), [blur]))

  useEffect(
    () => () => {
      for (const target of targets) {
        target.dispose()
      }
    },
    [targets]
  )

  return useCallback(
    ({gl, scene, camera, size}: RootState) => {
      if (captured.version === gridVersion() && captured.width === size.width && captured.height === size.height) {
        return
      }

      const [grid, ping, pong] = targets
      const width = Math.max(1, Math.ceil(size.width / BLUR_TEXEL))
      const height = Math.max(1, Math.ceil(size.height / BLUR_TEXEL))

      for (const target of targets) {
        if (target.width !== width || target.height !== height) {
          target.setSize(width, height)
        }
      }

      glass.uBackdrop.value = null
      camera.layers.set(GRID_LAYER)
      gl.setRenderTarget(grid)
      gl.clear()
      gl.render(scene, camera)
      camera.layers.enable(OVERLAY_LAYER)

      blur.uniforms.uBounds.value.set(0, 0, 1, 1)
      blur.uniforms.uSigma.value = BLUR_RADIUS / BLUR_TEXEL

      blur.uniforms.uInput.value = grid.texture
      blur.uniforms.uStep.value.set(1 / width, 0)
      gl.setRenderTarget(ping)
      quad.render(gl)

      blur.uniforms.uInput.value = ping.texture
      blur.uniforms.uStep.value.set(0, 1 / height)
      gl.setRenderTarget(pong)
      quad.render(gl)

      glass.uBackdrop.value = pong.texture
      captured.version = gridVersion()
      captured.width = size.width
      captured.height = size.height
    },
    [blur, captured, quad, targets]
  )
}
