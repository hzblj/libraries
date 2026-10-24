// Draws the cards' artwork in public/libraries. Each page in ./cards is laid out
// at its card's size and photographed by headless Chrome at 2x, driven over the
// DevTools protocol. A page that sets `window.DURATION` and `window.frame(t)` is
// an animation: it is photographed frame by frame and encoded into the clip the
// card plays on hover, with the clip's first frame as the still. The zoom card's
// clip is composited instead, from the Kara website's iOS and Android recordings.
// The sources live in the repositories beside this one: Kara's component shots,
// recordings and app icons in ../kara-ui, the portfolio's shots in ../portfolio.
// Only drawing the artwork again needs them; what it draws is committed.
//
//   node artwork/render.mjs            every card
//   node artwork/render.mjs flags      only the pages whose name contains "flags"
//
// Needs Google Chrome and ffmpeg.

import {execFileSync, spawn} from 'node:child_process'
import {mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {createServer} from 'node:http'
import {createRequire} from 'node:module'
import {tmpdir} from 'node:os'
import {dirname, extname, join, normalize, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const HERE = dirname(fileURLToPath(import.meta.url))
const APP = resolve(HERE, '..')
const KARA = resolve(APP, '../kara-ui')
const MEDIA = join(KARA, 'apps/website/public/media')
const PORTFOLIO = resolve(APP, '../portfolio/public')
const BUILD = join(HERE, 'build')
const OUT = join(APP, 'public/libraries')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SCALE = 2
const FPS = 30

const SIZES = {
  large: {height: 452, width: 596},
  // The link preview: 1200×630 is what every platform asks for, at 1x.
  og: {height: 630, scale: 1, width: 1200},
  small: {height: 218, width: 290},
}

// Pages whose picture belongs somewhere other than public/libraries.
const OUTPUTS = {
  'og-image': join(APP, 'public/png/og-image.png'),
}

// The pages and the size of the card each one paints.
const CARDS = {
  'expo-app-icons': 'small',
  'expo-flags-kit': 'small',
  'expo-rich-haptics': 'small',
  'expo-zoom-transition': 'large',
  'kara-ui': 'large',
  'og-image': 'og',
  portfolio: 'small',
  'react-native-expo-monorepo': 'small',
  zyplot: 'small',
}

// Real kara components, as the website's shots photographed them, cut to their own bounds.
const CAPTURES = ['button', 'chip', 'list', 'segmented-control', 'slider', 'stepper', 'switch']

const TYPES = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

// What the pages may load: this app's public files and artwork, and kara's own
// app icons from the example.
const ROOTS = {
  '/apps-example/': join(KARA, 'apps/example/assets/'),
  '/artwork/': join(APP, 'artwork/'),
  '/public/': join(APP, 'public/'),
}

const serve = () =>
  new Promise(done => {
    const server = createServer((request, response) => {
      const path = normalize(decodeURIComponent(new URL(request.url, 'http://x').pathname))
      const root = Object.keys(ROOTS).find(prefix => path.startsWith(prefix))

      try {
        const body = readFileSync(join(ROOTS[root], path.slice(root.length)))
        response.writeHead(200, {'content-type': TYPES[extname(path)] ?? 'application/octet-stream'})
        response.end(body)
      } catch {
        response.writeHead(404)
        response.end()
      }
    })

    server.listen(0, () => done(server))
  })

// Where each capture's component sits in the website's 1200×900 still, which is
// also where it sits, at the recording's own scale, in its clip.
const BOUNDS = {}

const prepareCaptures = async () => {
  mkdirSync(join(BUILD, 'captures'), {recursive: true})

  for (const name of CAPTURES) {
    const {trimOffsetLeft, trimOffsetTop, width, height} = await sharp(join(MEDIA, 'ios/dark', `${name}.webp`))
      .trim({background: '#000000', threshold: 6})
      .png()
      .toFile(join(BUILD, 'captures', `${name}.png`))

    BOUNDS[name] = {height, left: -trimOffsetLeft, top: -trimOffsetTop, width}
  }
}

// Android's themed icon is the monochrome layer in one tone of the wallpaper's
// palette: the adaptive foreground's shape, filled.
const prepareIcons = async () => {
  mkdirSync(join(BUILD, 'icons'), {recursive: true})

  const foreground = join(KARA, 'apps/example/assets/adaptive-icon.png')
  const {width, height} = await sharp(foreground).metadata()

  await sharp({create: {background: '#7a2e00', channels: 4, height, width}})
    .composite([{blend: 'dest-in', input: foreground}])
    .png()
    .toFile(join(BUILD, 'icons', 'themed.png'))
}

// The portfolio's shots as its grid shows them: the photographs, and a frame a
// second into each recording (the first is often still black), all small enough
// for a cell a fifth of its size. The gallery card shows its first photo.
const preparePortfolio = async () => {
  const out = join(BUILD, 'portfolio')
  mkdirSync(out, {recursive: true})

  for (const file of readdirSync(join(PORTFOLIO, 'jpg')).filter(name => name.startsWith('shot-'))) {
    await sharp(join(PORTFOLIO, 'jpg', file))
      .resize({width: 480})
      .png()
      .toFile(join(out, file.replace('.jpg', '.png')))
  }

  for (const file of readdirSync(join(PORTFOLIO, 'mp4'))) {
    ffmpeg(
      '-ss',
      '1',
      '-i',
      join(PORTFOLIO, 'mp4', file),
      '-frames:v',
      '1',
      '-vf',
      'scale=480:-2',
      join(out, file.replace('.mp4', '.png'))
    )
  }

  await sharp(join(PORTFOLIO, 'png', 'gallery-1.png'))
    .resize({width: 480})
    .png()
    .toFile(join(out, 'gallery.png'))
}

// One headless Chrome for every page, with its own profile: without one it hands
// the page to the Chrome already open and never answers.
const launch = async () => {
  const profile = mkdtempSync(join(tmpdir(), 'artwork-chrome-'))
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--hide-scrollbars',
    '--remote-debugging-port=0',
    'about:blank',
  ])

  const endpoint = await new Promise((done, fail) => {
    let log = ''
    chrome.stderr.on('data', chunk => {
      log += chunk
      const match = log.match(/DevTools listening on (ws:\/\/\S+)/)

      if (match) {
        done(match[1])
      }
    })
    chrome.on('exit', () => fail(new Error(`Chrome exited:\n${log}`)))
  })

  const socket = new WebSocket(endpoint)
  await new Promise(done => socket.addEventListener('open', done, {once: true}))

  let last = 0
  const pending = new Map()
  const listeners = new Set()

  socket.addEventListener('message', ({data}) => {
    const message = JSON.parse(data)

    if (message.id) {
      pending.get(message.id)?.(message)
      pending.delete(message.id)
    } else {
      for (const listener of listeners) {
        listener(message)
      }
    }
  })

  const send = (method, params = {}, sessionId) =>
    new Promise((done, fail) => {
      const id = ++last
      pending.set(id, message =>
        message.error ? fail(new Error(`${method}: ${message.error.message}`)) : done(message.result)
      )
      socket.send(JSON.stringify({id, method, params, sessionId}))
    })

  const {targetId} = await send('Target.createTarget', {url: 'about:blank'})
  const {sessionId} = await send('Target.attachToTarget', {flatten: true, targetId})
  const page = (method, params) => send(method, params, sessionId)

  const next = method =>
    new Promise(done => {
      const listener = message => {
        if (message.method === method && message.sessionId === sessionId) {
          listeners.delete(listener)
          done(message.params)
        }
      }
      listeners.add(listener)
    })

  const evaluate = async expression => {
    const {result, exceptionDetails} = await page('Runtime.evaluate', {
      awaitPromise: true,
      expression,
      returnByValue: true,
    })

    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
    }

    return result.value
  }

  await page('Page.enable')

  return {
    close: async () => {
      socket.close()
      await new Promise(done => {
        chrome.once('exit', done)
        chrome.kill()
      })
      rmSync(profile, {force: true, maxRetries: 5, recursive: true})
    },
    evaluate,
    next,
    page,
  }
}

const SETTLED = `Promise.all([
  document.fonts.ready,
  ...[...document.images].map(image => image.decode().catch(() => undefined)),
]).then(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))`

const open = async (browser, url, {width, height, scale = SCALE}) => {
  await browser.page('Emulation.setDeviceMetricsOverride', {deviceScaleFactor: scale, height, mobile: false, width})
  const loaded = browser.next('Page.loadEventFired')
  await browser.page('Page.navigate', {url})
  await loaded
  await browser.evaluate(SETTLED)
}

const shoot = async (browser, out) => {
  const {data} = await browser.page('Page.captureScreenshot', {format: 'png'})
  writeFileSync(out, Buffer.from(data, 'base64'))
}

const ffmpeg = (...args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args])

// The same picture as an H.264 mp4 and a VP9 webm (the card offers both), and
// the mp4's first frame as the still, so hovering hands over without a jump.
const encode = (input, base) => {
  ffmpeg(...input, '-c:v', 'libx264', '-crf', '22', '-preset', 'slow', '-movflags', '+faststart', '-an', `${base}.mp4`)
  ffmpeg(...input, '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1', '-an', `${base}.webm`)
  ffmpeg('-i', `${base}.mp4`, '-frames:v', '1', '-update', '1', `${base}.png`)
}

// A page may ask for more than FPS (`window.FPS`) where its motion is quick enough to stutter at 30.
const animate = async (browser, name, duration) => {
  const frames = join(BUILD, 'frames', name)
  const fps = (await browser.evaluate('window.FPS')) ?? FPS
  rmSync(frames, {force: true, recursive: true})
  mkdirSync(frames, {recursive: true})

  for (let index = 0; index < Math.round(duration * fps); index++) {
    await browser.evaluate(`window.frame(${index / fps}); new Promise(done => requestAnimationFrame(done))`)
    await shoot(browser, join(frames, `${String(index).padStart(4, '0')}.png`))
  }

  encode(['-framerate', String(fps), '-i', join(frames, '%04d.png'), '-pix_fmt', 'yuv420p'], join(OUT, name))
}

const probeWidth = file =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width', '-of', 'csv=p=0', file]).toString())

// A page that marks captures with `data-clip` (and `data-start`, in seconds) has
// each of them replaced by the component's own recording from the website,
// cropped to the same bounds and laid exactly over it. A clip waits on its first
// frame until it starts and holds its last (the same frame: the website cuts
// them to loop) until the page's DURATION is up, so the whole card loops too.
const composeClips = async (browser, name, {width, height}, duration) => {
  const marks = await browser.evaluate(`[...document.querySelectorAll('[data-clip]')].map(element => {
    const {x, y, width, height} = element.getBoundingClientRect()
    return {clip: element.dataset.clip, height, start: Number(element.dataset.start ?? 0), width, x, y}
  })`)
  const backdrop = join(BUILD, `${name}-backdrop.png`)
  await shoot(browser, backdrop)

  const px = value => Math.round(value * SCALE)
  const filters = [`[0:v]fps=${FPS},scale=${px(width)}:${px(height)},format=rgba,trim=duration=${duration}[base]`]
  const inputs = ['-loop', '1', '-framerate', String(FPS), '-i', backdrop]
  let last = 'base'

  marks.forEach(({clip, start, x, y, width: w, height: h}, index) => {
    const file = join(MEDIA, 'ios/dark', `${clip}.mp4`)
    const scale = probeWidth(file) / 1200
    const bounds = BOUNDS[clip]
    const crop = [bounds.width, bounds.height, bounds.left, bounds.top].map(value => Math.round(value * scale))
    inputs.push('-i', file)
    filters.push(
      `[${index + 1}:v]fps=${FPS},crop=${crop.join(':')},scale=${px(w)}:${px(h)},tpad=start_mode=clone:start_duration=${start}:stop_mode=clone:stop_duration=${duration},trim=duration=${duration},setpts=PTS-STARTPTS[clip${index}]`,
      `[${last}][clip${index}]overlay=${px(x)}:${px(y)}[over${index}]`
    )
    last = `over${index}`
  })

  filters.push(`[${last}]format=yuv420p[out]`)
  encode([...inputs, '-filter_complex', filters.join(';'), '-map', '[out]', '-t', String(duration)], join(OUT, name))
}

// Two phones side by side, iOS and Android, each playing its recording inside
// the screen the still draws. PHONE is the boxes in expo-zoom-transition.html.
const PHONE = {android: 316, bezel: 4, height: 372, ios: 104, radius: 30, top: 20, width: 176}

const composeZoomClip = async (still, {width, height}) => {
  const px = value => value * SCALE
  const screen = {
    height: px(PHONE.height - PHONE.bezel * 2),
    radius: px(PHONE.radius - PHONE.bezel),
    width: px(PHONE.width - PHONE.bezel * 2),
  }
  const mask = join(BUILD, 'screen-mask.png')
  const duration = 6

  await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${screen.width}" height="${screen.height}"><rect width="100%" height="100%" fill="#000"/><rect width="100%" height="100%" rx="${screen.radius}" fill="#fff"/></svg>`
    )
  )
    .greyscale()
    .png()
    .toFile(mask)

  const clip = (input, label) =>
    `[${input}:v]fps=${FPS},scale=${screen.width}:${screen.height}:force_original_aspect_ratio=increase,crop=${screen.width}:${screen.height},tpad=stop_mode=clone:stop_duration=${duration},trim=duration=${duration},format=rgba[${label}raw];[3:v]format=gray[${label}mask];[${label}raw][${label}mask]alphamerge[${label}]`

  const filter = [
    `[0:v]fps=${FPS},scale=${px(width)}:${px(height)},format=rgba,trim=duration=${duration}[bg]`,
    clip(1, 'ios'),
    clip(2, 'android'),
    `[bg][ios]overlay=${px(PHONE.ios + PHONE.bezel)}:${px(PHONE.top + PHONE.bezel)}[a]`,
    `[a][android]overlay=${px(PHONE.android + PHONE.bezel)}:${px(PHONE.top + PHONE.bezel)},format=yuv420p[out]`,
  ].join(';')

  encode(
    [
      '-loop',
      '1',
      '-framerate',
      String(FPS),
      '-i',
      still,
      '-i',
      join(MEDIA, 'ios/dark/zoom-transition.mp4'),
      '-i',
      join(MEDIA, 'android/dark/zoom-transition.mp4'),
      '-loop',
      '1',
      '-i',
      mask,
      '-filter_complex',
      filter,
      '-map',
      '[out]',
      '-t',
      String(duration),
    ],
    join(OUT, 'expo-zoom-transition')
  )
}

const only = process.argv[2]
const server = await serve()
const browser = await launch()
const base = `http://localhost:${server.address().port}/artwork/cards`

await prepareCaptures()
await prepareIcons()

if (!only || 'portfolio'.includes(only)) {
  await preparePortfolio()
}

try {
  const names = readdirSync(join(HERE, 'cards'))
    .filter(file => file.endsWith('.html'))
    .map(file => file.slice(0, -'.html'.length))

  for (const name of names) {
    if (only && !name.includes(only)) {
      continue
    }

    // A sketch beside a card, `expo-rich-haptics.b.html`, takes the card's size and lands in build/.
    const size = SIZES[CARDS[name.split('.')[0]] ?? 'small']
    const isCard = name in CARDS
    const still = OUTPUTS[name] ?? join(isCard ? OUT : BUILD, `${name}.png`)

    await open(browser, `${base}/${name}.html`, size)
    const duration = await browser.evaluate('window.DURATION ?? 0')

    const clips = await browser.evaluate("document.querySelectorAll('[data-clip]').length")

    if (name === 'expo-zoom-transition') {
      const backdrop = join(BUILD, `${name}-backdrop.png`)
      await shoot(browser, backdrop)
      await composeZoomClip(backdrop, size)
    } else if (duration && isCard && clips) {
      await composeClips(browser, name, size, duration)
    } else if (duration && isCard) {
      await animate(browser, name, duration)
    } else {
      if (duration) {
        await browser.evaluate('window.frame(0)')
      }

      await shoot(browser, still)
    }

    console.log(`${name} -> ${still.replace(`${APP}/`, '')}${duration ? ` (+ ${duration}s clip)` : ''}`)
  }
} finally {
  await browser.close()
  server.close()
}
