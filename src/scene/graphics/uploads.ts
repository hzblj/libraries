import type {Texture, WebGLRenderer} from 'three'

const queued = new Set<Texture>()
let loading = 0
let flushed = false

export const queueUpload = (texture: Texture) => {
  queued.add(texture)
}

export const trackLoad = <T>(promise: Promise<T>) => {
  const done = () => {
    loading -= 1
  }

  loading += 1
  promise.then(done, done)

  return promise
}

export const flushUploads = (gl: WebGLRenderer) => {
  for (const texture of queued) {
    gl.initTexture(texture)
  }

  queued.clear()
  flushed = true
}

export const uploadsSettled = () => flushed && loading === 0 && queued.size === 0
