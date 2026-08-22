import { api } from "@/lib/api/api"
import type { Item } from "@/lib/types/api"
import type { ItemsQuery, ItemsResponse } from "@/lib/types/catalog"

function buildItemsUrl(query: ItemsQuery): string {
  const params: URLSearchParams = new URLSearchParams()

  for (const name of query.names ?? []) {
    const token: string = name.trim()
    if (token !== "") {
      params.append("names", token)
    }
  }

  if (query.price !== undefined) {
    params.append("price_op", query.price.op)
    params.append("price_value", String(query.price.value))
  }

  if (query.stock !== undefined) {
    params.append("stock_op", query.stock.op)
    params.append("stock_value", String(query.stock.value))
  }

  const search: string = params.toString()
  return search === "" ? "/items" : `/items?${search}`
}

const itemsApi = api.injectEndpoints({
  endpoints: (build) => ({
    listItems: build.query<ItemsResponse, ItemsQuery>({
      query: buildItemsUrl,
      providesTags: ["ItemList"],
    }),

    getItem: build.query<Item, number>({
      query: (id) => `/items/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Item" as const, id }],
    }),
  }),
})

export const { useListItemsQuery, useGetItemQuery } = itemsApi
