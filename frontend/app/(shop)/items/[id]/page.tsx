"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MinusSignIcon,
  PackageIcon,
  PlusSignIcon,
  ShoppingCartAdd01Icon,
} from "@hugeicons/core-free-icons"
import { ProductImage } from "@/components/catalog/ProductImage"
import { StockBadge } from "@/components/catalog/StockBadge"
import { FavoriteToggle } from "@/components/favorites/FavoriteToggle"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { PageContainer } from "@/components/layout/PageContainer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { isHttpStatus } from "@/lib/api/errorMessage"
import { selectIsAuthenticated } from "@/lib/features/auth/authSlice"
import { useGetItemQuery } from "@/lib/features/items/itemsApi"
import { useAddOrderItemMutation } from "@/lib/features/orders/ordersApi"
import { toastOutcome } from "@/lib/features/orders/toastOutcome"
import { formatUsd } from "@/lib/format/money"
import { useAppSelector } from "@/lib/redux/hooks"
import type { Item } from "@/lib/types/api"

export default function ItemDetailPage(): ReactElement {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const isAuthenticated: boolean = useAppSelector(selectIsAuthenticated)

  const itemId: number = Number.parseInt(params.id, 10)
  const isValidId: boolean = Number.isInteger(itemId) && itemId > 0

  const { data: item, error, isLoading, refetch } = useGetItemQuery(itemId, { skip: !isValidId })

  const [quantity, setQuantity] = useState<number>(1)
  const [addOrderItem, addState] = useAddOrderItemMutation()

  if (!isValidId || (error !== undefined && isHttpStatus(error, 404))) {
    return (
      <PageContainer>
        <EmptyState
          icon={PackageIcon}
          title="This product is no longer available"
          description="It may have sold out for good or been taken off the shelves. The rest of the catalog is still there."
          action={
            <Button size="lg" render={<Link href="/catalog" />}>
              Back to the catalog
            </Button>
          }
        />
      </PageContainer>
    )
  }

  if (error !== undefined) {
    return (
      <PageContainer>
        <ErrorState error={error} onRetry={refetch} title="This product did not load" />
      </PageContainer>
    )
  }

  if (isLoading || item === undefined) {
    return (
      <PageContainer>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-9 w-3/4 rounded-lg" />
            <Skeleton className="h-7 w-32 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>
        </div>
      </PageContainer>
    )
  }

  const product: Item = item
  const isSoldOut: boolean = product.stock_qty <= 0
  const maxQuantity: number = Math.max(product.stock_qty, 1)

  function step(delta: number): void {
    setQuantity((previous) => Math.min(Math.max(previous + delta, 1), maxQuantity))
  }

  async function addToCart(): Promise<void> {
    toastOutcome(
      await addOrderItem({ item_id: product.id, quantity }),
      `${quantity} x ${product.name} is in your cart.`,
    )
  }

  function handleAddToCart(): void {
    if (!isAuthenticated) {
      toast.info("Sign in to start a cart.")
      router.push("/login")
      return
    }
    void addToCart()
  }

  return (
    <PageContainer>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductImage
          imageUrl={product.image_url}
          name={product.name}
          className="rounded-2xl border border-border bg-card"
        />

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="font-heading text-2xl font-semibold text-foreground">
              {formatUsd(product.price_usd)}
            </p>
            <StockBadge stockQty={product.stock_qty} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Quantity"
              className="flex h-11 items-center gap-1 rounded-xl border border-border bg-card px-1"
            >
              <Button
                size="icon-lg"
                variant="ghost"
                disabled={isSoldOut || quantity <= 1}
                onClick={() => step(-1)}
                aria-label="Decrease quantity"
              >
                <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
              </Button>
              <output className="w-8 text-center font-mono text-sm text-foreground">
                {quantity}
              </output>
              <Button
                size="icon-lg"
                variant="ghost"
                disabled={isSoldOut || quantity >= maxQuantity}
                onClick={() => step(1)}
                aria-label="Increase quantity"
              >
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              </Button>
            </div>

            <Button
              size="lg"
              className="h-11 px-4"
              disabled={isSoldOut || addState.isLoading}
              onClick={handleAddToCart}
            >
              <HugeiconsIcon icon={ShoppingCartAdd01Icon} strokeWidth={1.8} />
              {isSoldOut ? "Sold out" : "Add to cart"}
            </Button>

            <FavoriteToggle
              itemId={product.id}
              itemName={product.name}
              appearance="labelled"
              className="h-11 px-4"
            />
          </div>

          {!isSoldOut && (
            <p className="text-sm text-muted-foreground">
              You can order up to {product.stock_qty} of this.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
