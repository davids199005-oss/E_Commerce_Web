import { ProductCard } from "@/components/catalog/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Item } from "@/lib/types/api";

export function ProductGrid({
  items,
  isLoading,
}: {
  items: Item[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-xl ring-1 ring-border">
            <Skeleton className="aspect-square w-full" />
            <div className="grid gap-3 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-card px-6 py-16 text-center shadow-sm ring-1 ring-border">
        <p className="text-base font-medium text-foreground">Ничего не найдено</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Попробуйте другой запрос или сбросьте фильтры.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
