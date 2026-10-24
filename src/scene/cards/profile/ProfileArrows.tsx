'use client'

import {type FC, useMemo} from 'react'

import {Layer, type Motion} from '../../entity'
import {useSvg} from '../../graphics'
import {HINTS_TOP} from './styles'
import {useArrowsNudge} from './useArrowsNudge'

const SIZE = {height: 24, width: 24}
const BLEED = 16

type ProfileArrowsProps = {
  x: number
  entrance: Motion
}

export const ProfileArrows: FC<ProfileArrowsProps> = ({x, entrance}) => {
  const map = useSvg('/svg/arrows.svg', SIZE)
  const nudge = useArrowsNudge()
  const rect = useMemo(() => ({...SIZE, x: x - 4, y: HINTS_TOP + 2}), [x])

  return <Layer rect={rect} map={map} fit="fill" order={1} motion={[nudge, entrance]} bleed={BLEED} />
}
