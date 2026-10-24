import {type MouseEvent, useCallback} from 'react'

import {useSound} from '@/hooks/use-sound'

import {focusTarget, openGallery, useSceneStore} from '../state'
import {openFromLink} from './openFromLink'
import type {FocusTarget} from './targets'
import {usePanToArea} from './usePanToArea'

const isModified = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0

export const useFocusHandlers = (target: FocusTarget) => {
  const failed = useSceneStore(state => state.failed)
  const panToArea = usePanToArea()
  const sound = useSound('photos')

  const onFocus = useCallback(() => {
    focusTarget(target.id)

    if (!useSceneStore.getState().card) {
      panToArea(target.area)
    }
  }, [panToArea, target])

  const onBlur = useCallback(() => {
    focusTarget(null)
  }, [])

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (target.kind === 'gallery') {
        sound.open()
        openGallery()
        return
      }

      if (target.kind !== 'card' || failed || isModified(event)) {
        return
      }

      event.preventDefault()
      openFromLink(target.card)
    },
    [failed, sound, target]
  )

  return {onBlur, onClick, onFocus}
}
