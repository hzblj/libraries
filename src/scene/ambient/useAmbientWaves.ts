import {type RefObject, useEffect, useRef} from 'react'

import {bindScreenTriangle, createProgram} from '@/lib/webgl'
import screenVertex from '../graphics/shaders/screen.vert.glsl'
import wavesFragment from '../graphics/shaders/waves.frag.glsl'
import {WAVE_FRAME, WAVE_MAX_DPR, WAVE_MIRROR, WAVE_SPEED, WAVE_START, type WaveVariant} from './waves'

const isShown = (host: HTMLElement | null) => Number.parseFloat(host?.style.opacity || '1') > 0.001

export const useAmbientWaves = (variant: WaveVariant): RefObject<HTMLCanvasElement | null> => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const variantRef = useRef(variant)

  useEffect(() => {
    variantRef.current = variant
  }, [variant])

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl2', {alpha: false, antialias: false, powerPreference: 'low-power'})
    const program = gl ? createProgram(gl, screenVertex, wavesFragment) : null

    if (!canvas || !gl || !program) {
      return
    }

    const buffer = bindScreenTriangle(gl, program)

    const uniforms = {
      mirror: gl.getUniformLocation(program, 'uMirror'),
      resolution: gl.getUniformLocation(program, 'uResolution'),
      time: gl.getUniformLocation(program, 'uTime'),
    }

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const host = canvas.parentElement
    const start = performance.now()
    let frame = 0
    let next = 0
    let drawn = false

    const draw = (now: number) => {
      const scale = Math.min(window.devicePixelRatio, WAVE_MAX_DPR)
      const width = Math.max(1, Math.round(canvas.clientWidth * scale))
      const height = Math.max(1, Math.round(canvas.clientHeight * scale))
      const resized = canvas.width !== width || canvas.height !== height

      if (resized) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }

      if (still && drawn && !resized) {
        return
      }

      gl.uniform2f(uniforms.resolution, width, height)
      gl.uniform1f(uniforms.mirror, WAVE_MIRROR[variantRef.current])
      gl.uniform1f(uniforms.time, WAVE_START + (still ? 0 : ((now - start) / 1000) * WAVE_SPEED))
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      drawn = true
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)

      if (now < next - 1 || !isShown(host)) {
        return
      }

      next = now + WAVE_FRAME
      draw(now)
    }

    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  return canvasRef
}
