import {useLayoutEffect, useMemo} from 'react'
import {createPaperMaterial, naturalSize, useDisposable, useImage} from '../graphics'
import type {Rect} from '../grid'
import {useEntity} from './EntityContext'

export const usePaperMaterial = (rect: Rect, radius: number) => {
  const {invalidate} = useEntity()
  const paper = useImage('/jpg/texture-paper.jpg', 640)
  const material = useDisposable(useMemo(() => createPaperMaterial(), []))

  useLayoutEffect(() => {
    const {uniforms} = material
    const natural = naturalSize(paper)
    uniforms.uMap.value = paper
    uniforms.uMapSize.value.set(natural.width, natural.height)
    uniforms.uRect.value.set(rect.x, rect.y, rect.width, rect.height)
    uniforms.uRadius.value = radius
    invalidate()

    return invalidate
  }, [invalidate, material, paper, radius, rect])

  return material
}
