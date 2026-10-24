'use client'

import {gsap} from 'gsap'
import {CustomEase} from 'gsap/CustomEase'
import {ScrollSmoother} from 'gsap/ScrollSmoother'
import {SplitText} from 'gsap/SplitText'
import {Fragment, type ReactNode, useMemo} from 'react'

import {useHasHover} from '@/hooks'

import {CameraSession} from './components'
import {Context, createCameraState, useCameraState} from './context'
import {DragControls, ScrollControls, ToucheControls} from './controls'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollSmoother, CustomEase, SplitText)
  CustomEase.create('bezier-out-back', 'M0,0 C0.47,1.69 0.63,0.99 1,1')
}

export type CameraProviderProps = {
  children: ReactNode
  paused?: boolean
}

const Controls = () => {
  const hasHover = useHasHover()
  const {isModalOpen} = useCameraState()

  return (
    <Fragment>
      {hasHover && !isModalOpen && <ScrollControls />}
      {/* The three with a pill in the dock stay mounted through an open modal and
          fade themselves out instead, so they leave on the same curve the modal
          arrives on rather than blinking out from under it. */}

      {!hasHover && !isModalOpen && <ToucheControls friction={0.9} speed={1.2} />}
      {hasHover && !isModalOpen && <DragControls />}
    </Fragment>
  )
}

export const CameraProvider = ({children, paused = false}: CameraProviderProps) => {
  const camera = useMemo(() => createCameraState(), [])

  return (
    <Context defaultState={camera}>
      {children}
      {!paused && <Controls />}
      <CameraSession />
    </Context>
  )
}
