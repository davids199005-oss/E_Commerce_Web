import { api } from "@/lib/api/api"
import { isHttpStatus } from "@/lib/api/errorMessage"
import type { Item } from "@/lib/types/api"
import type { FavoriteMessage, FavoritesResponse } from "@/lib/types/favorites"

const favoritesApi = api.injectEndpoints({
  endpoints: (build) => ({
    listFavorites: build.query<Item[], void>({
      query: () => "/favorites",
      transformResponse: (response: FavoritesResponse): Item[] => response.items,
      providesTags: ["Favorites"],
    }),

    addFavorite: build.mutation<FavoriteMessage, number>({
      query: (itemId: number) => ({ url: `/favorites/${itemId}`, method: "POST" }),
      invalidatesTags: (_result, error) =>
        error === undefined || isHttpStatus(error, 409) ? ["Favorites"] : [],
    }),

    removeFavorite: build.mutation<FavoriteMessage, number>({
      query: (itemId: number) => ({ url: `/favorites/${itemId}`, method: "DELETE" }),
      invalidatesTags: (_result, error) =>
        error === undefined || isHttpStatus(error, 404) ? ["Favorites"] : [],
    }),
  }),
})

export const { useListFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } =
  favoritesApi
