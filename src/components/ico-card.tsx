'use client'

import gsap from 'gsap'
import {MetalFx} from 'metal-fx'
import {type FC, type PointerEvent, useCallback, useEffect, useLayoutEffect, useRef} from 'react'

import {type IcoRecord, ico} from '@/db'
import {useMetalPlate} from '@/hooks'
import {cn} from '@/utils'

import {CopyButton} from './copy-button'

const TILT = {
  lerp: 0.11,
  rotate: 14,
  scale: 1.016,
  z: 40,
}

/**
 * Touch has no hover, so the same gesture runs off a held finger instead — and
 * lighter, because on a phone the finger sits on top of what it is tilting.
 * `hover` scales rotation, lift, scale and glare together, so one gain is enough.
 */
const TOUCH_GAIN = 0.55

/** A tap is over long before the ease-in has gone anywhere, so a touch release
 *  holds the light for a beat — without it the gesture only reads while dragging. */
const TOUCH_HOLD = 420

const RADIUS = 24

/** The metal ring's width: the plate sits inside it, never under it. */
const RING = 2.5

/** The flag at the size of a word: 3:2, the wedge reaching half way in. */
const CzechFlag = () => (
  <svg aria-hidden="true" viewBox="0 0 18 12" className="block h-[10px] w-[15px]">
    <path fill="#f4f5f7" d="M0 0h18v6H0z" />
    <path fill="#d7141a" d="M0 6h18v6H0z" />
    <path fill="#11457e" d="M0 0l9 6-9 6z" />
  </svg>
)

const Label: FC<{children: string; className?: string}> = ({children, className}) => (
  <span
    className={cn('block text-[9px] font-medium uppercase leading-[100%] tracking-[0.16em] text-white/45', className)}
  >
    {children}
  </span>
)

const Meta: FC<{label: string; value: string}> = ({label, value}) => (
  <span className="block text-[11px] font-normal leading-[16px] tracking-[0.01em]">
    <span className="text-white/35">{label}</span> <span className="text-white/70">{value}</span>
  </span>
)

const Record: FC<IcoRecord> = ({label, hint, value, url}) => (
  <div data-ico-reveal="true" className="flex flex-col gap-[7px]">
    <Label>{hint ? `${label} · ${hint}` : label}</Label>
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit text-[13px] font-normal leading-[18px] tracking-[0px] text-white/60 underline decoration-white/20 decoration-[1.5px] underline-offset-[5px] transition-colors duration-500 ease-out hover:text-white hover:decoration-white/45"
      >
        {value}
      </a>
    ) : (
      <span className="block text-[13px] font-normal leading-[18px] tracking-[0px] text-white/60">{value}</span>
    )}
  </div>
)

export const IcoCard: FC = () => {
  const refStage = useRef<HTMLDivElement>(null)
  const refIntro = useRef<HTMLDivElement>(null)
  const refCard = useRef<HTMLDivElement>(null)
  const target = useRef({hover: 0, x: 0, y: 0})
  const state = useRef({hover: 0, x: 0, y: 0})
  const refRelease = useRef<ReturnType<typeof setTimeout>>(undefined)
  const refHeld = useRef(false)
  const plate = useMetalPlate(RADIUS - RING)
  const {paint} = plate

  // The entrance runs on the wrapper so the tilt ticker keeps sole ownership of
  // the card's own transform — two writers on one property fight each other.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({defaults: {ease: 'power3.out'}})
        .fromTo(refIntro.current, {autoAlpha: 0, scale: 0.94, y: 26}, {autoAlpha: 1, duration: 1.1, scale: 1, y: 0})
        .fromTo('[data-ico-reveal]', {autoAlpha: 0, y: 12}, {autoAlpha: 1, duration: 0.7, stagger: 0.05}, 0.3)
    }, refStage)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const card = refCard.current

    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const update = () => {
      const time = gsap.ticker.time
      const to = target.current
      const at = state.current

      at.x += (to.x - at.x) * TILT.lerp
      at.y += (to.y - at.y) * TILT.lerp
      at.hover += (to.hover - at.hover) * 0.07

      // Idle breathing keeps the card alive when nobody is pointing at it.
      const idleY = (Math.sin(time * 0.42) * 2.6 + Math.sin(time * 0.17) * 1.2) * (1 - at.hover)
      const idleX = (Math.cos(time * 0.35) * 1.8 + Math.cos(time * 0.23) * 0.9) * (1 - at.hover)

      const rotateY = at.x * TILT.rotate * at.hover + idleY
      const rotateX = -at.y * TILT.rotate * 0.7 * at.hover + idleX
      const scale = 1 + (TILT.scale - 1) * at.hover

      card.style.setProperty('--glare', at.hover.toFixed(3))
      card.style.setProperty('--hx', (rotateY / TILT.rotate).toFixed(3))
      card.style.setProperty('--hy', (rotateX / TILT.rotate).toFixed(3))
      card.style.setProperty(
        '--tilt',
        `translate3d(0,0,${(TILT.z * at.hover).toFixed(2)}px) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg) scale(${scale.toFixed(4)})`
      )
      paint({hover: at.hover, pointerX: at.x, pointerY: at.y, rotateX, rotateY})
    }

    gsap.ticker.add(update)

    return () => {
      gsap.ticker.remove(update)
      clearTimeout(refRelease.current)
    }
  }, [paint])

  const aim = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!refCard.current) {
      return
    }

    clearTimeout(refRelease.current)

    const rect = refCard.current.getBoundingClientRect()

    target.current.hover = event.pointerType === 'mouse' ? 1 : TOUCH_GAIN
    target.current.x = gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width - 0.5) * 2)
    target.current.y = gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height - 0.5) * 2)
  }, [])

  const release = useCallback(() => {
    clearTimeout(refRelease.current)

    refHeld.current = false
    target.current.hover = 0
    target.current.x = 0
    target.current.y = 0
  }, [])

  // A mouse steers by hovering; a finger or pen only while it is held down.
  const handleMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' || refHeld.current) {
        aim(event)
      }
    },
    [aim]
  )

  // Touch fires no move until it has moved, so the press itself has to light up.
  const handleDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') {
        refHeld.current = true
        aim(event)
      }
    },
    [aim]
  )

  // Lifting a finger ends the gesture — and fires `pointerleave` straight after,
  // so both paths schedule the same hold rather than one undoing the other.
  // A mouse leaving is a real exit and lets go at once.
  const handleRelease = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse') {
        release()

        return
      }

      clearTimeout(refRelease.current)
      refHeld.current = false
      refRelease.current = setTimeout(release, TOUCH_HOLD)
    },
    [release]
  )

  return (
    <div ref={refStage} className="flex w-full max-w-[456px] flex-col items-center gap-[38px]">
      {/* `data-ico-intro` is what app.css hides until the entrance runs — the
          card fades in from the wrapper, so the wrapper is what has to start
          hidden in the served HTML. */}
      <div ref={refIntro} data-ico-intro="true" className="w-full [perspective:1400px] [perspective-origin:50%_45%]">
        {/*
          The metal ring lives on the tilting wrapper so it rotates with the card.
          Only the ring is wanted here: the wandering halo is off, and reflections
          stay off by never passing `reflectionTargets`.
        */}
        <MetalFx
          ref={refCard}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
          // A cancel means the browser took the gesture over for a scroll — drop
          // it immediately rather than holding a tilt over a moving page.
          onPointerCancel={release}
          preset="silver"
          theme="dark"
          borderRadius={RADIUS}
          ringCssPx={RING}
          scale={1.8}
          strength={0.9}
          disableGlow
          normalizeHostStyles={false}
          className="ico-card !flex w-full will-change-transform"
        >
          <div className="relative aspect-[1.5858] w-full rounded-3xl" style={{transformStyle: 'preserve-3d'}}>
            <div
              aria-hidden="true"
              className="ico-halo absolute -inset-20 -z-10"
              style={{transform: 'translateZ(-80px)'}}
            />

            <div aria-hidden="true" className="absolute inset-0 rounded-3xl shadow-[0_40px_110px_-34px_#000]" />

            {/* Inset by the ring's width — the MetalFx canvas paints below this
                content, so a plate drawn edge-to-edge would swallow the ring. */}
            <canvas
              ref={plate.canvasRef}
              className="absolute top-[2.5px] left-[2.5px] h-[calc(100%-5px)] w-[calc(100%-5px)]"
            />

            <div
              className="relative flex h-full flex-col justify-between p-[20px] sm:p-[28px]"
              style={{transform: 'translateZ(26px)', transformStyle: 'preserve-3d'}}
            >
              <div className="flex items-start justify-between gap-4" style={{transform: 'translateZ(14px)'}}>
                <div className="flex min-w-0 flex-col gap-[6px]">
                  <span className="ico-holo-text block truncate text-[15px] font-medium leading-[18px] tracking-[0.01em]">
                    {ico.name}
                  </span>
                  <span className="block truncate text-[11px] font-normal leading-[14px] tracking-[0.01em] text-white/40">
                    {ico.headline}
                  </span>
                </div>
                <span className="flex shrink-0 items-center gap-[7px] rounded-full bg-white/[0.05] py-[5px] pr-[9px] pl-[6px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09),inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <span className="overflow-hidden rounded-[2px] shadow-[0_0_0_0.5px_rgba(255,255,255,0.3)]">
                    <CzechFlag />
                  </span>
                  <span className="text-[10px] font-semibold leading-none tracking-[0.12em] text-white/70">CZ</span>
                </span>
              </div>

              <div className="flex items-end justify-between gap-4" style={{transform: 'translateZ(46px)'}}>
                <div className="flex flex-col gap-[10px]">
                  <Label>IČO · Business ID</Label>
                  {/* The button rides beside the number rather than out at the card's
                      edge, so the pair reads as one thing: the ID and its copy. */}
                  <div className="flex items-center gap-[11px]">
                    <span className="ico-holo-text block text-[26px] font-medium leading-[100%] tracking-[0.06em] tabular-nums sm:text-[32px]">
                      {ico.ico}
                    </span>
                    {/* Inter's ascent and descent bracket the lining figures almost
                        symmetrically at `leading-[100%]`, so the numerals' optical
                        middle already is the box's middle — `items-center` centres
                        the button on them without a nudge. */}
                    <CopyButton value={ico.ico} label="Copy business ID" size="sm" />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-[2px] pb-[1px] text-right">
                  <Meta label="Since" value={ico.since} />
                  <span className="block text-[11px] font-normal leading-[16px] tracking-[0.01em] text-white/70">
                    {ico.vat}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </MetalFx>
      </div>

      <div className="flex w-full flex-col gap-[26px] px-[2px]">
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
          {ico.records.map(record => (
            <Record key={record.label} {...record} />
          ))}
        </div>

        <div data-ico-reveal="true" className="flex flex-wrap items-center justify-between gap-3">
          <a
            href={ico.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-normal leading-[16px] tracking-[0px] text-white/35 underline decoration-white/15 decoration-[1.5px] underline-offset-4 transition-colors duration-500 ease-out hover:text-white/60 hover:decoration-white/35"
          >
            Verified in {ico.source.name}
          </a>
          <span className="text-[12px] font-normal leading-[16px] tracking-[0px] text-white/25">
            Updated {ico.source.updatedAt}
          </span>
        </div>
      </div>
    </div>
  )
}
