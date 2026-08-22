"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnalyticsUpIcon, ArrowLeft01Icon, Package01Icon } from "@hugeicons/core-free-icons"
import type { AdminNavItem } from "@/lib/types/components/admin"
import { cn } from "@/lib/utils"

const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { href: "/admin/items", label: "Catalog", icon: Package01Icon },
  { href: "/admin/analytics", label: "Churn analytics", icon: AnalyticsUpIcon },
]

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminNav(): ReactElement {
  const pathname: string = usePathname()

  return (
    <nav aria-label="Admin" className="lg:w-52 lg:shrink-0">
      <div className="lg:sticky lg:top-24">
        <p className="mb-3 hidden text-xs font-medium tracking-wide text-muted-foreground uppercase lg:block">
          Admin
        </p>
        <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active: boolean = isActive(pathname, item.href)
            return (
              <li key={item.href} className="shrink-0 lg:shrink">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <Link
          href="/catalog"
          className="mt-4 hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.8} />
          Back to the shop
        </Link>
      </div>
    </nav>
  )
}
