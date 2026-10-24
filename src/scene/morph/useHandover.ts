import {useFrame} from '@react-three/fiber'

import {morph, morphTargets} from '../state'

const setShown = (element: HTMLElement, shown: boolean) => {
  const visibility = shown ? 'visible' : 'hidden'

  if (element.style.visibility !== visibility) {
    element.style.visibility = visibility
  }
}

export const useHandover = () => {
  useFrame(() => {
    for (const element of morphTargets.swap) {
      setShown(element, morph.stage !== 'webgl')
    }
  }, -0.5)
}
