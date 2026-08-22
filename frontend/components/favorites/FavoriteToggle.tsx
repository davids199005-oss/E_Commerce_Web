"use client"

import type { ReactElement } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { getErrorMessage, isHttpStatus } from "@/lib/api/errorMessage"
import { selectIsAuthenticated } from "@/lib/features/auth/authSlice"
import {
  useAddFavoriteMutation,
  useListFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/lib/features/favorites/favoritesApi"
import { useAppSelector } from "@/lib/redux/hooks"
import type { FavoriteToggleProps } from "@/lib/types/components/favorites"
import { cn } from "@/lib/utils"

export function FavoriteToggle({
  itemId,
  itemName,
  appearance = "icon",
  className,
}: FavoriteToggleProps): ReactElement {
  const router = useRouter()
  const isAuthenticated: boolean = useAppSelector(selectIsAuthenticated)

  const { isFavorite } = useListFavoritesQuery(undefined, {
    skip: !isAuthenticated,
    selectFromResult: ({ data }) => ({
      isFavorite: data?.some((item) => item.id === itemId) ?? false,
    }),
  })

  const [addFavorite, addState] = useAddFavoriteMutation()
  const [removeFavorite, removeState] = useRemoveFavoriteMutation()
  const isBusy: boolean = addState.isLoading || removeState.isLoading

  async function save(): Promise<void> {
    const result = await addFavorite(itemId)
    if (result.error !== undefined) {
      if (isHttpStatus(result.error, 409)) {
        toast.info(`${itemName} is already in your favorites.`)
        return
      }
      toast.error(getErrorMessage(result.error))
      return
    }
    toast.success(`Saved ${itemName} to favorites.`)
  }

  async function unsave(): Promise<void> {
    const result = await removeFavorite(itemId)
    if (result.error !== undefined) {
      if (isHttpStatus(result.error, 404)) {
        toast.info(`${itemName} was no longer in your favorites.`)
        return
      }
      toast.error(getErrorMessage(result.error))
      return
    }
    toast.success(`Removed ${itemName} from favorites.`)
  }

  function handleClick(): void {
    if (!isAuthenticated) {
      toast.info("Sign in to keep favorites.")
      router.push("/login")
      return
    }
    void (isFavorite ? unsave() : save())
  }

  const label: string = isFavorite
    ? `Remove ${itemName} from favorites`
    : `Add ${itemName} to favorites`

  const heart: ReactElement = (
    <HugeiconsIcon
      icon={FavouriteIcon}
      size={appearance === "icon" ? 18 : 16}
      strokeWidth={1.8}
      fill={isFavorite ? "currentColor" : "none"}
    />
  )

  if (appearance === "labelled") {
    return (
      <Button
        variant="outline"
        size="lg"
        aria-pressed={isFavorite}
        disabled={isBusy}
        onClick={handleClick}
        className={cn(isFavorite && "text-primary", className)}
      >
        {heart}
        {isFavorite ? "Saved" : "Save"}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-pressed={isFavorite}
      aria-label={label}
      disabled={isBusy}
      onClick={handleClick}
      className={cn(
        "rounded-full bg-card/85 ring-1 ring-border backdrop-blur-sm hover:bg-card hover:text-primary",
        isFavorite ? "text-primary" : "text-muted-foreground",
        className,
      )}
    >
      {heart}
    </Button>
  )
}
