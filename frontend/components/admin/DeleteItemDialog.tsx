"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"
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
} from "@/components/ui/alert-dialog"
import { useDeleteItemMutation } from "@/lib/features/items/itemsAdminApi"
import { toastOutcome } from "@/lib/features/orders/toastOutcome"
import type { DeleteItemDialogProps } from "@/lib/types/components/admin"

export function DeleteItemDialog({
  item,
  open,
  onOpenChange,
}: DeleteItemDialogProps): ReactElement {
  const [deleteItem, { isLoading }] = useDeleteItemMutation()

  async function confirm(): Promise<void> {
    if (item === null) return
    if (toastOutcome(await deleteItem(item.id), `${item.name} has been removed.`)) {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove {item?.name ?? "this item"}?</AlertDialogTitle>
          <AlertDialogDescription>
            It disappears from the catalog, from every wishlist, and from the order history that
            mentions it. There is no undo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Keep it</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLoading}
            onClick={() => {
              void confirm()
            }}
          >
            {isLoading ? "Removing…" : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
