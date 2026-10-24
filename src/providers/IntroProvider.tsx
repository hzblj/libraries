'use client'

import {createContext, type ReactNode, useCallback, useContext, useState} from 'react'

// Scoped to the document rather than the tab, and deliberately not persisted.
// The home layout remounts on the way back from a project page, and replaying
// the reveal there reads as the site reloading under you — but a hard refresh
// is a genuine first arrival and still deserves the full intro. A module
// variable draws exactly that line; session storage would swallow both.
let hasPlayed = false

type IntroContextValue = {
  introComplete: boolean
  setIntroComplete: (complete: boolean) => void
}

const IntroContext = createContext<IntroContextValue>({
  introComplete: false,
  setIntroComplete: () => {
    // default noop
  },
})

export const useIntro = () => useContext(IntroContext)

export const IntroProvider = ({children}: {children: ReactNode}) => {
  const [introComplete, setState] = useState(hasPlayed)

  const setIntroComplete = useCallback((complete: boolean) => {
    hasPlayed = complete
    setState(complete)
  }, [])

  return <IntroContext value={{introComplete, setIntroComplete}}>{children}</IntroContext>
}
