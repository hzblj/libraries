import gsap from 'gsap'
import {CustomEase} from 'gsap/CustomEase'
import {useRouter} from 'next/navigation'
import {useCallback, useEffect, useLayoutEffect, useRef} from 'react'

import {showCvRevealed} from '@/components/cv'
import {Config} from '@/config'
import {useSound} from '@/hooks/use-sound'
import {handOffToPage, takeModalReturn} from '@/lib/page-handoff'
import {actionToggleModal, useCameraDispatch} from '@/providers/CameraProvider/context'

import {setCursor} from '../interaction'
import {
  cancelSnapshot,
  closeCard,
  leaveForPage,
  MODAL_BACKDROP,
  morph,
  morphTargets,
  type OpenCard,
  PAGE_BACKDROP,
  PAGE_TOP,
  prepareAmbient,
  requestSnapshot,
  returnFromPage,
  useSceneActive,
  useSceneStore,
} from '../state'
import {alignPill, isDesktop, pageAlignment, turnGlyph} from './pill'
import {hideSnapshot, paintSnapshot, visibleRegion} from './snapshotOverlay'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase)
  CustomEase.create('card-morph', 'M0,0 C0.32,0.72 0,1 1,1')
  CustomEase.create('card-morph-close', 'M0,0 C0.25,0.6 0.3,1 1,1')
}

const OPEN = {duration: 0.6, ease: 'card-morph'}
const CLOSE = {duration: 0.45, ease: 'card-morph-close'}
const PAGE = {duration: 0.7, ease: 'card-morph'}

const CONTROLS_IN = {
  autoAlpha: 1,
  delay: Config.controls.enterDelay,
  duration: Config.controls.enterDuration,
  ease: Config.controls.enterEase,
}

const CONTROLS_OUT = {autoAlpha: 0, duration: Config.controls.exitDuration, ease: Config.controls.exitEase}

const HIDDEN = {autoAlpha: 0, filter: 'blur(6px)', y: 16}
const REVEALED = {autoAlpha: 1, clearProps: 'filter,transform', filter: 'blur(0px)', y: 0}
const REVEAL = {...REVEALED, duration: 0.6, ease: 'power3.out', stagger: 0.06}
const REVEAL_AT = 0.4
const UNVEIL = {delay: 0.05, duration: 0.3, ease: 'power1.inOut', opacity: 0}

const isElement = (element: HTMLElement | null): element is HTMLElement => element !== null

const focusFirstControl = (container: HTMLElement | null) => {
  container?.querySelector<HTMLElement>('a, button')?.focus({preventScroll: true})
}

const openedFromKeyboard = () => document.activeElement?.matches(':focus-visible') ?? false

const restoreFocus = (element: HTMLElement | null) => {
  requestAnimationFrame(() => {
    if (element?.isConnected && element !== document.body) {
      element.focus({preventScroll: true})
    }
  })
}

const revealTargets = (details: HTMLElement | null) => {
  const sections = details ? [...details.querySelectorAll<HTMLElement>('[data-reveal]')] : []

  return sections.length > 0 ? sections : [details].filter(isElement)
}

const mediaTop = () => morphTargets.media?.getBoundingClientRect().top ?? PAGE_TOP

const alignWithPage = (scroller: HTMLElement | null, surface: HTMLElement | null, pageScroll: number) => {
  if (!scroller || !surface) {
    return
  }

  const off = mediaTop() - (PAGE_TOP - pageScroll)
  const before = scroller.scrollTop
  scroller.scrollTop = before + off
  const left = off - (scroller.scrollTop - before)

  gsap.set(surface, {y: Number(gsap.getProperty(surface, 'y')) - left})
}

export const useMorphModal = (card: OpenCard) => {
  const router = useRouter()
  const dispatch = useCameraDispatch()
  const sound = useSound('modal')
  const active = useSceneActive()
  const away = useSceneStore(state => state.away)

  const scrollerRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLElement | null>(null)
  const revealRef = useRef<HTMLElement[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const startRef = useRef(0)
  const snapshotRef = useRef<HTMLCanvasElement>(null)
  const landingRef = useRef(0)
  const busyRef = useRef(false)
  const openedRef = useRef(false)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const keyboardRef = useRef(false)
  const wasActiveRef = useRef(active)

  useLayoutEffect(() => {
    const surface = surfaceRef.current

    if (!surface) {
      return
    }

    const media = surface.querySelector<HTMLElement>('[data-morph="media"]')
    const details = surface.querySelector<HTMLElement>('[data-morph="details"]')
    const keepsPreview = card.kind === 'cv' && isDesktop()
    const swap = [card.kind === 'shot' ? media : null, keepsPreview ? details : null].filter(isElement)

    setCursor(false)
    detailsRef.current = details
    revealRef.current = revealTargets(details)
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    keyboardRef.current = openedFromKeyboard()
    morphTargets.surface = surface
    morphTargets.media = media
    morphTargets.swap = swap
    morph.stage = 'webgl'
    morph.page = 0
    morph.keepsPreview = keepsPreview

    for (const element of swap) {
      element.style.visibility = 'hidden'
    }

    if (!keepsPreview) {
      gsap.set(revealRef.current, HIDDEN)
    }

    gsap.set([overlayRef.current, closeRef.current], {autoAlpha: 0})

    return () => {
      morphTargets.surface = null
      morphTargets.media = null
      morphTargets.swap = []
    }
  }, [card])

  const stopLanding = useCallback(() => {
    landingRef.current += 1
    cancelSnapshot()
    gsap.killTweensOf(snapshotRef.current)
    hideSnapshot(snapshotRef.current)
  }, [])

  useEffect(() => {
    actionToggleModal(dispatch, true)

    if (!openedRef.current) {
      openedRef.current = true
      sound.open()
    }

    const settle = () => {
      morph.stage = 'dom'

      if (keyboardRef.current) {
        focusFirstControl(overlayRef.current)
      } else {
        surfaceRef.current?.focus({preventScroll: true})
      }
    }

    const land = () => {
      const surface = surfaceRef.current
      const canvas = snapshotRef.current

      if (!morph.keepsPreview || !surface || !canvas) {
        settle()
        return
      }

      const landing = ++landingRef.current

      requestSnapshot(visibleRegion(surface)).then(snapshot => {
        if (landing !== landingRef.current) {
          return
        }

        if (snapshot) {
          paintSnapshot(canvas, surface, snapshot)
          gsap.to(canvas, {...UNVEIL, onComplete: () => hideSnapshot(canvas)})
        }

        settle()
      })
    }

    const open = () => {
      const timeline = gsap
        .timeline()
        .to(morph, {backdrop: MODAL_BACKDROP, duration: 0.35, ease: 'power2.out'}, 0)
        .to(morph, {...OPEN, progress: 1}, 0)
        .call(land)
        .to([overlayRef.current, closeRef.current], CONTROLS_IN, 0)

      if (!morph.keepsPreview) {
        timeline.to(revealRef.current, REVEAL, REVEAL_AT)
      }

      timelineRef.current = timeline
    }

    startRef.current = requestAnimationFrame(() => {
      startRef.current = requestAnimationFrame(open)
    })

    return () => {
      cancelAnimationFrame(startRef.current)
      timelineRef.current?.kill()
      stopLanding()
    }
  }, [dispatch, sound, stopLanding])

  useEffect(() => {
    const returning = active && !wasActiveRef.current && away
    wasActiveRef.current = active

    if (!returning) {
      return
    }

    cancelAnimationFrame(startRef.current)
    timelineRef.current?.kill()

    const handBack = takeModalReturn()

    if (handBack) {
      alignWithPage(scrollerRef.current, surfaceRef.current, handBack.scroll)
    }

    const timeline = gsap
      .timeline()
      .to(surfaceRef.current, {...PAGE, y: 0}, 0)
      .to(morph, {...PAGE, page: 0}, 0)
      .to(morphTargets.ambient, {...PAGE, opacity: 0}, 0)
      .to(morph, {backdrop: MODAL_BACKDROP, duration: PAGE.duration, ease: 'power2.out'}, 0)
      .to(closeRef.current, CONTROLS_IN, 0.2)
      .call(() => {
        morph.stage = 'dom'
        busyRef.current = false
        returnFromPage()
      })

    turnGlyph(timeline, overlayRef.current, 'expand')
    alignPill(timeline, overlayRef.current, 0)

    timelineRef.current = timeline
  }, [active, away])

  const expand = useCallback(
    (href: string) => {
      if (busyRef.current) {
        return
      }

      busyRef.current = true
      cancelAnimationFrame(startRef.current)
      timelineRef.current?.kill()
      stopLanding()
      morph.stage = 'glass'
      prepareAmbient(card.kind)

      const top = mediaTop()
      handOffToPage(Math.max(0, PAGE_TOP - top))

      const timeline = gsap
        .timeline()
        .to(closeRef.current, CONTROLS_OUT, 0)
        .to(surfaceRef.current, {...PAGE, y: Math.min(0, PAGE_TOP - top)}, 0)
        .to(morph, {...PAGE, page: 1}, 0)
        .to(morphTargets.ambient, {...PAGE, opacity: 1}, 0)
        .to(morph, {backdrop: PAGE_BACKDROP, duration: PAGE.duration, ease: 'power2.inOut'}, 0)
        .call(() => {
          leaveForPage()
          showCvRevealed(detailsRef.current)
          router.push(href, {scroll: false})
        })

      turnGlyph(timeline, overlayRef.current, 'collapse')
      alignPill(timeline, overlayRef.current, pageAlignment(overlayRef.current))

      timeline.to(revealRef.current, {...REVEALED, duration: 0.25, ease: 'power2.out'}, 0)

      timelineRef.current = timeline
    },
    [card.kind, router, stopLanding]
  )

  const startClose = useCallback(() => {
    if (busyRef.current) {
      return
    }

    busyRef.current = true
    sound.close()
    cancelAnimationFrame(startRef.current)
    timelineRef.current?.kill()
    stopLanding()

    const fade = morph.keepsPreview ? 0 : 0.15
    const timeline = gsap.timeline()

    if (!morph.keepsPreview) {
      timeline.to(detailsRef.current, {autoAlpha: 0, duration: fade, ease: 'power2.in'}, 0)
    }

    timeline
      .to([overlayRef.current, closeRef.current], CONTROLS_OUT, 0)
      .call(
        () => {
          morph.stage = 'webgl'
        },
        undefined,
        fade
      )
      .to(morph, {...CLOSE, progress: 0}, fade)
      .to(morph, {backdrop: 0, duration: 0.4, ease: 'power2.inOut'}, fade + 0.1)
      .call(() => {
        actionToggleModal(dispatch, false)
        closeCard()
        restoreFocus(returnFocusRef.current)
      })

    timelineRef.current = timeline
  }, [dispatch, sound, stopLanding])

  return {closeRef, expand, overlayRef, scrollerRef, snapshotRef, startClose, surfaceRef}
}
