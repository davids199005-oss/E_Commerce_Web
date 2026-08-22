"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingCartAdd01Icon } from "@hugeicons/core-free-icons"
import { ProductImage } from "@/components/catalog/ProductImage"
import { StockBadge } from "@/components/catalog/StockBadge"
import { FavoriteToggle } from "@/components/favorites/FavoriteToggle"
import { Button } from "@/components/ui/button"
import { selectIsAuthenticated } from "@/lib/features/auth/authSlice"
import { useAddOrderItemMutation } from "@/lib/features/orders/ordersApi"
import { toastOutcome } from "@/lib/features/orders/toastOutcome"
import { formatUsd } from "@/lib/format/money"
import { useAppSelector } from "@/lib/redux/hooks"
import type { ProductCardProps } from "@/lib/types/components/catalog"

export function ProductCard({ item }: ProductCardProps): ReactElement {
  const router = useRouter()
  const isAuthenticated: boolean = useAppSelector(selectIsAuthenticated)
  const [addOrderItem, addState] = useAddOrderItemMutation()

  const isSoldOut: boolean = item.stock_qty <= 0

  async function addToCart(): Promise<void> {
    toastOutcome(await addOrderItem({ item_id: item.id, quantity: 1 }), `${item.name} is in your cart.`)
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
    <article className="flex flex-col rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-sm">
      <div className="relative">
        <Link
          href={`/items/${item.id}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ProductImage imageUrl={item.image_url} name={item.name} />
        </Link>
        <FavoriteToggle itemId={item.id} itemName={item.name} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-1 pt-4 pb-1">
        <h3 className="font-sans text-sm leading-snug font-medium text-foreground">
          <Link href={`/items/${item.id}`} className="line-clamp-2 hover:underline">
            {item.name}
          </Link>
        </h3>

        <StockBadge stockQty={item.stock_qty} />

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-1">
          <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {formatUsd(item.price_usd)}
          </p>
          <Button size="lg" disabled={isSoldOut || addState.isLoading} onClick={handleAddToCart}>
            <HugeiconsIcon icon={ShoppingCartAdd01Icon} strokeWidth={1.8} />
            {isSoldOut ? "Sold out" : "Add"}
          </Button>
        </div>
      </div>
    </article>
  )
}
