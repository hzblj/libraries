'use client'

import {type FC, useLayoutEffect, useRef} from 'react'

import {handBackToModal, pageArrival, settlePageArrival} from '@/lib/page-handoff'
import {findScroller} from '@/utils'

const readScroll = (scroller: HTMLElement | undefined) => scroller?.scrollTop ?? window.scrollY

export const PageArrival: FC = () => {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const scroller = findScroller(ref.current)
    const target = scroller ?? window
    const arrival = pageArrival()
    settlePageArrival()

    if (arrival) {
      target.scrollTo({top: arrival.scroll})
    }

    let last = readScroll(scroller)
    const onScroll = () => {
      last = readScroll(scroller)
    }

    target.addEventListener('scroll', onScroll, {passive: true})

    return () => {
      target.removeEventListener('scroll', onScroll)
      handBackToModal(last)
    }
  }, [])

  return <div ref={ref} hidden />
}
