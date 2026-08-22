"use client"

import type { ReactElement } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { LoadingRowsProps } from "@/lib/types/components/feedback"
import { cn } from "@/lib/utils"

export function LoadingRows({ rows = 5, className }: LoadingRowsProps): ReactElement {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
        >
          <Skeleton className="size-14 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5 rounded-md" />
            <Skeleton className="h-3 w-1/4 rounded-md" />
          </div>
          <Skeleton className="h-4 w-16 shrink-0 rounded-md" />
        </div>
      ))}
    </div>
  )
}
