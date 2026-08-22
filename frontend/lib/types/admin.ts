import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { Item } from "@/lib/types/api"

export interface ItemUpdate {
  name?: string
  price_usd?: string
  stock_qty?: number
  image_url?: string | null
}

export interface CreateItemResponse {
  message: string
  item_id: number
}

export interface UpdateItemRequest {
  id: number
  changes: ItemUpdate
}

export interface ItemDraft {
  name: string
  price_usd: string
  stock_qty: string
  image_url: string
}

export type ItemDraftField = keyof ItemDraft

export type ItemDraftErrors = Partial<Record<ItemDraftField, string>>

export interface FormSession {
  item: Item | null
  key: number
}

export type QueryError = FetchBaseQueryError | SerializedError | undefined

export type FeatureFormat = "days" | "count" | "money"

export interface FeatureSpec {
  key: string
  label: string
  format: FeatureFormat
}

export interface ItemFormFieldSpec {
  key: ItemDraftField
  label: string
  placeholder: string
  hint?: string
  mono: boolean
}
