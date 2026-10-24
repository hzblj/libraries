import {createContext, use} from 'react'

import type {Rect} from '../grid'

export type EntitySize = {width: number; height: number}

export type EntityValue = {
  slug: string
  slot: number
  size: EntitySize
  invalidate: () => void
  isVisible: () => boolean
  worldRect: () => Rect
}

export const EntityContext = createContext<EntityValue | null>(null)

export const useEntity = () => {
  const value = use(EntityContext)

  if (!value) {
    throw new Error('useEntity must be used within an Entity')
  }

  return value
}
