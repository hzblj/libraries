import type {Snapshot, SnapshotRegion} from '../state'

export const visibleRegion = (element: HTMLElement): SnapshotRegion => {
  const {left, top, width, bottom} = element.getBoundingClientRect()
  const y = Math.max(0, top)

  return {height: Math.max(0, Math.min(window.innerHeight, bottom) - y), width, x: left, y}
}

export const paintSnapshot = (canvas: HTMLCanvasElement, host: HTMLElement, {image, region}: Snapshot) => {
  const bounds = host.getBoundingClientRect()

  canvas.width = image.width
  canvas.height = image.height
  canvas.getContext('2d')?.putImageData(image, 0, 0)

  Object.assign(canvas.style, {
    display: 'block',
    height: `${region.height}px`,
    left: `${region.x - bounds.left}px`,
    opacity: '1',
    top: `${region.y - bounds.top}px`,
    width: `${region.width}px`,
  })
}

export const hideSnapshot = (canvas: HTMLCanvasElement | null) => {
  if (canvas) {
    canvas.style.display = 'none'
  }
}
