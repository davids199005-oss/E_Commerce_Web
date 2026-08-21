"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/catalog/ProductImage";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import { useAddFavoriteMutation } from "@/lib/features/favorites/favoritesApi";
import { useAddOrderItemMutation } from "@/lib/features/orders/ordersApi";
import { useAppSelector } from "@/lib/hooks/hooks";
import { formatMoney } from "@/lib/money/formatMoney";
import type { Item } from "@/lib/types/api";

export function ProductCard({ item }: { item: Item }) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const inStock = item.stock_qty > 0;
  const [addOrderItem, addState] = useAddOrderItemMutation();
  const [addFavorite, favoriteState] = useAddFavoriteMutation();

  async function handleAddToCart(): Promise<void> {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await addOrderItem({ item_id: item.id, quantity: 1 }).unwrap();
      toast.success("Товар добавлен в корзину");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  async function handleFavorite(): Promise<void> {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await addFavorite(item.id).unwrap();
      toast.success("Добавлено в избранное");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border transition-shadow duration-200 hover:shadow-md">
      <Link
        href={`/items/${item.id}`}
        className="relative block aspect-square cursor-pointer overflow-hidden bg-muted"
      >
        <ProductImage imageUrl={item.image_url} alt={item.name} />
        {!inStock ? (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-white/90 text-foreground"
          >
            Нет в наличии
          </Badge>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/items/${item.id}`}
          className="cursor-pointer font-heading text-sm font-semibold text-foreground transition-colors duration-200 hover:text-primary"
        >
          {item.name}
        </Link>
        <p className="text-base font-semibold tracking-tight text-foreground">
          {formatMoney(item.price_usd)}
        </p>
        <div className="mt-auto flex gap-2">
          <Button
            size="lg"
            className="h-11 flex-1"
            disabled={!inStock || addState.isLoading}
            onClick={() => {
              void handleAddToCart();
            }}
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} data-icon="inline-start" />
            В корзину
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-xl"
            aria-label="В избранное"
            disabled={favoriteState.isLoading}
            onClick={() => {
              void handleFavorite();
            }}
          >
            <HugeiconsIcon icon={FavouriteIcon} />
          </Button>
        </div>
      </div>
    </article>
  );
}
