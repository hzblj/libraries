'use client'

import Link from 'next/link'
import type {FC} from 'react'

import {iconButtonClassName, iconButtonGlyphClassName, modalControlClassName} from '@/components/icon-button'
import {useAdaptiveGlass} from '@/hooks/use-adaptive-glass'
import {cn} from '@/utils'

import {useExpandClick} from './useExpandClick'

type ExpandLinkProps = {
  href: string
  label: string
  onExpand: (href: string) => void
}

export const ExpandLink: FC<ExpandLinkProps> = ({href, label, onExpand}) => {
  const glass = useAdaptiveGlass<HTMLAnchorElement>()
  const handleClick = useExpandClick(href, onExpand)

  return (
    <Link
      ref={glass}
      href={href}
      onClick={handleClick}
      aria-label={`Open ${label}`}
      title="Open full page"
      className={cn(iconButtonClassName, modalControlClassName)}
    >
      <span className={cn('relative', iconButtonGlyphClassName)}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" data-glyph="expand" className="absolute inset-0">
          <path
            d="M14 4h6v6M20 4l-7.25 7.25"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 20H4v-6M4 20l7.25-7.25"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          data-glyph="collapse"
          className="absolute inset-0 opacity-0"
        >
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
      </span>
    </Link>
  )
}
