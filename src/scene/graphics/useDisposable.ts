import {useEffect} from 'react'

export const useDisposable = <T extends {dispose: () => void}>(value: T) => {
  useEffect(() => () => value.dispose(), [value])

  return value
}
