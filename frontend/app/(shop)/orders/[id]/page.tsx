"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, Package01Icon } from "@hugeicons/core-free-icons"
import { AuthGate } from "@/components/auth/AuthGate"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingRows } from "@/components/feedback/LoadingRows"
import { PageContainer } from "@/components/layout/PageContainer"
import { OrderLineThumbnail } from "@/components/orders/OrderLineThumbnail"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import { isHttpStatus } from "@/lib/api/errorMessage"
import { useGetOrderQuery } from "@/lib/features/orders/ordersApi"
import { formatDate } from "@/lib/format/date"
import { formatUsd, parseMoney } from "@/lib/format/money"
import type { MetaFieldProps, OrderDetailBodyProps } from "@/lib/types/components/orders"

function OrderNotFound(): ReactElement {
  return (
    <EmptyState
      icon={Package01Icon}
      title="Order not found"
      description="This order does not exist, or it belongs to a different account."
      action={
        <Button size="lg" render={<Link href="/orders" />}>
          Back to your orders
        </Button>
      }
    />
  )
}

function MetaField({ label, children }: MetaFieldProps): ReactElement {
  return (
    <div className="space-y-1.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  )
}

function OrderDetailBody({ orderId }: OrderDetailBodyProps): ReactElement {
  const { data: order, isLoading, error, refetch } = useGetOrderQuery(orderId)

  if (isLoading) {
    return <LoadingRows rows={3} />
  }

  if (error !== undefined) {
    if (isHttpStatus(error, 404)) {
      return <OrderNotFound />
    }
    return (
      <ErrorState
        error={error}
        title="We could not load this order"
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (order === undefined) {
    return <OrderNotFound />
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetaField label="Status">
            <OrderStatusBadge status={order.status} />
          </MetaField>
          <MetaField label="Placed">{formatDate(order.created_at)}</MetaField>
          <MetaField label="Completed">
            {order.closed_at === null ? "Not yet" : formatDate(order.closed_at)}
          </MetaField>
          <MetaField label="Ships to">
            {order.shipping_city}, {order.shipping_country}
          </MetaField>
        </dl>
      </section>

      <ul className="space-y-3">
        {order.items.map((line) => (
          <li
            key={line.item_id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <OrderLineThumbnail imageUrl={line.image_url} name={line.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{line.name}</p>
              <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                {line.quantity} × {formatUsd(line.unit_price)}
              </p>
            </div>
            <p className="font-mono text-sm tabular-nums text-foreground">
              {formatUsd(parseMoney(line.unit_price) * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-between rounded-2xl border border-border bg-card px-5 py-4">
        <span className="text-sm font-medium text-foreground">Total</span>
        <span className="font-mono text-lg tabular-nums text-foreground">
          {formatUsd(order.total_price_usd)}
        </span>
      </div>
    </div>
  )
}

export default function OrderDetailPage(): ReactElement {
  const params = useParams<{ id: string }>()
  const orderId: number = Number.parseInt(params.id, 10)
  const isValidId: boolean = Number.isInteger(orderId) && orderId > 0

  return (
    <AuthGate>
      <PageContainer
        title={isValidId ? `Order #${orderId}` : "Order"}
        description="A read-only record of this order."
        actions={
          <Button variant="outline" size="lg" render={<Link href="/orders" />}>
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={1.8} />
            All orders
          </Button>
        }
      >
        {isValidId ? <OrderDetailBody orderId={orderId} /> : <OrderNotFound />}
      </PageContainer>
    </AuthGate>
  )
}
