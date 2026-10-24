// This site's grid, built as plain elements from the cards' stills: what the
// link preview and the portfolio's Libraries card both show. Mirrors
// src/scene/grid/layout.ts and the titles in src/db/index.ts.

// biome-ignore format: one row per line, so the template reads as the grid
const TEMPLATE = [
  'l1 l1 s1 s2 s6',
  'l1 l1 profile l2 l2',
  's5 s3 s4 l2 l2',
]

const CARDS = {
  l1: {image: 'kara-ui', subtitle: 'Design system for Expo', title: 'Kara'},
  l2: {image: 'expo-zoom-transition', subtitle: 'Expo Router transitions', title: 'Zoom Transition'},
  s1: {image: 'expo-app-icons', subtitle: 'Switch icons at runtime', title: 'App Icons'},
  s2: {image: 'react-native-expo-monorepo', subtitle: 'Turborepo starter for Expo', title: 'Expo Monorepo'},
  s3: {image: 'expo-flags-kit', subtitle: '255 country flags', title: 'Flags Kit'},
  s4: {image: 'expo-rich-haptics', subtitle: 'Haptic patterns for Expo', title: 'Rich Haptics'},
  s5: {image: 'zyplot', subtitle: 'Native charts everywhere', title: 'Zyplot'},
  s6: {image: 'portfolio', subtitle: 'Apps, work and CV', title: 'Portfolio'},
}

const COLUMN = 290
const ROW = 218
const GAP = 16
const PADDING = 2

const PROFILE = `<div class="profile">
  <div class="handle ink">hzblj</div>
  <div class="tagline">Libraries for <span class="ink">Expo</span></div>
  <div class="links"><span class="ink">GitHub</span><span class="dot"></span><span class="ink">npm</span></div>
</div>`

/** Fills `container` with the grid at its own size; returns that size and the profile card's centre. */
export const buildGrid = container => {
  const bounds = new Map()

  TEMPLATE.forEach((row, top) =>
    row.split(' ').forEach((name, left) => {
      const current = bounds.get(name) ?? {bottom: top, left, right: left, top}
      bounds.set(name, {
        bottom: Math.max(current.bottom, top),
        left: Math.min(current.left, left),
        right: Math.max(current.right, left),
        top: Math.min(current.top, top),
      })
    })
  )

  let centre = {x: 0, y: 0}

  for (const [name, {left, right, top, bottom}] of bounds) {
    const rect = {
      height: (bottom - top + 1) * (ROW + GAP) - GAP,
      width: (right - left + 1) * (COLUMN + GAP) - GAP,
      x: PADDING + left * (COLUMN + GAP),
      y: PADDING + top * (ROW + GAP),
    }
    const tile = document.createElement('div')
    tile.className = 'tile'
    Object.assign(tile.style, {
      height: `${rect.height}px`,
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.width}px`,
    })

    if (name === 'profile') {
      centre = {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2}
      tile.innerHTML = PROFILE
    } else {
      const card = CARDS[name]
      tile.innerHTML = `<img src="/public/libraries/${card.image}.png" />
        <div class="label"><div class="title ink">${card.title}</div><div class="subtitle">${card.subtitle}</div></div>`
    }

    container.append(tile)
  }

  const columns = TEMPLATE[0].split(' ').length

  return {
    centre,
    height: PADDING * 2 + TEMPLATE.length * (ROW + GAP) - GAP,
    width: PADDING * 2 + columns * (COLUMN + GAP) - GAP,
  }
}
