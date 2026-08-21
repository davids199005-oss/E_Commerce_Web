import { api } from "@/lib/api/api";
import type {
  Item,
  ItemCreatedResponse,
  ItemPatchPayload,
  ItemWritePayload,
  ItemsQuery,
  ItemsResponse,
  MessageResponse,
} from "@/lib/types/api";

function hasItemFilters(query: ItemsQuery | undefined): boolean {
  if (!query) {
    return false;
  }
  return (
    query.names !== undefined ||
    query.price_op !== undefined ||
    query.price_value !== undefined ||
    query.stock_op !== undefined ||
    query.stock_value !== undefined
  );
}

export const itemsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<ItemsResponse, ItemsQuery | void>({
      query: (query) => {
        if (!hasItemFilters(query ?? undefined)) {
          return "/items";
        }
        const params: Record<string, string | number> = {};
        if (query?.names) {
          params.names = query.names;
        }
        if (query?.price_op) {
          params.price_op = query.price_op;
        }
        if (query?.price_value !== undefined) {
          params.price_value = query.price_value;
        }
        if (query?.stock_op) {
          params.stock_op = query.stock_op;
        }
        if (query?.stock_value !== undefined) {
          params.stock_value = query.stock_value;
        }
        return { url: "/items", params };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({
                type: "Item" as const,
                id: item.id,
              })),
              { type: "Item", id: "LIST" },
            ]
          : [{ type: "Item", id: "LIST" }],
    }),
    getItem: builder.query<Item, number>({
      query: (itemId) => `/items/${itemId}`,
      providesTags: (_result, _error, itemId) => [{ type: "Item", id: itemId }],
    }),
    createItem: builder.mutation<ItemCreatedResponse, ItemWritePayload>({
      query: (body) => ({
        url: "/items",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),
    updateItem: builder.mutation<
      MessageResponse,
      { itemId: number; body: ItemPatchPayload }
    >({
      query: ({ itemId, body }) => ({
        url: `/items/${itemId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Item", id: arg.itemId },
        { type: "Item", id: "LIST" },
      ],
    }),
    deleteItem: builder.mutation<MessageResponse, number>({
      query: (itemId) => ({
        url: `/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi;
