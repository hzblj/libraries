'use client'

import type {FC} from 'react'

import {iconButtonClassName, iconButtonGlyphClassName, modalControlClassName} from '@/components/icon-button'
import {useAdaptiveGlass} from '@/hooks'
import {cn} from '@/utils'

import type {OpenCard} from '../state'

// On a phone it stands in the dock beside the close button, so it is cut from
// the same round glass and carries only the mark, drawn inline so it follows the
// ink when the adaptive glass turns over. From `md` up it is the labelled pill
// in the top right corner, set like the profile's links: mark, name, small arrow.
export const CardExpand: FC<{card: OpenCard; onExpand: (href: string) => void}> = ({card}) => {
  const glass = useAdaptiveGlass<HTMLAnchorElement>()

  return (
    <a
      ref={glass}
      href={card.kind === 'shot' ? `https://github.com/hzblj/${card.entry.slug}` : 'https://github.com/hzblj'}
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub"
      className={cn(
        iconButtonClassName,
        modalControlClassName,
        'touch-manipulation md:size-auto md:gap-2 md:px-5 md:py-3 md:text-sm'
      )}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className={cn(iconButtonGlyphClassName, 'md:size-4 md:opacity-85')}>
        <path
          fill="currentColor"
          d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
        />
      </svg>
      <span className="hidden md:inline">GitHub</span>
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="hidden size-2.5 md:block">
        <path
          d="M3.25 8.75L8.5 3.5M4.5 3.25H8.75V7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}
