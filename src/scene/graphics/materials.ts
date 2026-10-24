import {
  CustomBlending,
  DstColorFactor,
  OneFactor,
  PlaneGeometry,
  ShaderMaterial,
  type Texture,
  Vector2,
  Vector4,
  ZeroFactor,
} from 'three'

import backdropFragment from './shaders/backdrop.frag.glsl'
import blurFragment from './shaders/blur.frag.glsl'
import cacheFragment from './shaders/cache.frag.glsl'
import common from './shaders/common.glsl'
import fullscreenVertex from './shaders/fullscreen.vert.glsl'
import layerFragment from './shaders/layer.frag.glsl'
import paperFragment from './shaders/paper.frag.glsl'
import quadVertex from './shaders/quad.vert.glsl'
import surfaceFragment from './shaders/surface.frag.glsl'

export const GRID_LAYER = 0
export const OVERLAY_LAYER = 1

export const plane = new PlaneGeometry(1, 1)

export const glass = {
  uBackdrop: {value: null as Texture | null},
  uDim: {value: 0},
  uPixelRatio: {value: 1},
  uResolution: {value: new Vector2(1, 1)},
  uWorldScale: {value: 1},
}

const withCommon = (source: string) => `${common}\n${source}`

const overlay = {
  depthTest: false,
  depthWrite: false,
  premultipliedAlpha: true,
  transparent: true,
  vertexShader: quadVertex,
}

export const createSurfaceMaterial = () =>
  new ShaderMaterial({
    ...overlay,
    fragmentShader: withCommon(surfaceFragment),
    uniforms: {
      ...glass,
      uBorder: {value: new Vector4(0, 0, 0, -1)},
      uBorderAngle: {value: 160},
      uBorderWidth: {value: 1},
      uFill: {value: new Vector4(0, 0, 0, -1)},
      uGlass: {value: 0},
      uOpacity: {value: 1},
      uRadius: {value: 16},
      uSize: {value: new Vector2(1, 1)},
      uSolid: {value: 0},
    },
  })

export const createLayerMaterial = () =>
  new ShaderMaterial({
    ...overlay,
    fragmentShader: withCommon(layerFragment),
    uniforms: {
      uAlphaGamma: {value: 1},
      uBleed: {value: 0},
      uBlur: {value: 0},
      uClip: {value: new Vector4(0, 0, 0, 0)},
      uClipRadius: {value: 0},
      uColor: {value: new Vector4(1, 1, 1, 1)},
      uHasMap: {value: 0},
      uMap: {value: null as Texture | null},
      uMapPosition: {value: new Vector2(0.5, 0.5)},
      uMapSize: {value: new Vector2(0, 0)},
      uOpacity: {value: 1},
      uRadius: {value: 0},
      uRect: {value: new Vector4(0, 0, 1, 1)},
      uRingColor: {value: new Vector4(0, 0, 0, 0)},
      uRingWidth: {value: 0},
      uVideo: {value: null as Texture | null},
      uVideoMix: {value: 0},
      uVideoSize: {value: new Vector2(0, 0)},
    },
  })

export const createPaperMaterial = () =>
  new ShaderMaterial({
    blendDst: ZeroFactor,
    blendDstAlpha: OneFactor,
    blending: CustomBlending,
    blendSrc: DstColorFactor,
    blendSrcAlpha: ZeroFactor,
    depthTest: false,
    depthWrite: false,
    fragmentShader: withCommon(paperFragment),
    transparent: true,
    uniforms: {
      uMap: {value: null as Texture | null},
      uMapSize: {value: new Vector2(0, 0)},
      uOpacity: {value: 1},
      uRadius: {value: 0},
      uRect: {value: new Vector4(0, 0, 1, 1)},
      uStrength: {value: 0.14},
    },
    vertexShader: quadVertex,
  })

export const createCacheMaterial = () =>
  new ShaderMaterial({
    ...overlay,
    fragmentShader: cacheFragment,
    uniforms: {
      uMap: {value: null as Texture | null},
      uOpacity: {value: 1},
    },
  })

export const createBackdropMaterial = () =>
  new ShaderMaterial({
    ...overlay,
    fragmentShader: backdropFragment,
    uniforms: {uOpacity: {value: 0}},
    vertexShader: fullscreenVertex,
  })

export const createBlurMaterial = () =>
  new ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    fragmentShader: blurFragment,
    uniforms: {
      uBounds: {value: new Vector4(0, 0, 1, 1)},
      uInput: {value: null as Texture | null},
      uSigma: {value: 8},
      uStep: {value: new Vector2(0, 0)},
    },
    vertexShader: quadVertex,
  })
