import {useMemo} from 'react'

import {Config} from '@/config'

import {openExternal} from '../../interaction'
import {useUnderlines} from '../shared'
import {TAGLINE_LINE, TAGLINE_TOP} from './styles'

export const useSubjectLink = (x: number, width: number) => {
  const [underline] = useUnderlines(1)

  return useMemo(() => {
    const link = {height: TAGLINE_LINE, width, x, y: TAGLINE_TOP}

    return {
      hotspot: {
        onClick: () => openExternal(Config.tagline.href),
        onEnter: underline.enter,
        onLeave: underline.leave,
        rect: link,
      },
      link,
      motion: underline.motion,
      underline: {height: 1.5, width, x, y: TAGLINE_TOP + TAGLINE_LINE},
    }
  }, [underline, width, x])
}
