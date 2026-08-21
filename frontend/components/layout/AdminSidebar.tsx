"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnalyticsUpIcon,
  Package01Icon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { href: "/admin", label: "Обзор", icon: DashboardSquare01Icon, exact: true },
  { href: "/admin/items", label: "Товары", icon: Package01Icon, exact: false },
  {
    href: "/admin/analytics",
    label: "Аналитика",
    icon: AnalyticsUpIcon,
    exact: false,
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-border bg-card md:w-60 md:border-r md:border-b-0">
      <div className="px-4 py-5">
        <Link href="/" className="font-heading text-lg font-semibold">
          Lumina
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Админ-панель</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col" aria-label="Админка">
        {ADMIN_LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <HugeiconsIcon icon={link.icon} className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
