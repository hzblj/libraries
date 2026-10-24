// Draws the site's icons from artwork/favicon.svg, an "h" in Kara's orange: a
// stem and a half-circle shoulder, one stroke width with round ends, on a
// transparent ground the way Kara's own icon is, filling most of the square.
//
//   node artwork/favicon.mjs

import {readFileSync, writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const HERE = dirname(fileURLToPath(import.meta.url))
const APP = resolve(HERE, '..')
const MARK = readFileSync(join(HERE, 'favicon.svg'), 'utf8')

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()

// An .ico is a directory of images; modern ones hold PNGs as they are.
const ico = images => {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = 6 + 16 * images.length
  const entries = images.map(({size, data}) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size % 256, 0)
    entry.writeUInt8(size % 256, 1)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...images.map(({data}) => data)])
}

const out = name => join(APP, name)

writeFileSync(out('public/favicon-16x16.png'), await png(MARK, 16))
writeFileSync(out('public/favicon-32x32.png'), await png(MARK, 32))
writeFileSync(out('public/apple-touch-icon.png'), await png(MARK, 180))
writeFileSync(out('public/android-chrome-192x192.png'), await png(MARK, 192))
writeFileSync(out('public/android-chrome-512x512.png'), await png(MARK, 512))
writeFileSync(
  out('app/favicon.ico'),
  ico(await Promise.all([16, 32, 48].map(async size => ({data: await png(MARK, size), size}))))
)

console.log('icons drawn')
