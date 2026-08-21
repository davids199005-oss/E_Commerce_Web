"use client";

import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { useGetItemsQuery } from "@/lib/features/items/itemsApi";
import { useListUsersQuery } from "@/lib/features/users/usersApi";
import { cn } from "@/lib/utils";

export default function AdminHomePage() {
  const { data: items } = useGetItemsQuery();
  const { data: users } = useListUsersQuery();

  return (
    <PageContainer>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Обзор
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Управление каталогом и аналитика оттока
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
          <p className="text-sm text-muted-foreground">Товары</p>
          <p className="mt-2 font-heading text-3xl font-semibold">
            {items?.items.length ?? "—"}
          </p>
          <Link
            href="/admin/items"
            className={cn(buttonVariants({ size: "xl" }), "mt-4 inline-flex")}
          >
            Каталог
          </Link>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
          <p className="text-sm text-muted-foreground">Пользователи</p>
          <p className="mt-2 font-heading text-3xl font-semibold">
            {users?.users.length ?? "—"}
          </p>
          <Link
            href="/admin/analytics"
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "mt-4 inline-flex",
            )}
          >
            Аналитика оттока
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
