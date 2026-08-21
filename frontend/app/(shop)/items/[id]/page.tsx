"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  FavouriteIcon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";

import { ProductImage } from "@/components/catalog/ProductImage";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import { useAddFavoriteMutation } from "@/lib/features/favorites/favoritesApi";
import { useGetItemQuery } from "@/lib/features/items/itemsApi";
import { useAddOrderItemMutation } from "@/lib/features/orders/ordersApi";
import { useAppSelector } from "@/lib/hooks/hooks";
import { formatMoney } from "@/lib/money/formatMoney";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const itemId = Number(params.id);
  const token = useAppSelector((state) => state.auth.token);
  const [quantity, setQuantity] = useState(1);
  const { data: item, isLoading, isError } = useGetItemQuery(itemId, {
    skip: !Number.isFinite(itemId),
  });
  const [addOrderItem, addState] = useAddOrderItemMutation();
  const [addFavorite, favoriteState] = useAddFavoriteMutation();

  async function handleAddToCart(): Promise<void> {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await addOrderItem({ item_id: itemId, quantity }).unwrap();
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
      await addFavorite(itemId).unwrap();
      toast.success("Добавлено в избранное");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  if (isLoading) {
    return (
      <PageContainer className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="grid gap-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-11 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !item) {
    return (
      <PageContainer>
        <p className="text-base font-medium">Товар не найден</p>
        <Link href="/catalog" className="mt-4 inline-block text-sm text-primary">
          Вернуться в каталог
        </Link>
      </PageContainer>
    );
  }

  const inStock = item.stock_qty > 0;

  return (
    <PageContainer>
      <Link
        href="/catalog"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        В каталог
      </Link>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
          <ProductImage
            imageUrl={item.image_url}
            alt={item.name}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            {item.name}
          </h1>
          <p className="mt-4 text-3xl font-semibold">{formatMoney(item.price_usd)}</p>
          <div className="mt-4">
            {inStock ? (
              <Badge variant="secondary">В наличии: {item.stock_qty}</Badge>
            ) : (
              <Badge variant="destructive">Нет в наличии</Badge>
            )}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-[8rem_1fr]">
            <div className="grid gap-2">
              <Label htmlFor="qty">Количество</Label>
              <Input
                id="qty"
                type="number"
                min={1}
                max={Math.max(item.stock_qty, 1)}
                value={quantity}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setQuantity(Number.isFinite(next) && next > 0 ? next : 1);
                }}
                className="h-11 text-sm md:text-sm"
                disabled={!inStock}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                size="xl"
                className="flex-1"
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
        </div>
      </div>
    </PageContainer>
  );
}
