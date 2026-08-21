"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Chat01Icon,
  DeliveryTruck01Icon,
  Search01Icon,
  RepeatIcon,
} from "@hugeicons/core-free-icons";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetItemsQuery } from "@/lib/features/items/itemsApi";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: DeliveryTruck01Icon,
    title: "Быстрая доставка",
    text: "Соберём заказ и отправим в ваш город без лишней суеты.",
  },
  {
    icon: RepeatIcon,
    title: "Простой возврат",
    text: "Не подошло — поможем оформить возврат и найти замену.",
  },
  {
    icon: Chat01Icon,
    title: "Умный помощник",
    text: "Спросите ассистента, какой товар подойдёт именно вам.",
  },
] as const;

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { data, isLoading } = useGetItemsQuery();
  const featured = (data?.items ?? []).slice(0, 8);

  function handleSearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const nextQuery = query.trim();
    router.push(
      nextQuery ? `/catalog?q=${encodeURIComponent(nextQuery)}` : "/catalog",
    );
  }

  return (
    <div>
      <section className="border-b border-border bg-card">
        <PageContainer className="grid gap-8 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary">Маркетплейс Lumina</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Всё нужное — на светлой витрине
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Одежда, дом, техника и детские товары в одном каталоге. Ищите,
              сравнивайте и оформляйте заказ за пару шагов.
            </p>
            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="home-search" className="sr-only">
                Поиск по каталогу
              </label>
              <div className="relative min-w-0 flex-1">
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="home-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Наушники, лампа, кроссовки..."
                  className="h-11 pl-9 text-sm md:text-sm"
                />
              </div>
              <Button type="submit" size="xl">
                Найти
              </Button>
            </form>
            <div className="mt-4">
              <Link
                href="/catalog"
                className={cn(buttonVariants({ variant: "outline", size: "xl" }))}
              >
                Смотреть каталог
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-accent p-8 ring-1 ring-border">
            <p className="text-sm font-medium text-accent-foreground">
              Сегодня на витрине
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold">
              {data?.items.length ?? "—"} товаров
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Живые остатки, избранное и чат-помощник, который знает ассортимент
              магазина.
            </p>
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Популярное
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Подборка из текущего каталога
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80"
          >
            Весь каталог
          </Link>
        </div>
        <ProductGrid items={featured} isLoading={isLoading} />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border"
            >
              <HugeiconsIcon icon={feature.icon} className="size-6 text-primary" />
              <h3 className="mt-3 font-heading text-base font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
