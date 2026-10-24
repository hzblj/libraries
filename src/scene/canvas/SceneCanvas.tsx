'use client'

import {Canvas, type RootState} from '@react-three/fiber'
import type {FC} from 'react'

import {entries} from '@/db'

import {CameraRig} from '../camera'
import {Cards} from '../cards'
import {OVERLAY_LAYER} from '../graphics'
import {MorphLayer} from '../morph'
import {useSceneActive} from '../state'
import {Backdrop} from './Backdrop'
import {Renderer} from './Renderer'

const CAMERA = {far: 1000, near: 0.1, position: [0, 0, 100] as const, zoom: 1}
const GL = {alpha: false, antialias: false, powerPreference: 'high-performance' as const}
const STYLE = {touchAction: 'none'}

const handleCreated = ({gl, camera}: RootState) => {
  gl.setClearColor(0x000000, 1)
  camera.layers.enable(OVERLAY_LAYER)
}

export const SceneCanvas: FC = () => {
  const active = useSceneActive()

  return (
    <Canvas
      orthographic
      camera={CAMERA}
      flat
      linear
      dpr={[1, 2]}
      gl={GL}
      frameloop={active ? 'always' : 'never'}
      onCreated={handleCreated}
      style={STYLE}
    >
      <CameraRig />
      <Renderer />
      <Cards entries={entries} />
      <Backdrop />
      <MorphLayer />
    </Canvas>
  )
}
