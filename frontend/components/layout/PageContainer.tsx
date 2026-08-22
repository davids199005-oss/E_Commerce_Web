"use client"

import type { ReactElement } from "react"
import type { PageContainerProps } from "@/lib/types/components/layout"
import { cn } from "@/lib/utils"

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
}: PageContainerProps): ReactElement {
  const hasHeader: boolean =
    title !== undefined || description !== undefined || actions !== undefined

  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8", className)}>
      {hasHeader && (
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            {title !== undefined && (
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
            )}
            {description !== undefined && (
              <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions !== undefined && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </div>
  )
}
