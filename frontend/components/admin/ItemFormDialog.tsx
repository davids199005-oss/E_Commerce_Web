"use client"

import { useState } from "react"
import type { FormEvent, ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import {
  EMPTY_ITEM_DRAFT,
  itemDraftFrom,
  itemDraftToCreate,
  itemDraftToUpdate,
  validateItemDraft,
} from "@/components/admin/itemDraft"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useCreateItemMutation,
  useUpdateItemMutation,
} from "@/lib/features/items/itemsAdminApi"
import { toastOutcome } from "@/lib/features/orders/toastOutcome"
import type { ItemDraft, ItemDraftErrors, ItemFormFieldSpec, ItemUpdate } from "@/lib/types/admin"
import type { ItemFormDialogProps } from "@/lib/types/components/admin"

const FIELDS: readonly ItemFormFieldSpec[] = [
  { key: "name", label: "Name", placeholder: "Wooden Table", mono: false },
  { key: "price_usd", label: "Price (USD)", placeholder: "249.00", mono: true },
  { key: "stock_qty", label: "Stock", placeholder: "0", mono: true },
  {
    key: "image_url",
    label: "Image path",
    placeholder: "/pics/Wooden Table.jpg",
    hint: "A path on the API host. Leave it empty for no photo.",
    mono: true,
  },
]

export function ItemFormDialog({ item, open, onOpenChange }: ItemFormDialogProps): ReactElement {
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation()
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation()
  const [draft, setDraft] = useState<ItemDraft>(() =>
    item === null ? EMPTY_ITEM_DRAFT : itemDraftFrom(item),
  )
  const [errors, setErrors] = useState<ItemDraftErrors>({})

  const isSaving: boolean = isCreating || isUpdating
  const changes: ItemUpdate | null = item === null ? null : itemDraftToUpdate(draft, item)
  const hasChanges: boolean = changes === null || Object.keys(changes).length > 0

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const nextErrors: ItemDraftErrors = validateItemDraft(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (item === null) {
      const created = await createItem(itemDraftToCreate(draft))
      if (toastOutcome(created, `${draft.name.trim()} is in the catalog.`)) {
        onOpenChange(false)
      }
      return
    }

    if (changes === null || Object.keys(changes).length === 0) return

    const updated = await updateItem({ id: item.id, changes })
    if (toastOutcome(updated, `${item.name} has been updated.`)) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            {item === null ? "Add an item" : `Edit ${item.name}`}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {item === null
              ? "It goes on the shelf as soon as you save."
              : "Only the fields you change are sent."}
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="space-y-4"
          onSubmit={(event) => {
            void submit(event)
          }}
        >
          {FIELDS.map((field) => {
            const error: string | undefined = errors[field.key]
            const describedBy: string | undefined =
              error !== undefined
                ? `item-${field.key}-error`
                : field.hint !== undefined
                  ? `item-${field.key}-hint`
                  : undefined

            return (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`item-${field.key}`} className="text-sm">
                  {field.label}
                </Label>
                <Input
                  id={`item-${field.key}`}
                  className={field.mono ? "h-9 font-mono text-sm" : "h-9 text-sm"}
                  value={draft[field.key]}
                  placeholder={field.placeholder}
                  disabled={isSaving}
                  aria-invalid={error !== undefined}
                  aria-describedby={describedBy}
                  onChange={(event) => {
                    const next: string = event.target.value
                    setDraft((current) => ({ ...current, [field.key]: next }))
                  }}
                />
                {error !== undefined ? (
                  <p id={`item-${field.key}-error`} className="text-xs text-destructive">
                    {error}
                  </p>
                ) : (
                  field.hint !== undefined && (
                    <p id={`item-${field.key}-hint`} className="text-xs text-muted-foreground">
                      {field.hint}
                    </p>
                  )
                )}
              </div>
            )
          })}

          <DialogFooter className="pt-2">
            <DialogClose render={<Button type="button" variant="ghost" size="lg" />}>
              Cancel
            </DialogClose>
            <Button type="submit" size="lg" disabled={isSaving || !hasChanges}>
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={1.8} />
              {isSaving ? "Saving…" : item === null ? "Add item" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
