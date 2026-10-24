import type {FC} from 'react'

import {cn} from '@/utils'

export const WORD_SELECTOR = '[data-word]'

export type SplitWordsProps = {
  children: string
  className?: string
}

export const SplitWords: FC<SplitWordsProps> = ({children, className}) => {
  const parts = children.split(/(\s+)/)

  return (
    <>
      {parts.map((part, index) =>
        part.trim() === '' ? (
          part
        ) : (
          <span key={index.toString()} data-word="true" className={cn('inline-block', className)}>
            {part}
          </span>
        )
      )}
    </>
  )
}
