'use client'

import type {FC, ReactNode} from 'react'

import type {Entry} from '@/db'

import {ignoreRaycast, plane} from '../graphics'
import {EntityContext} from './EntityContext'
import {SLOTS, useSlots} from './useSlots'

type EntityProps = {
  entry: Entry
  children: ReactNode
}

export const Entity: FC<EntityProps> = ({entry, children}) => {
  const {baked, contexts, setInner, setOuter, setQuad} = useSlots(entry)

  return SLOTS.map(slot => (
    <group key={slot} ref={node => setOuter(slot, node)}>
      <mesh
        ref={node => setQuad(slot, node)}
        geometry={plane}
        material={baked[slot].material}
        renderOrder={0}
        raycast={ignoreRaycast}
      />
      <group ref={node => setInner(slot, node)}>
        <EntityContext value={contexts[slot]}>{children}</EntityContext>
      </group>
    </group>
  ))
}
