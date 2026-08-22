import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { MessageResponse, Order } from "@/lib/types/api"

export interface AddOrderItemRequest {
  item_id: number
  quantity?: number
}

export interface AddOrderItemResponse extends MessageResponse {
  order_id: number
}

export interface SetOrderItemQuantityRequest {
  item_id: number
  quantity: number
}

export interface OrdersListResponse {
  orders: Order[]
  message?: string
}

export type MutationOutcome =
  | { data: { message: string }; error?: undefined }
  | { data?: undefined; error: FetchBaseQueryError | SerializedError }
