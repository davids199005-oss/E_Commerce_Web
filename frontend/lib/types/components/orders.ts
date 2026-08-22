import type { ReactNode } from "react"
import type { Order, OrderDetail, OrderItem, OrderStatus } from "@/lib/types/api"

export interface CartSummaryProps {
  order: OrderDetail
}

export interface CartLineRowProps {
  line: OrderItem
}

export interface OrderLineThumbnailProps {
  imageUrl: string | null
  name: string
  className?: string
}

export interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export interface OrderRowProps {
  order: Order
}

export interface MetaFieldProps {
  label: string
  children: ReactNode
}

export interface OrderDetailBodyProps {
  orderId: number
}
