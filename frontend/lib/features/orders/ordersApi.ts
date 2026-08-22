import { api } from "@/lib/api/api"
import { isHttpStatus } from "@/lib/api/errorMessage"
import type { MessageResponse, Order, OrderDetail, OrderItem } from "@/lib/types/api"
import type {
  AddOrderItemRequest,
  AddOrderItemResponse,
  OrdersListResponse,
  SetOrderItemQuantityRequest,
} from "@/lib/types/orders"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isArrayOf<T>(value: unknown, isMember: (member: unknown) => member is T): value is T[] {
  return Array.isArray(value) && value.every(isMember)
}

function isOrderItem(value: unknown): value is OrderItem {
  return (
    isRecord(value) &&
    typeof value.item_id === "number" &&
    typeof value.name === "string" &&
    typeof value.quantity === "number" &&
    typeof value.unit_price === "string" &&
    typeof value.stock_qty === "number"
  )
}

function isOrderDetail(value: unknown): value is OrderDetail {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    (value.status === "TEMP" || value.status === "CLOSED") &&
    typeof value.total_price_usd === "string" &&
    isArrayOf(value.items, isOrderItem)
  )
}

const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getActiveOrder: build.query<OrderDetail | null, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, baseQuery) => {
        const result = await baseQuery("/orders/active")

        if (result.error !== undefined) {
          return isHttpStatus(result.error, 404) ? { data: null } : { error: result.error }
        }
        if (!isOrderDetail(result.data)) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "The cart came back in a shape we could not read.",
              data: result.data,
            },
          }
        }
        return { data: result.data }
      },
      providesTags: ["ActiveOrder"],
    }),

    addOrderItem: build.mutation<AddOrderItemResponse, AddOrderItemRequest>({
      query: (body) => ({ url: "/orders/items", method: "POST", body }),
      invalidatesTags: ["ActiveOrder", "OrdersList"],
    }),

    setOrderItemQuantity: build.mutation<MessageResponse, SetOrderItemQuantityRequest>({
      query: ({ item_id, quantity }) => ({
        url: `/orders/items/${item_id}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["ActiveOrder", "OrdersList"],
    }),

    removeOrderItem: build.mutation<MessageResponse, number>({
      query: (itemId) => ({ url: `/orders/items/${itemId}`, method: "DELETE" }),
      invalidatesTags: ["ActiveOrder", "OrdersList"],
    }),

    deleteActiveOrder: build.mutation<MessageResponse, void>({
      query: () => ({ url: "/orders/active", method: "DELETE" }),
      invalidatesTags: ["ActiveOrder", "OrdersList"],
    }),

    purchaseOrder: build.mutation<MessageResponse, void>({
      query: () => ({ url: "/orders/purchase", method: "POST" }),
      invalidatesTags: ["ActiveOrder", "OrdersList", "ItemList", "Item"],
    }),

    listOrders: build.query<Order[], void>({
      query: () => "/orders",
      transformResponse: (response: OrdersListResponse): Order[] => response.orders,
      providesTags: ["OrdersList"],
    }),

    getOrder: build.query<OrderDetail, number>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: "Order", id: orderId }],
    }),
  }),
})

export const {
  useGetActiveOrderQuery,
  useAddOrderItemMutation,
  useSetOrderItemQuantityMutation,
  useRemoveOrderItemMutation,
  useDeleteActiveOrderMutation,
  usePurchaseOrderMutation,
  useListOrdersQuery,
  useGetOrderQuery,
} = ordersApi
