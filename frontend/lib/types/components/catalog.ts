import type { NumericFilter, OpChoice } from "@/lib/types/catalog"
import type { Item } from "@/lib/types/api"

export interface CatalogPaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export interface ProductGridProps {
  items: readonly Item[]
}

export interface ProductCardProps {
  item: Item
}

export interface ProductImageProps {
  imageUrl: string | null
  name: string
  className?: string
}

export interface StockBadgeProps {
  stockQty: number
  className?: string
}

export interface TokenChipProps {
  label: string
  removeLabel: string
  onRemove: () => void
}

export interface SearchTokensProps {
  tokens: readonly string[]
  onChange: (tokens: readonly string[]) => void
}

export interface ConditionComposerProps {
  legend: string
  ops: readonly OpChoice[]
  placeholder: string
  onSubmit: (filter: NumericFilter) => void
}

export interface FilterBarProps {
  price: NumericFilter | null
  stock: NumericFilter | null
  onPriceChange: (filter: NumericFilter | null) => void
  onStockChange: (filter: NumericFilter | null) => void
  canClear: boolean
  onClearAll: () => void
}
