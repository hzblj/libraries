import {useCallback, useEffect} from 'react'

import {actionToggleModal, useCameraDispatch} from '@/providers/CameraProvider/context'

import {closeGallery, useSceneStore} from '../state'

export const useGalleryModal = () => {
  const isOpen = useSceneStore(state => state.galleryOpen)
  const dispatch = useCameraDispatch()

  useEffect(() => {
    if (isOpen) {
      actionToggleModal(dispatch, true)
    }
  }, [dispatch, isOpen])

  const close = useCallback(() => {
    closeGallery()
    actionToggleModal(dispatch, false)
  }, [dispatch])

  return {close, isOpen}
}
