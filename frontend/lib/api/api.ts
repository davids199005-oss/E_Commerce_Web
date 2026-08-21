import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "@/lib/api/baseQuery";

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Item",
    "ActiveOrder",
    "Orders",
    "Favorites",
    "User",
    "UsersList",
    "Chat",
  ],
  endpoints: () => ({}),
});
