'use client'

import Link from 'next/link'
import {type FC, type MouseEvent, useCallback} from 'react'

import {useAdaptiveGlass} from '@/hooks'
// Straight from the module rather than `@/providers`: /ico is one card and this
// pill, and the barrel would drag the camera and sound providers into its bundle.
import {useCanGoBack, useViewTransitionNavigate} from '@/providers/NavigationProvider'
import {cn} from '@/utils'

import {iconButtonClassName, iconButtonGlyphClassName, pageControlClassName} from './icon-button'

export type PageCloseLinkProps = {
  className?: string
}

/**
 * The same frosted pill as [CardCollapseLink], carrying a cross instead of the
 * inward arrows. No card on the grid expands into /ico — it is landed on cold,
 * from an invoice, a shared link or the pill in the dock — so there is nothing
 * for the arrows to collapse back into, and "close this page" is the honest
 * affordance.
 *
 * No shared element to morph, but the pill in the dock comes in through the
 * forward view transition, so this goes back out through its mirror rather than
 * hard-cutting. Goes back through history when there is somewhere to go back to,
 * so the grid is found as it was left; `/` is the destination on a cold landing,
 * from an invoice or a shared link, where there is nothing behind.
 */
export const PageCloseLink: FC<PageCloseLinkProps> = ({className}) => {
  const navigate = useViewTransitionNavigate()
  const canGoBack = useCanGoBack()
  const glass = useAdaptiveGlass<HTMLAnchorElement>()

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // New tab, new window, download — leave those to the browser.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
      }

      event.preventDefault()
      navigate(canGoBack() ? {direction: 'back'} : {direction: 'back', to: '/'})
    },
    [canGoBack, navigate]
  )

  return (
    <Link
      ref={glass}
      href="/"
      onClick={handleClick}
      aria-label="Back to the portfolio"
      title="Back to the portfolio"
      className={cn(iconButtonClassName, pageControlClassName, className)}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconButtonGlyphClassName}>
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </Link>
  )
}
