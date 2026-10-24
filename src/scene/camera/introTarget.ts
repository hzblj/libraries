import {uploadsSettled} from '../graphics'
import {getAreaRect} from '../grid'
import {nearestScreenRect, view} from './view'

const QUIET_FRAMES = 8
const QUIET_FRAME = 25
const MAX_WAIT = 3000

const profile = getAreaRect('profile')

let firstPoll = 0
let lastPoll = 0
let quiet = 0

const settled = (now: number) => {
  firstPoll ||= now
  quiet = now - lastPoll < QUIET_FRAME ? quiet + 1 : 0
  lastPoll = now

  return (uploadsSettled() && quiet >= QUIET_FRAMES) || now - firstPoll > MAX_WAIT
}

export const introTarget = () => {
  if (view.width === 0 || !settled(performance.now())) {
    return null
  }

  const {x, y, width, height} = nearestScreenRect(profile)

  return {height, left: x, top: y, width}
}
