import {useFrame} from '@react-three/fiber'
import {useCallback, useMemo, useRef} from 'react'
import type {Mesh} from 'three'

import {createBackdropMaterial, glass, OVERLAY_LAYER, useDisposable} from '../graphics'
import {morph} from '../state'

export const useBackdrop = () => {
  const material = useDisposable(useMemo(() => createBackdropMaterial(), []))
  const mesh = useRef<Mesh | null>(null)

  const attach = useCallback((node: Mesh | null) => {
    mesh.current = node
    node?.layers.set(OVERLAY_LAYER)
  }, [])

  useFrame(() => {
    material.uniforms.uOpacity.value = morph.backdrop
    glass.uDim.value = morph.backdrop

    if (mesh.current) {
      mesh.current.visible = morph.backdrop > 0
    }
  })

  return {attach, material}
}
