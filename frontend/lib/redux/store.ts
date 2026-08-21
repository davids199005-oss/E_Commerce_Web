import { configureStore } from "@reduxjs/toolkit";

import { api } from "@/lib/api/api";
import { authReducer } from "@/lib/features/auth/authSlice";
import "@/lib/features/auth/authApi";
import "@/lib/features/analytics/analyticsApi";
import "@/lib/features/chat/chatApi";
import "@/lib/features/favorites/favoritesApi";
import "@/lib/features/items/itemsApi";
import "@/lib/features/orders/ordersApi";
import "@/lib/features/users/usersApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
