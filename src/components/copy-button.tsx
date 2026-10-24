'use client'

import gsap from 'gsap'
import {type FC, useCallback, useEffect, useRef, useState} from 'react'

import {cn} from '@/utils'

const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="8" height="8" rx="2.4" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M10 3.4A2.4 2.4 0 0 0 7.6 2H4.4A2.4 2.4 0 0 0 2 4.4v3.2A2.4 2.4 0 0 0 3.4 9.9"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
)

const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M3 8.1 6.05 11.2 12 4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const area = document.createElement('textarea')
  area.value = value
  area.setAttribute('readonly', 'true')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  document.body.removeChild(area)
}

export type CopyButtonProps = {
  value: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

const sizes: Record<'sm' | 'md', string> = {
  md: 'size-9',
  sm: 'size-7',
}

export const CopyButton: FC<CopyButtonProps> = ({value, label = 'Copy', className, size = 'md'}) => {
  const refIdle = useRef<HTMLSpanElement>(null)
  const refDone = useRef<HTMLSpanElement>(null)
  const refGlow = useRef<HTMLSpanElement>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const idle = refIdle.current
    const done = refDone.current

    if (!idle || !done) {
      return
    }

    gsap.killTweensOf([idle, done])

    gsap.to(idle, {
      duration: 0.42,
      ease: 'power2.out',
      opacity: copied ? 0 : 1,
      rotate: copied ? -70 : 0,
      scale: copied ? 0.55 : 1,
      y: copied ? -3 : 0,
    })

    gsap.to(done, {
      duration: 0.42,
      ease: copied ? 'back.out(2.4)' : 'power2.in',
      opacity: copied ? 1 : 0,
      rotate: copied ? 0 : 70,
      scale: copied ? 1 : 0.55,
      y: copied ? 0 : 3,
    })

    if (copied && refGlow.current) {
      gsap.fromTo(
        refGlow.current,
        {opacity: 0.85, scale: 0.7},
        {duration: 0.9, ease: 'power2.out', opacity: 0, scale: 1.55}
      )
    }
  }, [copied])

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    },
    []
  )

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(value)
    } catch {
      return
    }

    setCopied(true)

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(() => setCopied(false), 1800)
  }, [value])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : label}
      className={cn(
        'group relative flex shrink-0 cursor-pointer items-center justify-center rounded-full',
        'border border-white/12 bg-white/6 text-white/60 backdrop-blur-md',
        'transition-[color,background-color,border-color] duration-300 ease-out',
        'hover:border-white/25 hover:bg-white/12 hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
        sizes[size],
        className
      )}
    >
      <span
        ref={refGlow}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-white/25 opacity-0 blur-[6px]"
      />
      <span ref={refIdle} className="absolute flex items-center justify-center">
        <IconCopy />
      </span>
      <span ref={refDone} className="absolute flex items-center justify-center text-white opacity-0">
        <IconCheck />
      </span>
    </button>
  )
}
