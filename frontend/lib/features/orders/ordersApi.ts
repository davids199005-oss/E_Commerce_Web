import { api } from "@/lib/api/api";
import type {
  AddOrderItemPayload,
  MessageResponse,
  OrderDetail,
  OrderItem,
  OrdersResponse,
} from "@/lib/types/api";

function isOrderItem(value: object): value is OrderItem {
  return (
    "item_id" in value &&
    "name" in value &&
    "quantity" in value &&
    "unit_price" in value
  );
}

function isOrderDetail(value: object): value is OrderDetail {
  return (
    "id" in value &&
    "items" in value &&
    Array.isArray(value.items) &&
    value.items.every(
      (item) => typeof item === "object" && item !== null && isOrderItem(item),
    )
  );
}

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrder: builder.query<OrderDetail, number>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (_result, _error, orderId) => [
        { type: "Orders", id: orderId },
      ],
    }),
    getActiveOrder: builder.query<OrderDetail | null, void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery("/orders/active");
        if (result.error) {
          if (result.error.status === 404) {
            return { data: null };
          }
          return { error: result.error };
        }
        if (
          typeof result.data === "object" &&
          result.data !== null &&
          isOrderDetail(result.data)
        ) {
          return { data: result.data };
        }
        return {
          error: {
            status: "CUSTOM_ERROR",
            error: "Некорректный ответ активного заказа",
          },
        };
      },
      providesTags: ["ActiveOrder"],
    }),
    addOrderItem: builder.mutation<
      MessageResponse & { order_id: number },
      AddOrderItemPayload
    >({
      query: (body) => ({
        url: "/orders/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ActiveOrder", "Orders", "Item"],
    }),
    updateOrderItemQuantity: builder.mutation<
      MessageResponse,
      { itemId: number; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/orders/items/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["ActiveOrder", "Orders"],
    }),
    removeOrderItem: builder.mutation<MessageResponse, number>({
      query: (itemId) => ({
        url: `/orders/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ActiveOrder", "Orders"],
    }),
    clearActiveOrder: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/orders/active",
        method: "DELETE",
      }),
      invalidatesTags: ["ActiveOrder", "Orders"],
    }),
    purchaseOrder: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/orders/purchase",
        method: "POST",
      }),
      invalidatesTags: ["ActiveOrder", "Orders", "Item"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetActiveOrderQuery,
  useAddOrderItemMutation,
  useUpdateOrderItemQuantityMutation,
  useRemoveOrderItemMutation,
  useClearActiveOrderMutation,
  usePurchaseOrderMutation,
} = ordersApi;
