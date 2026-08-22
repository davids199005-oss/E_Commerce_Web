import type { Item } from "@/lib/types/api"
import type { FavoriteToggleAppearance } from "@/lib/types/favorites"

export interface FavoriteItemCardProps {
  item: Item
}

export interface FavoriteToggleProps {
  itemId: number
  itemName: string
  appearance?: FavoriteToggleAppearance
  className?: string
}
