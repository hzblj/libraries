import {type MouseEvent, useCallback} from 'react'

export const useExpandClick = (href: string, onExpand: (href: string) => void) =>
  useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
      }

      event.preventDefault()
      onExpand(href)
    },
    [href, onExpand]
  )
