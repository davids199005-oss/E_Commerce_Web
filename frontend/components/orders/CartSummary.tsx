"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { CreditCardIcon, Delete02Icon, Location01Icon } from "@hugeicons/core-free-icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  useDeleteActiveOrderMutation,
  usePurchaseOrderMutation,
} from "@/lib/features/orders/ordersApi"
import { toastOutcome } from "@/lib/features/orders/toastOutcome"
import { formatUsd, parseMoney } from "@/lib/format/money"
import type { CartSummaryProps } from "@/lib/types/components/orders"

export function CartSummary({ order }: CartSummaryProps): ReactElement {
  const router = useRouter()
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [clearCart, clearState] = useDeleteActiveOrderMutation()
  const [purchase, purchaseState] = usePurchaseOrderMutation()

  const isBusy: boolean = clearState.isLoading || purchaseState.isLoading

  const total: number = order.items.reduce(
    (sum, line) => sum + parseMoney(line.unit_price) * line.quantity,
    0,
  )
  const unitCount: number = order.items.reduce((sum, line) => sum + line.quantity, 0)

  async function handleClear(): Promise<void> {
    setIsConfirmOpen(false)
    toastOutcome(await clearCart(), "Your cart is empty again.")
  }

  async function handlePurchase(): Promise<void> {
    if (toastOutcome(await purchase(), "Order placed.")) {
      router.push("/orders")
    }
  }

  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
      <h2 className="font-heading text-base font-medium text-foreground">Order summary</h2>

      <dl className="space-y-3 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">
            {unitCount === 1 ? "1 item" : `${unitCount} items`}
          </dt>
          <dd className="font-mono tabular-nums text-muted-foreground">{formatUsd(total)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
          <dt className="font-medium text-foreground">Total</dt>
          <dd className="font-mono text-lg tabular-nums text-foreground">{formatUsd(total)}</dd>
        </div>
      </dl>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.8} />
        Ships to {order.shipping_city}, {order.shipping_country}
      </p>

      <div className="space-y-2">
        <Button
          size="lg"
          className="w-full"
          disabled={isBusy}
          onClick={() => {
            void handlePurchase()
          }}
        >
          <HugeiconsIcon icon={CreditCardIcon} strokeWidth={1.8} />
          {purchaseState.isLoading ? "Placing order…" : "Place order"}
        </Button>

        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogTrigger
            disabled={isBusy}
            render={<Button variant="destructive" size="lg" className="w-full" />}
          >
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
            Clear cart
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
              </AlertDialogMedia>
              <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes all {unitCount === 1 ? "1 item" : `${unitCount} items`} from your cart.
                Nothing is charged, and you can add them again from the catalog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel size="lg">Keep shopping</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                size="lg"
                onClick={() => {
                  void handleClear()
                }}
              >
                Clear cart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}
