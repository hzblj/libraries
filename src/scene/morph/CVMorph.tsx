'use client'

import type {FC} from 'react'

import {SafeSuspense} from '../boundary'
import {CV_BORDER_ANGLE} from '../cards'
import type {CardSource} from '../state'
import {MorphFoot} from './MorphFoot'
import {MorphPreview} from './MorphPreview'
import {MorphSurface} from './MorphSurface'
import {useMorphFrame} from './useMorphFrame'

type CVMorphProps = {
  source: CardSource
}

export const CVMorph: FC<CVMorphProps> = ({source}) => {
  const frame = useMorphFrame()

  return (
    <>
      <MorphSurface source={source} frame={frame} fill="card" border={CV_BORDER_ANGLE} />
      <SafeSuspense fallback={null}>
        <MorphPreview source={source} frame={frame} />
        <MorphFoot source={source} frame={frame} />
      </SafeSuspense>
    </>
  )
}
