"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons"
import { AuthGate } from "@/components/auth/AuthGate"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingRows } from "@/components/feedback/LoadingRows"
import { PageContainer } from "@/components/layout/PageContainer"
import { CartLineRow } from "@/components/orders/CartLineRow"
import { CartSummary } from "@/components/orders/CartSummary"
import { Button } from "@/components/ui/button"
import { useGetActiveOrderQuery } from "@/lib/features/orders/ordersApi"

function CartContents(): ReactElement {
  const { data: order, isLoading, error, refetch } = useGetActiveOrderQuery()

  if (isLoading) {
    return <LoadingRows rows={3} />
  }

  if (error !== undefined) {
    return (
      <ErrorState
        error={error}
        title="We could not open your cart"
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (order === undefined || order === null || order.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart01Icon}
        title="Your cart is empty"
        description="Everything you add from the catalog waits here until you place the order."
        action={
          <Button size="lg" render={<Link href="/catalog" />}>
            Browse the catalog
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <ul className="space-y-3">
        {order.items.map((line) => (
          <CartLineRow key={line.item_id} line={line} />
        ))}
      </ul>
      <CartSummary order={order} />
    </div>
  )
}

export default function CartPage(): ReactElement {
  return (
    <AuthGate>
      <PageContainer
        title="Your cart"
        description="Check the quantities, then place the order. Stock is only reserved once you do."
      >
        <CartContents />
      </PageContainer>
    </AuthGate>
  )
}
