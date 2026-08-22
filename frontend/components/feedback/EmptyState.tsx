"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { EmptyStateProps } from "@/lib/types/components/feedback"
import { cn } from "@/lib/utils"

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <HugeiconsIcon icon={icon} size={22} strokeWidth={1.8} />
      </span>
      <h2 className="mt-5 font-heading text-base font-medium text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action !== undefined && <div className="mt-6">{action}</div>}
    </div>
  )
}
