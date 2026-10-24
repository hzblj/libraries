'use client'

import {type FC, type ReactNode, Suspense} from 'react'

import {ErrorBoundary} from './ErrorBoundary'

type SafeSuspenseProps = {
  fallback: ReactNode
  children: ReactNode
}

export const SafeSuspense: FC<SafeSuspenseProps> = ({fallback, children}) => {
  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
