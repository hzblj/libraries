'use client'

import {type FC, useMemo} from 'react'

import type {EntryCV} from '@/db'

import {FocusRing, Layer, Surface, useEntity} from '../../entity'
import {focusIds} from '../../state'
import {FootLabel} from '../shared'
import {CV_BORDER_ANGLE, cvLabelClip, cvLabelHost, cvPreviewClip, cvPreviewRect, RAMP} from './preview'
import {useCvPeek} from './useCvPeek'
import {useCvPreview} from './useCvPreview'

type CVContentProps = {
  entry: EntryCV
}

export const CVContent: FC<CVContentProps> = ({entry}) => {
  const {size} = useEntity()
  const preview = useCvPreview()
  const {handlers, scroll} = useCvPeek(entry)

  const rect = useMemo(cvPreviewRect, [])
  const card = useMemo(() => ({x: 0, y: 0, ...size}), [size])
  const clip = useMemo(() => cvPreviewClip(size.width), [size])
  const labelHost = useMemo(() => cvLabelHost(size), [size])
  const labelClip = useMemo(() => cvLabelClip(size), [size])

  return (
    <>
      <Surface border={CV_BORDER_ANGLE} {...handlers} />
      <Layer rect={rect} map={preview} fit="fill" clip={clip} clipRadius={16} motion={scroll} order={1} />
      <FootLabel label="CV" ramp={RAMP} host={labelHost} clip={labelClip} order={2} />
      <FocusRing id={focusIds.cv} rect={card} radius={16} />
    </>
  )
}
