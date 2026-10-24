export const WIDTH = 596
export const HEIGHT = 452

export const PHOTOS = [
  '/png/gallery-1.png',
  '/png/gallery-2.png',
  '/png/gallery-3.png',
  '/png/gallery-4.png',
  '/png/gallery-5.png',
  '/png/gallery-6.png',
]

export const FADED = 0.5
export const GROWN = 2
export const SHRUNK = 0.6

export const CARD = {height: HEIGHT, width: WIDTH, x: 0, y: 0}
export const CLIP = {height: HEIGHT - 2, width: WIDTH - 2, x: 1, y: 1}

export const RAMP = [
  [0, 'rgba(0, 0, 0, 0)'],
  [1, 'rgba(0, 0, 0, 0.8)'],
] as const

export type Panel = {grow: number; opacity: number}

export const panelSpan = (panels: Panel[], index: number) => {
  const total = panels.reduce((sum, panel) => sum + panel.grow, 0)
  let x = 0

  for (let i = 0; i < index; i++) {
    x += (panels[i].grow / total) * WIDTH
  }

  return {width: (panels[index].grow / total) * WIDTH, x}
}

export const panelAt = (panels: Panel[], x: number) =>
  panels.findIndex((_, index) => {
    const span = panelSpan(panels, index)

    return x >= span.x && x < span.x + span.width
  })
