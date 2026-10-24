'use client'

import {useEffect, useState} from 'react'

export const useHasHover = () => {
  const [hasHover, setHasHover] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(hover: hover)')
      setHasHover(mq.matches)
    }
  }, [])

  return hasHover
}
