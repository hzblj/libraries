'use client'

import {type FC, useMemo} from 'react'

import {Layer, type Motion} from '../../entity'
import {useImage} from '../../graphics'
import {CARD, CLIP, type Panel, panelSpan, WIDTH} from './panels'

type GalleryPhotoProps = {
  src: string
  index: number
  panels: Panel[]
}

export const GalleryPhoto: FC<GalleryPhotoProps> = ({src, index, panels}) => {
  const map = useImage(src, 640)

  const motion = useMemo<Motion>(
    () => ({
      get opacity() {
        return panels[index].opacity
      },
      get width() {
        return panelSpan(panels, index).width / WIDTH
      },
      get x() {
        return panelSpan(panels, index).x
      },
    }),
    [index, panels]
  )

  return <Layer rect={CARD} map={map} clip={CLIP} clipRadius={16} motion={motion} order={1 + index} />
}
