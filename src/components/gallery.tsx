'use client'

import {gsap} from 'gsap'
import Image from 'next/image'
import {createRef, type FC, forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import ReactDOM from 'react-dom'

import {useSound} from '@/hooks'
import {toPx} from '@/utils'

import {ModalCloseButton} from './modal-close-button'
import {ModalControlsDock} from './modal-controls-dock'

const indexShifter: Record<number, number> = {
  0: 0,
  1: 315,
  2: 630,
}

const DATA = Array.from({length: 12}, (_, i) => `/png/gallery-${i + 1}.png`)

type GalleryItemProps = {
  columnIndex: number
  rowIndex: number
  index: number
  columns: number
}

const GalleryItem = forwardRef<HTMLDivElement, GalleryItemProps>(({index, columnIndex, rowIndex, columns}, ref) => {
  const marginTop = useMemo(() => {
    const invertedColumnIndex = columns - 1 - columnIndex

    return rowIndex === 0 ? indexShifter[columnIndex] : -indexShifter[invertedColumnIndex]
  }, [columnIndex, rowIndex, columns])

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[356px] h-auto aspect-[356/630] pointer-events-auto opacity-0 will-change-[opacity,transform] transform-gpu overflow-hidden rounded-2xl border border-solid border-white/15 bg-black"
      style={{marginTop: toPx(marginTop)}}
    >
      <Image
        src={DATA[index]}
        loading="lazy"
        alt={`Gallery image ${index + 1}`}
        width={356}
        height={630}
        className="h-full w-full object-cover rounded-[inherit]"
        style={{objectFit: 'cover'}}
        draggable={false}
      />
      {/* The wrapper is a stacking context (transform-gpu), so the grain blends
          with the photo rather than with the backdrop behind it. */}
      <div className="absolute inset-0 z-10 texture-paper" />
    </div>
  )
})

export type GalleryProps = {
  isOpen: boolean
  onClose(): void
}

export const Gallery: FC<GalleryProps> = ({isOpen, onClose}) => {
  const modalRoot = document.getElementById('main')!
  const cardRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLDivElement>(null)
  const itemRefs = useMemo(() => DATA.map(() => createRef<HTMLDivElement>()), [])

  const [mounted, setMounted] = useState(isOpen)
  const [columns, setColumns] = useState(3)

  const sound = useSound('photos')

  const startClose = useCallback(() => {
    if (!cardRef.current || !backdropRef.current || !closeButtonRef.current) {
      return
    }

    sound.close()

    const items = itemRefs.map(ref => ref.current).filter(Boolean) as HTMLDivElement[]

    // The entrance stagger may still be running — let the exit own the items
    // outright, otherwise the two tweens fight over opacity mid-close.
    gsap.killTweensOf([...items, backdropRef.current, closeButtonRef.current])

    // Ripple out from whatever the viewport is actually centred on. A fixed
    // origin means that from the top of the grid the close begins off-screen
    // and the first beat reads as nothing happening at all.
    const viewportCenter = window.innerHeight / 2
    const originIndex = items.reduce<{distance: number; index: number}>(
      (closest, item, index) => {
        const {top, height} = item.getBoundingClientRect()
        const distance = Math.abs(top + height / 2 - viewportCenter)

        return distance < closest.distance ? {distance, index} : closest
      },
      {distance: Number.POSITIVE_INFINITY, index: 0}
    ).index

    gsap.to(items, {
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => {
        setMounted(false)
        onClose()
      },
      opacity: 0,
      scale: 0.94,
      stagger: {
        amount: 0.22,
        from: originIndex,
      },
      y: 28,
    })

    gsap.to(closeButtonRef.current, {
      duration: 0.2,
      ease: 'power2.in',
      opacity: 0,
      scale: 0.8,
    })

    gsap.to(backdropRef.current, {
      duration: 0.45,
      ease: 'power2.inOut',
      opacity: 0,
    })
  }, [onClose, itemRefs, sound])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const keyValue = e.key.toLowerCase()
      if (keyValue === 'esc' || keyValue === 'escape') {
        e.preventDefault()
        startClose()
      }
    },
    [startClose]
  )

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
    }
  }, [isOpen])

  useLayoutEffect(() => {
    if (!mounted) {
      return
    }

    if (!cardRef.current || !backdropRef.current || !closeButtonRef.current) {
      return
    }

    const items = itemRefs.map(ref => ref.current).filter(Boolean) as HTMLDivElement[]

    if (items.length === 0) {
      return
    }

    gsap.set(backdropRef.current, {
      opacity: 0,
    })

    gsap.to(backdropRef.current, {
      duration: 0.4,
      ease: 'power2.inOut',
      opacity: 1,
    })

    gsap.set(closeButtonRef.current, {
      opacity: 0,
      scale: 0.8,
    })

    gsap.to(closeButtonRef.current, {
      delay: 0.2,
      duration: 0.4,
      ease: 'power3.out',
      opacity: 1,
      scale: 1,
    })

    gsap.set(items, {
      opacity: 0,
      scale: 0.95,
      y: 40,
    })

    gsap.to(items, {
      delay: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      opacity: 1,
      scale: 1,
      stagger: {
        amount: 0.4,
        from: 'start',
      },
      y: 0,
    })
  }, [mounted, itemRefs])

  useEffect(() => {
    if (!mounted) {
      return
    }

    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 768) {
        setColumns(1)
      } else if (width < 1024) {
        setColumns(2)
      } else {
        setColumns(3)
      }
    }

    updateColumns()
    document.body.style.overflow = 'hidden'

    const abortController = new AbortController()

    window.addEventListener('resize', updateColumns, {signal: abortController.signal})
    document.addEventListener('keydown', handleKeyDown, {signal: abortController.signal})

    return () => {
      document.body.style.overflow = ''
      abortController.abort()
    }
  }, [mounted, handleKeyDown])

  if (!mounted) {
    return null
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-40 w-screen h-dvh overflow-auto block">
      <div ref={backdropRef} className="fixed inset-0 bg-black/50 will-change-[opacity]" />
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: a click outside the card closes it; keyboards close it with Escape */}
      <div className="flex w-full min-h-full mx-auto py-10 relative justify-center" onClick={startClose}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: only keeps a click inside the card from reaching the backdrop */}
        <div
          ref={cardRef}
          className="flex flex-col w-full items-center justify-center z-40 overflow-hidden will-change-transform [backface-visibility:hidden] transform-gpu mx-[12px] md:mx-0 mb-[56px] md:mb-0 pointer-events-none px-4 md:px-8 lg:px-[44px]"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative overflow-hidden w-full">
            <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[48px] justify-items-center mx-auto w-full max-w-[356px] md:max-w-[760px] lg:max-w-[1252px]">
              {DATA.map((_, index) => (
                <GalleryItem
                  key={index.toString()}
                  ref={itemRefs[index]}
                  columnIndex={index % columns}
                  rowIndex={Math.floor(index / columns)}
                  columns={columns}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Alone in the dock — nothing to expand into from a gallery — so the
          cluster is just the one pill, centred where it always is. */}
      <ModalControlsDock>
        <ModalCloseButton ref={closeButtonRef} onClose={startClose} />
      </ModalControlsDock>
    </div>,
    modalRoot
  )
}
