import {use, useMemo} from 'react'

import {loadFonts, measureText, type TextStyle} from '../graphics'

export type SplitWord = {word: string; offset: number}

export const splitWords = (text: string) => text.split(' ')

export const useSplitWords = (text: string, style: TextStyle): SplitWord[] => {
  use(loadFonts())

  return useMemo(() => {
    let prefix = ''

    return splitWords(text).map(word => {
      const offset = measureText(prefix, style)
      prefix = `${prefix}${word} `

      return {offset, word}
    })
  }, [style, text])
}
