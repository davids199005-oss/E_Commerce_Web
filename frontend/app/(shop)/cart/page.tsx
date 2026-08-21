"use client";

import Link from "next/link";
import { toast } from "sonner";

import { AuthGate } from "@/components/auth/AuthGate";
import { ProductImage } from "@/components/catalog/ProductImage";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import {
  useClearActiveOrderMutation,
  useGetActiveOrderQuery,
  usePurchaseOrderMutation,
  useRemoveOrderItemMutation,
  useUpdateOrderItemQuantityMutation,
} from "@/lib/features/orders/ordersApi";
import { formatMoney, parseMoney } from "@/lib/money/formatMoney";
import { cn } from "@/lib/utils";

function CartContent() {
  const { data: order, isLoading } = useGetActiveOrderQuery();
  const [updateQuantity, updateState] = useUpdateOrderItemQuantityMutation();
  const [removeItem, removeState] = useRemoveOrderItemMutation();
  const [clearOrder, clearState] = useClearActiveOrderMutation();
  const [purchase, purchaseState] = usePurchaseOrderMutation();

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (!order || order.items.length === 0) {
    return (
      <div className="rounded-xl bg-card px-6 py-16 text-center shadow-sm ring-1 ring-border">
        <p className="text-base font-medium">Корзина пуста</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Добавьте товары из каталога, чтобы оформить заказ.
        </p>
        <Link
          href="/catalog"
          className={cn(buttonVariants({ size: "xl" }), "mt-6 inline-flex")}
        >
          В каталог
        </Link>
      </div>
    );
  }

  async function handleQuantity(itemId: number, quantity: number): Promise<void> {
    if (quantity < 1) {
      return;
    }
    try {
      await updateQuantity({ itemId, quantity }).unwrap();
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  async function handleRemove(itemId: number): Promise<void> {
    try {
      await removeItem(itemId).unwrap();
      toast.success("Товар удалён");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  async function handleClear(): Promise<void> {
    try {
      await clearOrder().unwrap();
      toast.success("Корзина очищена");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  async function handlePurchase(): Promise<void> {
    try {
      await purchase().unwrap();
      toast.success("Заказ оформлен");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="grid gap-4">
        {order.items.map((item) => (
          <div
            key={item.item_id}
            className="flex gap-4 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border"
          >
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              <ProductImage imageUrl={item.image_url} alt={item.name} />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/items/${item.item_id}`}
                className="font-medium hover:text-primary"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatMoney(item.unit_price)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={item.stock_qty}
                  className="h-11 w-24 text-sm md:text-sm"
                  defaultValue={item.quantity}
                  disabled={updateState.isLoading}
                  onBlur={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isFinite(next) && next !== item.quantity) {
                      void handleQuantity(item.item_id, next);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  disabled={removeState.isLoading}
                  onClick={() => {
                    void handleRemove(item.item_id);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </div>
            <p className="font-semibold">
              {formatMoney(parseMoney(item.unit_price) * item.quantity)}
            </p>
          </div>
        ))}
      </div>
      <aside className="h-fit rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h2 className="font-heading text-lg font-semibold">Итого</h2>
        <p className="mt-3 text-2xl font-semibold">
          {formatMoney(order.total_price_usd)}
        </p>
        <Button
          size="xl"
          className="mt-6 w-full"
          disabled={purchaseState.isLoading}
          onClick={() => {
            void handlePurchase();
          }}
        >
          Оформить заказ
        </Button>
        <Button
          variant="outline"
          size="xl"
          className="mt-2 w-full"
          disabled={clearState.isLoading}
          onClick={() => {
            void handleClear();
          }}
        >
          Очистить корзину
        </Button>
      </aside>
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthGate>
      <PageContainer>
        <h1 className="mb-6 font-heading text-3xl font-semibold tracking-tight">
          Корзина
        </h1>
        <CartContent />
      </PageContainer>
    </AuthGate>
  );
}
