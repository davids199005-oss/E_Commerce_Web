"use client"

import type { ReactElement } from "react"
import { stockStatus } from "@/lib/format/stock"
import type { StockStatus } from "@/lib/types/stock"
import type { StockBadgeProps } from "@/lib/types/components/catalog"
import { cn } from "@/lib/utils"

const TONE: Readonly<Record<StockStatus["kind"], string>> = {
  in: "bg-stock-in text-stock-in-foreground",
  low: "bg-stock-low text-stock-low-foreground",
  out: "bg-stock-out text-stock-out-foreground",
}

export function StockBadge({ stockQty, className }: StockBadgeProps): ReactElement {
  const status: StockStatus = stockStatus(stockQty)

  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center rounded-lg px-2 text-xs font-medium",
        TONE[status.kind],
        className,
      )}
    >
      {status.label}
    </span>
  )
}
