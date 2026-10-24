'use client'

import type {FC} from 'react'

import {useAmbientWaves} from './useAmbientWaves'
import type {WaveVariant} from './waves'

type AmbientWavesProps = {
  variant: WaveVariant
}

export const AmbientWaves: FC<AmbientWavesProps> = ({variant}) => {
  const canvas = useAmbientWaves(variant)

  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
}
