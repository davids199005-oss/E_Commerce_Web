"use client";

import { toast } from "sonner";

import { AuthGate } from "@/components/auth/AuthGate";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/lib/features/favorites/favoritesApi";

function FavoritesContent() {
  const { data, isLoading } = useGetFavoritesQuery();
  const [removeFavorite, removeState] = useRemoveFavoriteMutation();
  const items = data?.items ?? [];

  async function handleClearOne(itemId: number): Promise<void> {
    try {
      await removeFavorite(itemId).unwrap();
      toast.success("Удалено из избранного");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <div className="grid gap-6">
      <ProductGrid items={items} isLoading={isLoading} />
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              disabled={removeState.isLoading}
              onClick={() => {
                void handleClearOne(item.id);
              }}
            >
              Убрать {item.name}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <AuthGate>
      <PageContainer>
        <h1 className="mb-6 font-heading text-3xl font-semibold tracking-tight">
          Избранное
        </h1>
        <FavoritesContent />
      </PageContainer>
    </AuthGate>
  );
}
