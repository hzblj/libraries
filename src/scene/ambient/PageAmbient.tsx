'use client'

import type {FC} from 'react'

import {cn} from '@/utils'

import {AmbientWaves} from './AmbientWaves'
import {usePageAmbient} from './usePageAmbient'
import {AMBIENT_VARIANTS} from './variants'

export const PageAmbient: FC = () => {
  const {attach, initialOpacity, variant} = usePageAmbient()
  const {vignettes} = AMBIENT_VARIANTS[variant]

  return (
    <div
      ref={attach}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden bg-[#08080b]"
      style={{opacity: initialOpacity}}
    >
      <AmbientWaves variant={variant} />
      <div className="scene-grain absolute inset-0 opacity-[0.05]" />
      {vignettes.map(vignette => (
        <div key={vignette} className={cn('absolute inset-0', vignette)} />
      ))}
    </div>
  )
}
