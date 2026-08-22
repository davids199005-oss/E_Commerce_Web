"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons"
import { ProductImage } from "@/components/catalog/ProductImage"
import { StockBadge } from "@/components/catalog/StockBadge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatUsd } from "@/lib/format/money"
import type { ItemsTableProps } from "@/lib/types/components/admin"

export function ItemsTable({ items, onEdit, onDelete }: ItemsTableProps): ReactElement {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-16 pl-4">
              <span className="sr-only">Photo</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="pr-4 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="py-3 pl-4">
                <ProductImage
                  imageUrl={item.image_url}
                  name={item.name}
                  className="size-11 rounded-lg"
                />
              </TableCell>

              <TableCell className="py-3">
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">#{item.id}</span>
              </TableCell>

              <TableCell className="py-3 text-right font-mono tabular-nums">
                {formatUsd(item.price_usd)}
              </TableCell>

              <TableCell className="py-3">
                <div className="flex items-center justify-end gap-2">
                  <StockBadge stockQty={item.stock_qty} />
                  <span className="w-10 text-right font-mono tabular-nums">{item.stock_qty}</span>
                </div>
              </TableCell>

              <TableCell className="py-3 pr-4">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="lg" onClick={() => onEdit(item)}>
                    <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={1.8} />
                    Edit
                  </Button>
                  <Button variant="ghost" size="icon-lg" onClick={() => onDelete(item)}>
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
                    <span className="sr-only">Remove {item.name}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
