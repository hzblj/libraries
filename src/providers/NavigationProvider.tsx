'use client'

import {usePathname, useRouter} from 'next/navigation'
import {
  createContext,
  type ReactNode,
  type RefObject,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'

// Everything here hangs off one subscription: the router swaps the page inside
// its own subtree, so a provider in the root layout would never re-render on a
// navigation. Reading the pathname wires it into every one of them, which is
// what lets us both finish a view transition and know whether there is an
// in-app entry to go back to.
type Commit = (() => void) | null

type NavigationContextValue = {
  /** Resolves the in-flight view transition once the new route is on screen. */
  commitRef: RefObject<Commit>
  /** True once this document has navigated at least once without reloading. */
  navigatedRef: RefObject<boolean>
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

// If the navigation never commits (offline, a throwing boundary) the page would
// sit frozen under the transition pseudo-elements. Let it through instead.
const COMMIT_TIMEOUT = 1500

type Props = {
  children: ReactNode
}

export const NavigationProvider = ({children}: Props) => {
  const commitRef = useRef<Commit>(null)
  const navigatedRef = useRef(false)
  const pathname = usePathname()
  const landingPathRef = useRef(pathname)

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not an input
  useEffect(() => {
    commitRef.current?.()
    commitRef.current = null
  }, [pathname])

  useEffect(() => {
    if (pathname !== landingPathRef.current) {
      navigatedRef.current = true
    }
  }, [pathname])

  const value = useMemo(() => ({commitRef, navigatedRef}), [])

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export type Navigation = {
  /**
   * Which way the transition reads: going in, the page you leave pulls towards
   * you; coming out, the page you return to settles back down. Published as
   * `data-view-transition` on `<html>` for the stylesheet to hang the two root
   * animations off.
   */
  direction: 'forward' | 'back'
  /** Where to go. Omitted means back through history. */
  to?: string
}

/**
 * Navigates inside a view transition, so leaving a page and arriving on the next
 * read as one movement instead of a hard cut. Falls back to a plain navigation
 * wherever the API is missing or the visitor asked for reduced motion.
 */
export const useViewTransitionNavigate = () => {
  const router = useRouter()
  const context = useContext(NavigationContext)

  return useCallback(
    ({direction, to}: Navigation) => {
      const go = () => (to === undefined ? router.back() : router.push(to))

      const canAnimate =
        context !== null &&
        typeof document.startViewTransition === 'function' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!canAnimate) {
        go()
        return
      }

      const root = document.documentElement
      root.dataset.viewTransition = direction

      const transition = document.startViewTransition(
        () =>
          new Promise<void>(resolve => {
            let timeout = 0

            const commit = () => {
              window.clearTimeout(timeout)
              resolve()
            }

            timeout = window.setTimeout(commit, COMMIT_TIMEOUT)
            context.commitRef.current = commit

            startTransition(go)
          })
      )

      // Cleared on both settle and abort — a direction left behind would point
      // the next transition the wrong way.
      const clear = () => {
        delete root.dataset.viewTransition
      }

      transition.finished.then(clear, clear)
    },
    [context, router]
  )
}

/**
 * Reports whether going back would land somewhere inside the site. False on a
 * cold landing — a shared link, a new tab, a refresh — where `history.back()`
 * would either do nothing or throw the visitor out to wherever they came from.
 *
 * Read at click time rather than during render, so no navigation re-renders the
 * tree just to keep a flag current.
 */
export const useCanGoBack = () => {
  const context = useContext(NavigationContext)

  return useCallback(() => context?.navigatedRef.current === true, [context])
}
