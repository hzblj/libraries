'use client'

import type {FC} from 'react'

import {Gallery} from '@/components/gallery'

import {useGalleryModal} from './useGalleryModal'

export const GalleryModal: FC = () => {
  const {close, isOpen} = useGalleryModal()

  if (!isOpen) {
    return null
  }

  return <Gallery isOpen onClose={close} />
}
