'use client'

import gsap from 'gsap'
import {type FC, PointerEvent, type ReactNode, useCallback, useRef} from 'react'
import {cn} from '@/utils'

export type LinkExternalVariant = 'default' | 'muted'

export type LinkExternalProps = {
  url: string
  children: ReactNode
  variant?: LinkExternalVariant
}

export const LinkExternal: FC<LinkExternalProps> = ({url, children, variant = 'default'}) => {
  const lineRef = useRef<HTMLDivElement>(null)
  const hoverLineRef = useRef<HTMLDivElement>(null)
  const isMuted = variant === 'muted'

  const handleEnter = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        return
      }

      if (isMuted) {
        gsap.killTweensOf(hoverLineRef.current)
        gsap.to(hoverLineRef.current, {
          duration: 0.4,
          ease: 'power3.out',
          opacity: 1,
        })
        return
      }

      gsap.killTweensOf(lineRef.current)
      gsap.to(lineRef.current, {
        delay: 0.15,
        duration: 0.4,
        ease: 'power3.out',
        width: '100%',
      })
    },
    [isMuted]
  )

  const handleLeave = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        return
      }

      if (isMuted) {
        gsap.killTweensOf(hoverLineRef.current)
        gsap.to(hoverLineRef.current, {
          duration: 0.3,
          ease: 'power3.in',
          opacity: 0,
        })
        return
      }

      gsap.killTweensOf(lineRef.current)
      gsap.to(lineRef.current, {
        duration: 0.2,
        ease: 'power3.in',
        width: 0,
      })
    },
    [isMuted]
  )

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onPointerEnter={handleEnter}
      onPointerOver={handleEnter}
      onPointerLeave={handleLeave}
      className="inline-block relative"
    >
      {children}
      <div className="absolute w-full bottom-[-1.5px]">
        {isMuted ? (
          <div className="relative h-[1.5px] w-full">
            <div className="absolute inset-0 bg-white/30" />
            <div
              ref={hoverLineRef}
              className="absolute inset-0 opacity-0 bg-[linear-gradient(to_right,#ffffff_0%,rgba(255,255,255,0.48)_100%)]"
            />
          </div>
        ) : (
          <div
            ref={lineRef}
            className={cn(
              'h-[1.5px] w-0 will-change-[width,height] transform-gpu',
              'bg-[linear-gradient(to_right,#ffffff_0%,rgba(255,255,255,0.48)_100%)]'
            )}
          />
        )}
      </div>
    </a>
  )
}
