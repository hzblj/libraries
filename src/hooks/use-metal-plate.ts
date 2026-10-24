import {useCallback, useEffect, useRef} from 'react'

import {bindScreenTriangle, createProgram} from '@/lib/webgl'
import metalFragment from '@/scene/graphics/shaders/metal.frag.glsl'
import screenVertex from '@/scene/graphics/shaders/screen.vert.glsl'

export type MetalPose = {
  hover: number
  pointerX: number
  pointerY: number
  rotateX: number
  rotateY: number
}

const MAX_PIXEL_RATIO = 2

const REST: MetalPose = {hover: 0, pointerX: 0, pointerY: 0, rotateX: 0, rotateY: 0}

const DEGREES = Math.PI / 180

/**
 * The metal of the /ico card, drawn by a fragment shader on a bare WebGL2
 * canvas: glossy black with a slowly rippling relief, lit by the card's own
 * tilt and the pointer. `paint` is meant to be called from the
 * ticker that already tilts the card, so the light never lags a frame behind
 * the transform; on its own the plate only redraws when it is resized.
 */
export const useMetalPlate = (radius: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paintRef = useRef<(pose: MetalPose) => void>(() => undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl2', {antialias: false, premultipliedAlpha: true})
    const program = gl ? createProgram(gl, screenVertex, metalFragment) : null

    if (!canvas || !gl || !program) {
      return
    }

    const buffer = bindScreenTriangle(gl, program)
    const uniforms = {
      hover: gl.getUniformLocation(program, 'uHover'),
      pixelRatio: gl.getUniformLocation(program, 'uPixelRatio'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      radius: gl.getUniformLocation(program, 'uRadius'),
      resolution: gl.getUniformLocation(program, 'uResolution'),
      tilt: gl.getUniformLocation(program, 'uTilt'),
      time: gl.getUniformLocation(program, 'uTime'),
    }

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let last = REST

    const paint = (pose: MetalPose) => {
      const ratio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio))

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }

      last = pose
      gl.uniform2f(uniforms.resolution, width, height)
      gl.uniform1f(uniforms.pixelRatio, ratio)
      gl.uniform1f(uniforms.radius, radius * ratio)
      gl.uniform2f(uniforms.tilt, pose.rotateX * DEGREES, pose.rotateY * DEGREES)
      gl.uniform2f(uniforms.pointer, pose.pointerX, pose.pointerY)
      gl.uniform1f(uniforms.hover, pose.hover)
      gl.uniform1f(uniforms.time, still ? 0 : (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const observer = new ResizeObserver(() => paint(last))
    observer.observe(canvas)
    paintRef.current = paint
    paint(last)

    return () => {
      observer.disconnect()
      paintRef.current = () => undefined
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [radius])

  const paint = useCallback((pose: MetalPose) => {
    paintRef.current(pose)
  }, [])

  return {canvasRef, paint}
}
