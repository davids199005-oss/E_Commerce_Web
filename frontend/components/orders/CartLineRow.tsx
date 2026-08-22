"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { OrderLineThumbnail } from "@/components/orders/OrderLineThumbnail"
import { Button } from "@/components/ui/button"
import {
  useRemoveOrderItemMutation,
  useSetOrderItemQuantityMutation,
} from "@/lib/features/orders/ordersApi"
import { toastOutcome } from "@/lib/features/orders/toastOutcome"
import { formatUsd, parseMoney } from "@/lib/format/money"
import type { CartLineRowProps } from "@/lib/types/components/orders"

export function CartLineRow({ line }: CartLineRowProps): ReactElement {
  const [setQuantity, quantityState] = useSetOrderItemQuantityMutation()
  const [removeItem, removeState] = useRemoveOrderItemMutation()

  const isBusy: boolean = quantityState.isLoading || removeState.isLoading
  const lineTotal: number = parseMoney(line.unit_price) * line.quantity
  const isSoldOut: boolean = line.stock_qty <= 0
  const exceedsStock: boolean = !isSoldOut && line.quantity > line.stock_qty

  async function changeQuantity(next: number): Promise<void> {
    toastOutcome(
      await setQuantity({ item_id: line.item_id, quantity: next }),
      `${line.name} updated.`,
    )
  }

  async function remove(): Promise<void> {
    toastOutcome(await removeItem(line.item_id), `${line.name} removed from your cart.`)
  }

  return (
    <li className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <OrderLineThumbnail imageUrl={line.image_url} name={line.name} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{line.name}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {formatUsd(line.unit_price)} each
        </p>
        {isSoldOut && (
          <p className="mt-1 text-xs text-stock-out-foreground">
            Out of stock — remove this line to check out.
          </p>
        )}
        {exceedsStock && (
          <p className="mt-1 text-xs text-stock-low-foreground">
            Only {line.stock_qty} left — lower the quantity to check out.
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border p-1">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isBusy || line.quantity <= 1}
          onClick={() => {
            void changeQuantity(line.quantity - 1)
          }}
        >
          <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
          <span className="sr-only">Decrease quantity of {line.name}</span>
        </Button>
        <span className="w-8 text-center font-mono text-sm tabular-nums text-foreground">
          {line.quantity}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isBusy || line.quantity >= line.stock_qty}
          onClick={() => {
            void changeQuantity(line.quantity + 1)
          }}
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          <span className="sr-only">Increase quantity of {line.name}</span>
        </Button>
      </div>

      <p className="w-24 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
        {formatUsd(lineTotal)}
      </p>

      <Button
        variant="ghost"
        size="icon-sm"
        disabled={isBusy}
        onClick={() => {
          void remove()
        }}
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
        <span className="sr-only">Remove {line.name} from your cart</span>
      </Button>
    </li>
  )
}
