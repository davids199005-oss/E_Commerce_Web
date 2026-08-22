import type { Item } from "@/lib/types/api"

export type ComparisonOp = "eq" | "gt" | "lt"

export interface NumericFilter {
  op: ComparisonOp
  value: number
}

export interface ItemsQuery {
  names?: readonly string[]
  price?: NumericFilter
  stock?: NumericFilter
}

export interface ItemsResponse {
  items: Item[]
  message?: string
}

export interface Page<T> {
  readonly items: readonly T[]
  readonly pageCount: number
  readonly from: number
  readonly to: number
}

export type PageToken = number | "gap"

export interface OpChoice {
  op: ComparisonOp
  label: string
}

export interface CatalogPageState {
  key: string
  page: number
}
