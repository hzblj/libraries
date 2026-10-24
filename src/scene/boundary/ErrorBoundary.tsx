'use client'

import {Component, type ReactNode} from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
  onError?: (error: unknown) => void
}

type ErrorBoundaryState = {
  failed: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {failed: false}

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {failed: true}
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
