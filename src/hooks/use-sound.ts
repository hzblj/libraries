'use client'

import {useMemo} from 'react'

import {useSoundContext} from '@/providers'

export type SoundPair = 'modal' | 'photos'

// Returns the open/close players for a sound pair. Kept intentionally tiny so
// components stay declarative: `const sound = useSound('modal')` then
// `sound.open()` / `sound.close()`. Muting is handled centrally in the provider.
export const useSound = (pair: SoundPair) => {
  const {play} = useSoundContext()

  return useMemo(
    () => ({
      close: () => play(pair === 'modal' ? 'modalClose' : 'photosClose'),
      open: () => play(pair === 'modal' ? 'modalOpen' : 'photosOpen'),
    }),
    [pair, play]
  )
}
