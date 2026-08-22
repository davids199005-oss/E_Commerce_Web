"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, ReloadIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/api/errorMessage"
import type { ErrorStateProps } from "@/lib/types/components/feedback"
import { cn } from "@/lib/utils"

export function ErrorState({
  error,
  onRetry,
  title = "That did not load",
  className,
}: ErrorStateProps): ReactElement {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <HugeiconsIcon icon={Alert02Icon} size={22} strokeWidth={1.8} />
      </span>
      <h2 className="mt-5 font-heading text-base font-medium text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {getErrorMessage(error)}
      </p>
      {onRetry !== undefined && (
        <Button size="lg" className="mt-6" onClick={onRetry}>
          <HugeiconsIcon icon={ReloadIcon} strokeWidth={1.8} />
          Try again
        </Button>
      )}
    </div>
  )
}
