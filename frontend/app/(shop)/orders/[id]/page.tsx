"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { AuthGate } from "@/components/auth/AuthGate";
import { ProductImage } from "@/components/catalog/ProductImage";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderQuery } from "@/lib/features/orders/ordersApi";
import { formatMoney, parseMoney } from "@/lib/money/formatMoney";
import { formatOrderStatus } from "@/lib/orders/formatOrderStatus";

function OrderDetailContent({ orderId }: { orderId: number }) {
  const { data: order, isLoading, isError } = useGetOrderQuery(orderId);

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (isError || !order) {
    return <p>Заказ не найден</p>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Заказ №{order.id}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleString("ru-RU")} ·{" "}
            {order.shipping_city}, {order.shipping_country}
          </p>
        </div>
        <Badge>{formatOrderStatus(order.status)}</Badge>
      </div>
      <div className="grid gap-3">
        {order.items.map((item) => (
          <div
            key={item.item_id}
            className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border"
          >
            <div className="relative size-16 overflow-hidden rounded-lg bg-muted">
              <ProductImage imageUrl={item.image_url} alt={item.name} />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/items/${item.item_id}`} className="font-medium">
                {item.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {item.quantity} × {formatMoney(item.unit_price)}
              </p>
            </div>
            <p className="font-semibold">
              {formatMoney(parseMoney(item.unit_price) * item.quantity)}
            </p>
          </div>
        ))}
      </div>
      <p className="text-right text-xl font-semibold">
        Итого: {formatMoney(order.total_price_usd)}
      </p>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);

  return (
    <AuthGate>
      <PageContainer>
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          К заказам
        </Link>
        {Number.isFinite(orderId) ? (
          <OrderDetailContent orderId={orderId} />
        ) : (
          <p>Некорректный заказ</p>
        )}
      </PageContainer>
    </AuthGate>
  );
}
