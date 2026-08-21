import { api } from "@/lib/api/api";
import type { ItemsResponse, MessageResponse } from "@/lib/types/api";

export const favoritesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<ItemsResponse, void>({
      query: () => "/favorites",
      providesTags: ["Favorites"],
    }),
    addFavorite: builder.mutation<MessageResponse, number>({
      query: (itemId) => ({
        url: `/favorites/${itemId}`,
        method: "POST",
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFavorite: builder.mutation<MessageResponse, number>({
      query: (itemId) => ({
        url: `/favorites/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;
