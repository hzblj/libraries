'use client'

import {createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'

export const SOUNDS = {
  modalClose: '/wav/modal-close.wav',
  modalOpen: '/wav/modal-open.wav',
  photosClose: '/wav/photos-close.wav',
  photosOpen: '/wav/photos-open.wav',
} as const

export type SoundName = keyof typeof SOUNDS

const STORAGE_KEY = 'portfolio:sound-muted'
const VOLUME = 0.6

type SoundContextValue = {
  isMuted: boolean
  play: (name: SoundName) => void
  setMuted: (muted: boolean) => void
  toggleMuted: () => void
}

const SoundContext = createContext<SoundContextValue | undefined>(undefined)

export const SoundProvider = ({children}: {children: ReactNode}) => {
  const [isMuted, setIsMuted] = useState(false)

  // Preloaded <audio> templates, one per source. Cloned on play so overlapping
  // open/close triggers never cut each other off.
  const templates = useRef<Map<SoundName, HTMLAudioElement>>(new Map())

  // Mirror of `isMuted` so the stable `play` callback reads the latest value
  // without being recreated on every toggle.
  const mutedRef = useRef(isMuted)

  useEffect(() => {
    mutedRef.current = isMuted
  }, [isMuted])

  // Restore the persisted preference on the client.
  useEffect(() => {
    try {
      setIsMuted(window.localStorage.getItem(STORAGE_KEY) === 'true')
    } catch {
      // Storage can be unavailable (private mode) — fall back to sounds on.
    }
  }, [])

  // Warm the audio cache once so the first play is instant.
  useEffect(() => {
    for (const name of Object.keys(SOUNDS) as SoundName[]) {
      if (templates.current.has(name)) {
        continue
      }

      const audio = new Audio(SOUNDS[name])
      audio.preload = 'auto'
      audio.load()
      templates.current.set(name, audio)
    }
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted)

    try {
      window.localStorage.setItem(STORAGE_KEY, String(muted))
    } catch {
      // Ignore persistence failures.
    }
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted(!mutedRef.current)
  }, [setMuted])

  const play = useCallback((name: SoundName) => {
    if (mutedRef.current || typeof window === 'undefined') {
      return
    }

    let template = templates.current.get(name)

    if (!template) {
      template = new Audio(SOUNDS[name])
      template.preload = 'auto'
      templates.current.set(name, template)
    }

    const instance = template.cloneNode() as HTMLAudioElement
    instance.volume = VOLUME
    instance.play().catch(() => {
      // Playback can reject without a prior user gesture — safe to ignore.
    })
  }, [])

  const value = useMemo<SoundContextValue>(
    () => ({isMuted, play, setMuted, toggleMuted}),
    [isMuted, play, setMuted, toggleMuted]
  )

  return <SoundContext value={value}>{children}</SoundContext>
}

export const useSoundContext = () => {
  const context = useContext(SoundContext)

  if (typeof context === 'undefined') {
    throw new Error('useSoundContext must be used within a SoundProvider')
  }

  return context
}
