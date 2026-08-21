"use client";

import Link from "next/link";

import { AuthGate } from "@/components/auth/AuthGate";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrdersQuery } from "@/lib/features/orders/ordersApi";
import { formatMoney } from "@/lib/money/formatMoney";
import { formatOrderStatus } from "@/lib/orders/formatOrderStatus";
import { OrderStatus } from "@/lib/types/api";
import { cn } from "@/lib/utils";

function OrdersContent() {
  const { data, isLoading } = useGetOrdersQuery();
  const orders = data?.orders ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl bg-card px-6 py-16 text-center shadow-sm ring-1 ring-border">
        <p className="text-base font-medium">Заказов пока нет</p>
        <Link
          href="/catalog"
          className={cn(buttonVariants({ size: "xl" }), "mt-6 inline-flex")}
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={
            order.status === OrderStatus.Temp ? "/cart" : `/orders/${order.id}`
          }
          className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border transition-shadow duration-200 hover:shadow-md"
        >
          <div>
            <p className="font-medium">Заказ №{order.id}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleString("ru-RU")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatMoney(order.total_price_usd)}</p>
            <Badge
              variant={
                order.status === OrderStatus.Closed ? "secondary" : "default"
              }
              className="mt-2"
            >
              {formatOrderStatus(order.status)}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGate>
      <PageContainer>
        <h1 className="mb-6 font-heading text-3xl font-semibold tracking-tight">
          Заказы
        </h1>
        <OrdersContent />
      </PageContainer>
    </AuthGate>
  );
}
