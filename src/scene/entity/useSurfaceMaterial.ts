import {useLayoutEffect, useMemo} from 'react'
import {createSurfaceMaterial, type RGBA, setRGBA, useDisposable} from '../graphics'
import {useEntity} from './EntityContext'

type SurfaceLook = {
  fill: RGBA | 'card'
  border: RGBA | number
  radius: number
}

export const useSurfaceMaterial = ({fill, border, radius}: SurfaceLook) => {
  const {size, invalidate} = useEntity()
  const material = useDisposable(useMemo(() => createSurfaceMaterial(), []))

  useLayoutEffect(() => {
    const {uniforms} = material
    uniforms.uSize.value.set(size.width, size.height)
    uniforms.uRadius.value = radius

    if (fill === 'card') {
      uniforms.uFill.value.set(0, 0, 0, -1)
    } else {
      setRGBA(uniforms.uFill.value, fill)
    }

    if (typeof border === 'number') {
      uniforms.uBorder.value.set(0, 0, 0, -1)
      uniforms.uBorderAngle.value = border
    } else {
      setRGBA(uniforms.uBorder.value, border)
    }

    invalidate()

    return invalidate
  }, [border, fill, invalidate, material, radius, size])

  return material
}
