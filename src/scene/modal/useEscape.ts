import {useEffect} from 'react'

export const useEscape = (onEscape: () => void, enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const controller = new AbortController()

    document.addEventListener(
      'keydown',
      event => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onEscape()
        }
      },
      {signal: controller.signal}
    )

    return () => controller.abort()
  }, [enabled, onEscape])
}
