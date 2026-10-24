// This site's grid, built as plain elements from the cards' stills: what the
// link preview and the portfolio's Libraries card both show. Mirrors
// src/scene/grid/layout.ts and the titles in src/db/index.ts.

// biome-ignore format: one row per line, so the template reads as the grid
const TEMPLATE = [
  'examples l1 l1 s1 l2 l2 l3 l3',
  'examples l1 l1 s2 l2 l2 l3 l3',
  'examples s3 s4 profile profile s5 s6 s7',
  'l4 l4 l5 l5 l6 l6 l7 l7',
  'l4 l4 l5 l5 l6 l6 l7 l7',
]

const CARDS = {
  l1: {image: 'kara-ui', subtitle: 'Design system for Expo', title: 'Kara'},
  l2: {image: 'expo-translation', subtitle: 'Translation on the device', title: 'Translation'},
  l3: {image: 'skills', subtitle: 'Agent skills for building apps', title: 'Skills'},
  l4: {image: 'expo-paypal', subtitle: 'PayPal on the native SDK', title: 'PayPal'},
  l5: {image: 'expo-waveform', subtitle: 'Native audio waveforms', title: 'Waveform'},
  l6: {image: 'zyplot', subtitle: 'Native charts everywhere', title: 'Zyplot'},
  l7: {image: 'expo-zoom-transition', subtitle: 'Expo Router transitions', title: 'Zoom Transition'},
  s1: {image: 'react-native-expo-monorepo', subtitle: 'Turborepo starter for Expo', title: 'Expo Monorepo'},
  s2: {image: 'expo-app-icons', subtitle: 'Switch icons at runtime', title: 'App Icons'},
  s3: {image: 'expo-rich-haptics', subtitle: 'Haptic patterns for Expo', title: 'Rich Haptics'},
  s4: {image: 'expo-native-icons', subtitle: 'Your SVGs as native icons', title: 'Native Icons'},
  s5: {image: 'portfolio', subtitle: 'Apps, work and CV', title: 'Portfolio'},
  s6: {image: 'expo-speech', subtitle: 'Speech to text, natively', title: 'Speech'},
  s7: {image: 'expo-flags-kit', subtitle: '255 country flags', title: 'Flags Kit'},
}

// The examples card, a row per example app, as src/scene/cards/examples draws it.
const EXAMPLES = [
  ['App Icons', 'expo-app-icons', 'A family of icons to switch'],
  ['Flags Kit', 'expo-flags-kit', 'Every flag, searchable'],
  ['Kara', 'kara-ui', 'Every component and story'],
  ['Native Icons', 'expo-native-icons', 'Material Symbols, natively'],
  ['PayPal', 'expo-paypal', 'Every flow on the sandbox'],
  ['Rich Haptics', 'expo-rich-haptics', 'Every haptic and a composer'],
  ['Speech', 'expo-speech', 'Team radio, transcribed'],
  ['Translation', 'expo-translation', '15 Wikipedias, translated'],
  ['Waveform', 'expo-waveform', 'Team radio you can scrub'],
  ['Zoom Transition', 'expo-zoom-transition', 'Photos zooming into pages'],
  ['Zyplot', 'zyplot', 'Every chart, in five apps'],
]

const ARROW = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3.25 8.75L8.5 3.5M4.5 3.25H8.75V7.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const EXAMPLES_CARD = `<div class="examples">${EXAMPLES.map(
  ([title, icon, description]) =>
    `<div class="example"><img src="/public/examples/${icon}.png" /><div class="text"><div class="ink">${title}</div><div class="description">${description}</div></div>${ARROW}</div>`
).join('')}</div>
<div class="label"><div class="title ink">Example apps</div><div class="subtitle">Every library, built with Kara</div></div>`

const COLUMN = 290
const ROW = 218
const GAP = 16
const PADDING = 2

const PROFILE = `<div class="profile">
  <img class="wordmark" src="/public/svg/wordmark.svg" />
  <div class="tagline">Libraries for <span class="ink">Expo</span></div>
  <div class="links">${['github', 'npm'].map(name => `<span class="pill"><img src="/public/svg/${name}.svg" /><span class="ink">${name === 'github' ? 'GitHub' : name}</span>${ARROW}</span>`).join('')}</div>
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
    } else if (name === 'examples') {
      tile.innerHTML = EXAMPLES_CARD
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
