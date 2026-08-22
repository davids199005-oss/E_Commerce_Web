"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { AuthGate } from "@/components/auth/AuthGate"
import { FavoriteItemCard } from "@/components/favorites/FavoriteItemCard"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingGrid } from "@/components/feedback/LoadingGrid"
import { PageContainer } from "@/components/layout/PageContainer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useListFavoritesQuery } from "@/lib/features/favorites/favoritesApi"
import type { Item } from "@/lib/types/api"

function FavoritesView(): ReactElement {
  const { data, isLoading, isError, error, refetch } = useListFavoritesQuery()
  const items: readonly Item[] = data ?? []

  return (
    <PageContainer
      title="Favorites"
      description="Everything you saved, with prices and stock straight from the catalog."
      actions={
        items.length > 0 ? (
          <Badge variant="outline" className="font-mono">
            {items.length} saved
          </Badge>
        ) : undefined
      }
    >
      {isLoading ? (
        <LoadingGrid count={4} />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} title="Favorites did not load" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={FavouriteIcon}
          title="Nothing saved yet"
          description="Tap the heart on any product and it will wait for you here."
          action={
            <Button size="lg" render={<Link href="/catalog" />}>
              Browse the catalog
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <FavoriteItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}

export default function FavoritesPage(): ReactElement {
  return (
    <AuthGate>
      <FavoritesView />
    </AuthGate>
  )
}
