"use client"

import type { ReactElement } from "react"
import { ProductCard } from "@/components/catalog/ProductCard"
import type { ProductGridProps } from "@/lib/types/components/catalog"

export function ProductGrid({ items }: ProductGridProps): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 2xl:grid-cols-5">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  )
}
