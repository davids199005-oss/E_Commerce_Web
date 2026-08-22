"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Image02Icon } from "@hugeicons/core-free-icons"
import { FavoriteToggle } from "@/components/favorites/FavoriteToggle"
import { formatUsd } from "@/lib/format/money"
import { stockStatus } from "@/lib/format/stock"
import { itemImageSrc } from "@/lib/media/itemImageSrc"
import type { FavoriteItemCardProps } from "@/lib/types/components/favorites"
import type { StockStatus } from "@/lib/types/stock"
import { cn } from "@/lib/utils"

const STOCK_CLASS: Record<StockStatus["kind"], string> = {
  in: "bg-stock-in text-stock-in-foreground",
  low: "bg-stock-low text-stock-low-foreground",
  out: "bg-stock-out text-stock-out-foreground",
}

export function FavoriteItemCard({ item }: FavoriteItemCardProps): ReactElement {
  const href: string = `/items/${item.id}`
  const src: string | null = itemImageSrc(item.image_url)
  const status: StockStatus = stockStatus(item.stock_qty)

  return (
    <article className="group/card flex flex-col rounded-2xl border border-border bg-card p-3">
      <div className="relative">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="block overflow-hidden rounded-xl bg-muted"
        >
          {src !== null ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
            />
          ) : (
            <span className="flex aspect-square w-full items-center justify-center text-muted-foreground">
              <HugeiconsIcon icon={Image02Icon} size={28} strokeWidth={1.5} />
            </span>
          )}
        </Link>
        <FavoriteToggle itemId={item.id} itemName={item.name} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-1 pt-4 pb-1">
        <Link
          href={href}
          className="line-clamp-2 font-heading text-sm font-medium text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {item.name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-mono text-sm text-foreground">{formatUsd(item.price_usd)}</span>
          <span
            className={cn(
              "rounded-full px-2 py-1 text-xs leading-none font-medium",
              STOCK_CLASS[status.kind],
            )}
          >
            {status.label}
          </span>
        </div>
      </div>
    </article>
  )
}
