'use client'

import dynamic from 'next/dynamic'
import type {FC} from 'react'

import {IntroOverlay} from '@/components/intro-overlay'
import {CameraProvider} from '@/providers/CameraProvider'

import {PageAmbient} from './ambient'
import {ErrorBoundary} from './boundary'
import {CameraBridge, introTarget} from './camera'
import {FocusTargets} from './focus'
import {GalleryModal, MorphModal} from './modal'
import {markSceneFailed, useSceneActivity} from './state'

const SceneCanvas = dynamic(() => import('./canvas').then(module => module.SceneCanvas), {ssr: false})

export const Scene: FC = () => {
  const {active, failed, mounted} = useSceneActivity()

  return (
    <>
      {mounted && (
        <CameraProvider paused={!active || failed}>
          <CameraBridge />
          {!failed && (
            <div className="fixed inset-0">
              <ErrorBoundary fallback={null} onError={markSceneFailed}>
                <SceneCanvas />
              </ErrorBoundary>
            </div>
          )}
          {active && <FocusTargets />}
          <MorphModal />
          <GalleryModal />
          {!failed && <IntroOverlay getTargetRect={introTarget} />}
        </CameraProvider>
      )}
      <PageAmbient />
    </>
  )
}
