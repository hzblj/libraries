'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {type FC, type MouseEvent, useCallback} from 'react'

import {useAdaptiveGlass} from '@/hooks'
import {useCanGoBack} from '@/providers/NavigationProvider'
import {cn} from '@/utils'

import {iconButtonClassName, iconButtonGlyphClassName, pageControlClassName} from './icon-button'

export type CardCollapseLinkProps = {
  className?: string
}

/**
 * The counterpart to the expand pill on an open card: same pill, same corner,
 * arrows turned inwards.
 *
 * The grid is still mounted under the page with the card parked in this page's
 * layout, so going back only uncovers it and it takes the card back into its
 * modal from exactly here.
 *
 * Goes back through history when there is somewhere to go back to, so returning
 * lands on the grid exactly as it was left — panned, zoomed and past its intro —
 * instead of pushing a fresh `/` that mounts the whole camera again. Keeps the
 * `/` href for cold landings, crawlers and middle-clicks.
 */
export const CardCollapseLink: FC<CardCollapseLinkProps> = ({className}) => {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const glass = useAdaptiveGlass<HTMLAnchorElement>()

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // New tab, new window, download — leave those to the browser.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
      }

      event.preventDefault()

      if (canGoBack()) {
        router.back()
      } else {
        router.push('/')
      }
    },
    [canGoBack, router]
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
        <path
          d="M20 10h-6V4M20 4l-6 6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 14h6v6M4 20l6-6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
