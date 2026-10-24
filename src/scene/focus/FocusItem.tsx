'use client'

import type {FC} from 'react'

import type {FocusTarget} from './targets'
import {useFocusHandlers} from './useFocusHandlers'

const LINK =
  'cursor-pointer text-[15px] text-white/80 underline decoration-white/30 underline-offset-4 hover:decoration-white/70'

type FocusItemProps = {
  target: FocusTarget
}

export const FocusItem: FC<FocusItemProps> = ({target}) => {
  const handlers = useFocusHandlers(target)

  if (target.kind === 'gallery') {
    return (
      <button type="button" className={LINK} {...handlers}>
        {target.label}
      </button>
    )
  }

  if (target.kind === 'external') {
    return (
      <a href={target.href} target="_blank" rel="noopener noreferrer" tabIndex={0} className={LINK} {...handlers}>
        {target.label}
      </a>
    )
  }

  return (
    <a href={target.href} tabIndex={0} className={LINK} {...handlers}>
      {target.label}
    </a>
  )
}
