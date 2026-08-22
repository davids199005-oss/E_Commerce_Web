import type { Item } from "@/lib/types/api"

export interface FavoritesResponse {
  items: Item[]
  message?: string
}

export interface FavoriteMessage {
  message: string
}

export type FavoriteToggleAppearance = "icon" | "labelled"
