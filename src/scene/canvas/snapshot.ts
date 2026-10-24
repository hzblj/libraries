import {type Camera, type Object3D, Vector2, type WebGLRenderer, WebGLRenderTarget} from 'three'

import {takeSnapshotRequest} from '../state'

let target: WebGLRenderTarget | null = null
const buffer = new Vector2()

const flipRows = (pixels: Uint8Array, width: number, height: number) => {
  const flipped = new Uint8ClampedArray(pixels.length)
  const row = width * 4

  for (let y = 0; y < height; y++) {
    flipped.set(pixels.subarray((height - 1 - y) * row, (height - y) * row), y * row)
  }

  return flipped
}

export const takeSnapshot = (gl: WebGLRenderer, scene: Object3D, camera: Camera) => {
  const request = takeSnapshotRequest()

  if (!request) {
    return
  }

  const ratio = gl.getPixelRatio()
  const {x: bufferWidth, y: bufferHeight} = gl.getDrawingBufferSize(buffer)
  const x = Math.max(0, Math.round(request.region.x * ratio))
  const y = Math.max(0, Math.round(request.region.y * ratio))
  const width = Math.min(bufferWidth - x, Math.round(request.region.width * ratio))
  const height = Math.min(bufferHeight - y, Math.round(request.region.height * ratio))

  if (width <= 0 || height <= 0) {
    request.resolve(null)
    return
  }

  target ??= new WebGLRenderTarget(1, 1, {depthBuffer: false})

  if (target.width !== bufferWidth || target.height !== bufferHeight) {
    target.setSize(bufferWidth, bufferHeight)
  }

  gl.setRenderTarget(target)
  gl.clear()
  gl.render(scene, camera)
  gl.setRenderTarget(null)

  const pixels = new Uint8Array(width * height * 4)
  const region = {height: height / ratio, width: width / ratio, x: x / ratio, y: y / ratio}

  gl.readRenderTargetPixelsAsync(target, x, bufferHeight - y - height, width, height, pixels).then(
    () => request.resolve({image: new ImageData(flipRows(pixels, width, height), width, height), ratio, region}),
    () => request.resolve(null)
  )
}
