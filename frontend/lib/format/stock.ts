import type { StockStatus } from "@/lib/types/stock"

const LOW_STOCK_THRESHOLD = 5

export function stockStatus(stockQty: number): StockStatus {
  if (stockQty <= 0) {
    return { kind: "out", label: "Out of stock" }
  }
  if (stockQty <= LOW_STOCK_THRESHOLD) {
    return { kind: "low", label: `Only ${stockQty} left` }
  }
  return { kind: "in", label: "In stock" }
}
