import {useCallback, useRef} from 'react'
import type {Mesh} from 'three'

import {OVERLAY_LAYER} from '../graphics'

export const useOverlayMesh = () => {
  const mesh = useRef<Mesh | null>(null)

  const attach = useCallback((node: Mesh | null) => {
    mesh.current = node
    node?.layers.set(OVERLAY_LAYER)
  }, [])

  return {attach, mesh}
}
