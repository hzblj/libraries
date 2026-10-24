'use client'

import type {FC} from 'react'

import {FocusRing, PaperLayer, Surface} from '../../entity'
import {focusIds} from '../../state'
import {FootLabel} from '../shared'
import {GalleryPhoto} from './GalleryPhoto'
import {CARD, CLIP, PHOTOS, RAMP} from './panels'
import {useGalleryPanels} from './useGalleryPanels'

export const GalleryContent: FC = () => {
  const {handlers, panels} = useGalleryPanels()

  return (
    <>
      <Surface {...handlers} />
      {PHOTOS.map((src, index) => (
        <GalleryPhoto key={src} src={src} index={index} panels={panels} />
      ))}
      <PaperLayer rect={CLIP} radius={16} order={10} />
      <FootLabel label="Personal Gallery" ramp={RAMP} host={CARD} clip={CLIP} order={11} />
      <FocusRing id={focusIds.gallery} rect={CARD} radius={16} />
    </>
  )
}
