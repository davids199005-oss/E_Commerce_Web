import type { ReactNode } from "react"
import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { IconSvgElement } from "@hugeicons/react"

export interface EmptyStateProps {
  icon: IconSvgElement
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export interface ErrorStateProps {
  error: FetchBaseQueryError | SerializedError | undefined
  onRetry?: () => void
  title?: string
  className?: string
}

export interface LoadingGridProps {
  count?: number
  className?: string
}

export interface LoadingRowsProps {
  rows?: number
  className?: string
}
