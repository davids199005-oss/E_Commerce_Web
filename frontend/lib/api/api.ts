import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "@/lib/api/baseQuery"

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Item",
    "ItemList",
    "ActiveOrder",
    "OrdersList",
    "Order",
    "Favorites",
    "Me",
    "UsersList",
    "ChatUsage",
    "Churn",
  ],
  endpoints: () => ({}),
})
