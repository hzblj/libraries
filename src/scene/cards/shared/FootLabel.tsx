'use client'

import {type FC, useMemo} from 'react'

import {Layer} from '../../entity'
import {TEXT_ALPHA_GAMMA, useText} from '../../graphics'
import type {Rect} from '../../grid'
import {FOOT_LABEL, FOOT_LABEL_OPACITY, footLabelRect, footRampRect} from './foot'
import {type Ramp, useRampTexture} from './useRampTexture'

type FootLabelProps = {
  label: string
  ramp: Ramp
  host: Rect
  clip: Rect
  order: number
}

export const FootLabel: FC<FootLabelProps> = ({label, ramp, host, clip, order}) => {
  const map = useRampTexture(ramp)
  const text = useText(label, FOOT_LABEL)
  const rampRect = useMemo(() => footRampRect(host), [host])
  const labelRect = useMemo(() => footLabelRect(host, text), [host, text])

  return (
    <>
      <Layer rect={rampRect} map={map} fit="fill" clip={clip} clipRadius={16} order={order} />
      <Layer
        rect={labelRect}
        map={text.texture}
        fit="fill"
        alphaGamma={TEXT_ALPHA_GAMMA}
        opacity={FOOT_LABEL_OPACITY}
        order={order + 1}
      />
    </>
  )
}
