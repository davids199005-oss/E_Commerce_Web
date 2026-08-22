"use client"

import type { ReactElement } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { LoadingGridProps } from "@/lib/types/components/feedback"
import { cn } from "@/lib/utils"

export function LoadingGrid({ count = 8, className }: LoadingGridProps): ReactElement {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-2xl border border-border bg-card p-3">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-2 px-1 pt-4 pb-1">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
