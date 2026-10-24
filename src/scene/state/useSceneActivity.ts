import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'

import {useIntro} from '@/providers/IntroProvider'

import {resetScene, useSceneStore} from './store'

export const SCENE_PATH = '/'

export const useSceneActive = () => usePathname() === SCENE_PATH

export const useSceneActivity = () => {
  const active = useSceneActive()
  const failed = useSceneStore(state => state.failed)
  const {setIntroComplete} = useIntro()
  const [mounted, setMounted] = useState(active)

  useEffect(() => {
    if (active) {
      setMounted(true)
    }
  }, [active])

  useEffect(() => {
    if (failed) {
      setIntroComplete(true)
    }
  }, [failed, setIntroComplete])

  useEffect(() => resetScene, [])

  return {active, failed, mounted}
}
