'use client'

import {forwardRef} from 'react'

import {useAdaptiveGlass} from '@/hooks'
import {cn} from '@/utils'

import {iconButtonClassName, iconButtonGlyphClassName} from './icon-button'

export type ModalCloseButtonProps = {
  onClose(): void
}

/**
 * Dismisses an open card on a phone, where there is no room around it to click
 * past — the backdrop the pointer uses on a desktop is a sliver at the edges of
 * the screen, and Escape needs a keyboard.
 *
 * The same frosted pill as every other floating control rather than the solid
 * black button it used to be: it now stands next to the expand pill in
 * [ModalControlsDock], and two controls in one cluster reading as two different
 * kinds of object is the one thing that cluster cannot do. The cross is drawn
 * inline for the same reason — an `<img>` cannot follow the ink colour when the
 * adaptive glass turns over on a bright card, and would sit there white on white.
 *
 * Positioned by whatever holds it, so the outer div stays free to carry the
 * modal's fade. Its own transform would make it the containing block for
 * anything `fixed` beside it.
 */
export const ModalCloseButton = forwardRef<HTMLDivElement, ModalCloseButtonProps>(({onClose}, ref) => {
  const glass = useAdaptiveGlass<HTMLButtonElement>()

  return (
    <div ref={ref} className="md:hidden">
      <button
        ref={glass}
        onClick={onClose}
        type="button"
        aria-label="Close"
        className={cn(iconButtonClassName, 'touch-manipulation')}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconButtonGlyphClassName}>
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
})
