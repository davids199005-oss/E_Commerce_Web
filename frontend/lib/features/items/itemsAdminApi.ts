import { api } from "@/lib/api/api"
import type { ItemCreate, MessageResponse } from "@/lib/types/api"
import type { CreateItemResponse, UpdateItemRequest } from "@/lib/types/admin"

const itemsAdminApi = api.injectEndpoints({
  endpoints: (build) => ({
    createItem: build.mutation<CreateItemResponse, ItemCreate>({
      query: (draft) => ({ url: "/items", method: "POST", body: draft }),
      invalidatesTags: ["ItemList"],
    }),

    updateItem: build.mutation<MessageResponse, UpdateItemRequest>({
      query: ({ id, changes }) => ({ url: `/items/${id}`, method: "PATCH", body: changes }),
      invalidatesTags: (_result, _error, { id }) => ["ItemList", { type: "Item" as const, id }],
    }),

    deleteItem: build.mutation<MessageResponse, number>({
      query: (id) => ({ url: `/items/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => ["ItemList", { type: "Item" as const, id }],
    }),
  }),
})

export const { useCreateItemMutation, useUpdateItemMutation, useDeleteItemMutation } = itemsAdminApi
