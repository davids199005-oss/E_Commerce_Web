"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Package01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { AdminPage } from "@/components/admin/AdminPage"
import { DeleteItemDialog } from "@/components/admin/DeleteItemDialog"
import { ItemFormDialog } from "@/components/admin/ItemFormDialog"
import { ItemsTable } from "@/components/admin/ItemsTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingRows } from "@/components/feedback/LoadingRows"
import { Button } from "@/components/ui/button"
import { useListItemsQuery } from "@/lib/features/items/itemsApi"
import type { FormSession } from "@/lib/types/admin"
import type { Item } from "@/lib/types/api"
import type { ItemsQuery } from "@/lib/types/catalog"

const WHOLE_CATALOG: ItemsQuery = {}

export default function AdminItemsPage(): ReactElement {
  const { data, error, isError, isFetching, refetch } = useListItemsQuery(WHOLE_CATALOG)

  const [form, setForm] = useState<FormSession>({ key: 0, item: null })
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [doomed, setDoomed] = useState<Item | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)

  function openForm(item: Item | null): void {
    setForm((current) => ({ key: current.key + 1, item }))
    setIsFormOpen(true)
  }

  function openCreate(): void {
    openForm(null)
  }

  function openDelete(item: Item): void {
    setDoomed(item)
    setIsDeleteOpen(true)
  }

  const items: readonly Item[] | undefined = data?.items

  let content: ReactElement
  if (isError) {
    content = <ErrorState error={error} onRetry={refetch} title="We could not load the catalog" />
  } else if (items === undefined) {
    content = <LoadingRows rows={6} />
  } else if (items.length === 0) {
    content = (
      <EmptyState
        icon={Package01Icon}
        title="The shelves are empty"
        description="Add the first item and it appears in the shop straight away."
        action={
          <Button size="lg" onClick={openCreate}>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            Add an item
          </Button>
        }
      />
    )
  } else {
    content = (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-mono">{items.length}</span>{" "}
          {items.length === 1 ? "item" : "items"} in the catalog
          {isFetching && " · refreshing…"}
        </p>
        <ItemsTable items={items} onEdit={openForm} onDelete={openDelete} />
      </div>
    )
  }

  return (
    <AdminPage
      title="Catalog"
      description="Everything on sale, priced and counted. Changes reach the shop immediately."
      actions={
        <Button size="lg" onClick={openCreate}>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Add an item
        </Button>
      }
    >
      {content}

      <ItemFormDialog
        key={form.key}
        item={form.item}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
      <DeleteItemDialog item={doomed} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </AdminPage>
  )
}
