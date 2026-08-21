"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config/config";
import { useGetItemsQuery } from "@/lib/features/items/itemsApi";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { FilterOperator, type ItemsQuery } from "@/lib/types/api";

export default function CatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "1");

  const debouncedQuery = useDebouncedValue(query, config.searchDebounceMs);
  const debouncedPrice = useDebouncedValue(maxPrice, config.searchDebounceMs);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) {
      params.set("q", debouncedQuery.trim());
    }
    if (debouncedPrice.trim()) {
      params.set("maxPrice", debouncedPrice.trim());
    }
    if (inStock) {
      params.set("inStock", "1");
    }
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  }, [debouncedQuery, debouncedPrice, inStock, pathname, router]);

  const priceValue = Number(debouncedPrice);
  const itemsQuery: ItemsQuery = {};
  if (debouncedQuery.trim()) {
    itemsQuery.names = debouncedQuery.trim();
  }
  if (debouncedPrice.trim() && Number.isFinite(priceValue) && priceValue > 0) {
    itemsQuery.price_op = FilterOperator.Lt;
    itemsQuery.price_value = priceValue;
  }
  if (inStock) {
    itemsQuery.stock_op = FilterOperator.Gt;
    itemsQuery.stock_value = 0;
  }

  const { data, isLoading } = useGetItemsQuery(
    Object.keys(itemsQuery).length > 0 ? itemsQuery : undefined,
  );

  return (
    <PageContainer>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Каталог
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Фильтруйте по названию, цене и наличию
      </p>

      <div className="mt-6 grid gap-4 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border md:grid-cols-[1fr_12rem_auto] md:items-end">
        <div className="grid gap-2">
          <Label htmlFor="catalog-search">Поиск</Label>
          <Input
            id="catalog-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Название товара"
            className="h-11 text-sm md:text-sm"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="catalog-price">Цена до, $</Label>
          <Input
            id="catalog-price"
            type="number"
            min="0"
            step="1"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="100"
            className="h-11 text-sm md:text-sm"
          />
        </div>
        <label
          htmlFor="catalog-stock"
          className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-input px-3 text-sm"
        >
          <input
            id="catalog-stock"
            type="checkbox"
            checked={inStock}
            onChange={(event) => setInStock(event.target.checked)}
            className="size-4 accent-primary"
          />
          Только в наличии
        </label>
      </div>

      <div className="mt-8">
        <ProductGrid items={data?.items ?? []} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
