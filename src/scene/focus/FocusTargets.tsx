'use client'

import {type FC, useMemo} from 'react'

import {Config} from '@/config'
import {entries} from '@/db'

import {useSceneStore} from '../state'
import {FocusItem} from './FocusItem'
import {focusTargetsOf} from './targets'

const FALLBACK = 'fixed inset-0 z-10 overflow-y-auto px-6 py-24'

export const FocusTargets: FC = () => {
  const failed = useSceneStore(state => state.failed)
  const cardOpen = useSceneStore(state => state.card !== null)
  const targets = useMemo(() => focusTargetsOf(entries), [])

  return (
    <nav aria-label="Portfolio" className={failed ? FALLBACK : 'sr-only'} inert={cardOpen}>
      <div className="mx-auto flex max-w-[512px] flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-[18px] font-medium text-white">{Config.fullName}</h1>
          <p className="text-[15px] text-white/50">
            {Config.tagline.prefix} {Config.tagline.subject}
          </p>
        </header>
        <ul className="flex flex-col gap-2">
          {targets.map(target => (
            <li key={target.id}>
              <FocusItem target={target} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
