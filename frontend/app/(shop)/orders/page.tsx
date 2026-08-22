"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { Package01Icon } from "@hugeicons/core-free-icons"
import { AuthGate } from "@/components/auth/AuthGate"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingRows } from "@/components/feedback/LoadingRows"
import { PageContainer } from "@/components/layout/PageContainer"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useListOrdersQuery } from "@/lib/features/orders/ordersApi"
import { formatDate } from "@/lib/format/date"
import { formatUsd } from "@/lib/format/money"
import type { OrderRowProps } from "@/lib/types/components/orders"

function OrderRow({ order }: OrderRowProps): ReactElement {
  const isOpenCart: boolean = order.status === "TEMP"

  return (
    <TableRow>
      <TableCell className="font-mono tabular-nums text-muted-foreground">#{order.id}</TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
      <TableCell className="text-muted-foreground">
        {order.shipping_city}, {order.shipping_country}
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-foreground">
        {formatUsd(order.total_price_usd)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant={isOpenCart ? "default" : "ghost"}
          size="sm"
          render={<Link href={isOpenCart ? "/cart" : `/orders/${order.id}`} />}
        >
          {isOpenCart ? "Open cart" : "View"}
        </Button>
      </TableCell>
    </TableRow>
  )
}

function OrdersHistory(): ReactElement {
  const { data: orders, isLoading, error, refetch } = useListOrdersQuery()

  if (isLoading) {
    return <LoadingRows rows={4} />
  }

  if (error !== undefined) {
    return (
      <ErrorState
        error={error}
        title="We could not load your orders"
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (orders === undefined || orders.length === 0) {
    return (
      <EmptyState
        icon={Package01Icon}
        title="No orders yet"
        description="Once you place an order, it stays here with everything that was in it."
        action={
          <Button size="lg" render={<Link href="/catalog" />}>
            Browse the catalog
          </Button>
        }
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead>Ships to</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function OrdersPage(): ReactElement {
  return (
    <AuthGate>
      <PageContainer
        title="Your orders"
        description="Your open cart sits at the top until you place it; everything below is history."
      >
        <OrdersHistory />
      </PageContainer>
    </AuthGate>
  )
}
