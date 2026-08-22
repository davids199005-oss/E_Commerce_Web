"use client"

import type { ReactElement } from "react"
import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/lib/types/api"
import type { OrderStatusBadgeProps } from "@/lib/types/components/orders"
import { cn } from "@/lib/utils"

const LABELS: Record<OrderStatus, string> = {
  TEMP: "Open cart",
  CLOSED: "Completed",
}

const TONES: Record<OrderStatus, string> = {
  TEMP: "bg-accent text-accent-foreground",
  CLOSED: "bg-muted text-muted-foreground",
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps): ReactElement {
  return <Badge className={cn(TONES[status], className)}>{LABELS[status]}</Badge>
}
