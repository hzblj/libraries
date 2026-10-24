'use client'

import type {FC} from 'react'

import type {RGBA} from '../graphics'
import {plane} from '../graphics'
import {useEntity} from './EntityContext'
import {useSurfaceMaterial} from './useSurfaceMaterial'
import {type SurfacePointer, useSurfacePointer} from './useSurfacePointer'

type SurfaceProps = SurfacePointer & {
  fill?: RGBA | 'card'
  border?: RGBA | number
  radius?: number
}

export const Surface: FC<SurfaceProps> = ({fill = 'card', border = 160, radius = 16, ...pointer}) => {
  const {size} = useEntity()
  const material = useSurfaceMaterial({border, fill, radius})
  const handlers = useSurfacePointer(pointer)

  return (
    <mesh geometry={plane} material={material} scale={[size.width, size.height, 1]} renderOrder={0} {...handlers} />
  )
}
