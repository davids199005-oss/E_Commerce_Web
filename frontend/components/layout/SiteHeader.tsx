"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Chat01Icon,
  FavouriteIcon,
  Logout01Icon,
  Menu01Icon,
  Search01Icon,
  ShoppingBag01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/lib/api/api";
import { loggedOut } from "@/lib/features/auth/authSlice";
import { authStorage } from "@/lib/features/auth/authStorage";
import { useGetActiveOrderQuery } from "@/lib/features/orders/ordersApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/favorites", label: "Избранное" },
  { href: "/chat", label: "Помощник" },
] as const;

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: activeOrder } = useGetActiveOrderQuery(undefined, {
    skip: !token,
  });
  const cartCount =
    activeOrder?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  function submitSearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const nextQuery = query.trim();
    router.push(
      nextQuery
        ? `/catalog?q=${encodeURIComponent(nextQuery)}`
        : "/catalog",
    );
    setMenuOpen(false);
  }

  function handleLogout(): void {
    authStorage.clear();
    dispatch(loggedOut());
    dispatch(api.util.resetApiState());
    router.push("/");
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xl"
                className="md:hidden"
                aria-label="Открыть меню"
              />
            }
          >
            <HugeiconsIcon icon={Menu01Icon} />
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle>Lumina</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-1 p-3" aria-label="Мобильная навигация">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              {user?.is_admin ? (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
                >
                  Админка
                </Link>
              ) : null}
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          Lumina
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Основное меню">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-muted hover:text-foreground",
                pathname.startsWith(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          className="ml-auto hidden min-w-0 flex-1 max-w-md md:flex"
        >
          <label htmlFor="header-search" className="sr-only">
            Поиск товаров
          </label>
          <div className="relative w-full">
            <HugeiconsIcon
              icon={Search01Icon}
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="header-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти товар"
              className="h-11 pr-3 pl-9 text-sm md:text-sm"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button
            variant="ghost"
            size="icon-xl"
            aria-label="Избранное"
            className="hidden sm:inline-flex"
            render={<Link href="/favorites" />}
          >
            <HugeiconsIcon icon={FavouriteIcon} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xl"
            aria-label="Корзина"
            className="relative"
            render={<Link href="/cart" />}
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} />
            {cartCount > 0 ? (
              <Badge className="absolute top-1 right-1 h-5 min-w-5 px-1">
                {cartCount}
              </Badge>
            ) : null}
          </Button>

          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xl"
                    aria-label="Аккаунт"
                  />
                }
              >
                <HugeiconsIcon icon={UserIcon} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/account")}
                >
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/orders")}
                >
                  Заказы
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/chat")}
                >
                  <HugeiconsIcon icon={Chat01Icon} />
                  Помощник
                </DropdownMenuItem>
                {user?.is_admin ? (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/admin")}
                  >
                    Админка
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  <HugeiconsIcon icon={Logout01Icon} />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="lg" className="h-11 px-4" render={<Link href="/login" />}>
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
