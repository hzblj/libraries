import {use, useMemo} from 'react'

import {Config} from '@/config'

import {loadFonts, measureText} from '../../graphics'
import {NAME, SUBJECT, TAGLINE, WIDTH} from './styles'

const SPACE = 4

const centered = (width: number) => (WIDTH - width) / 2

export const useProfileLayout = () => {
  use(loadFonts())

  return useMemo(() => {
    const prefix = measureText(Config.tagline.prefix, TAGLINE)
    const taglineX = centered(prefix + SPACE + measureText(Config.tagline.subject, SUBJECT))

    return {
      nameX: centered(measureText(Config.handle, NAME)),
      subjectX: taglineX + prefix + SPACE,
      taglineX,
    }
  }, [])
}
