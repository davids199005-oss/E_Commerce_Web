"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BubbleChatIcon,
  FavouriteIcon,
  Logout01Icon,
  Menu01Icon,
  Package01Icon,
  Search01Icon,
  Shield01Icon,
  ShoppingCart01Icon,
  UserCircleIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  loggedOut,
  selectIsAdmin,
  selectIsAuthenticated,
  selectUser,
} from "@/lib/features/auth/authSlice"
import { useGetActiveOrderQuery } from "@/lib/features/orders/ordersApi"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import type { User } from "@/lib/types/api"
import type { HeaderDensity, NavItem, SignedOutActionsProps } from "@/lib/types/components/layout"
import { cn } from "@/lib/utils"

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/catalog", label: "Catalog", icon: Search01Icon, requiresAuth: false },
  { href: "/favorites", label: "Favorites", icon: FavouriteIcon, requiresAuth: true },
  { href: "/cart", label: "Cart", icon: ShoppingCart01Icon, requiresAuth: true },
  { href: "/orders", label: "Orders", icon: Package01Icon, requiresAuth: true },
  { href: "/chat", label: "Assistant", icon: BubbleChatIcon, requiresAuth: true },
]

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SignedOutActions({ density }: SignedOutActionsProps): ReactElement {
  const inBar: boolean = density === "bar"
  return (
    <div
      className={cn(
        "gap-2",
        inBar
          ? "hidden items-center sm:flex"
          : "mt-4 flex flex-col border-t border-border pt-4",
      )}
    >
      <Button variant={inBar ? "ghost" : "outline"} size="lg" render={<Link href="/login" />}>
        Sign in
      </Button>
      <Button size="lg" render={<Link href="/register" />}>
        Create account
      </Button>
    </div>
  )
}

export function SiteHeader(): ReactElement {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname: string = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const isAuthenticated: boolean = useAppSelector(selectIsAuthenticated)
  const isAdmin: boolean = useAppSelector(selectIsAdmin)
  const user: User | null = useAppSelector(selectUser)

  const { cartCount } = useGetActiveOrderQuery(undefined, {
    skip: !isAuthenticated,
    selectFromResult: ({ data }): { cartCount: number | undefined } => ({
      cartCount:
        data === null || data === undefined
          ? undefined
          : data.items.reduce((total, line) => total + line.quantity, 0),
    }),
  })

  const items: readonly NavItem[] = NAV_ITEMS.filter(
    (item) => !item.requiresAuth || isAuthenticated,
  )

  function handleSignOut(): void {
    setIsMenuOpen(false)
    dispatch(loggedOut())
    router.push("/catalog")
  }

  function renderNavLink(item: NavItem, density: HeaderDensity): ReactElement {
    const active: boolean = isActive(pathname, item.href)
    const badge: number | undefined = item.href === "/cart" ? cartCount : undefined

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsMenuOpen(false)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-lg text-sm font-medium transition-colors",
          density === "bar" ? "px-3 py-2" : "px-3 py-2.5",
          active
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} />
        {item.label}
        {badge !== undefined && badge > 0 && (
          <span className="ml-auto inline-flex min-w-5 justify-center rounded-full bg-primary px-1.5 py-1 font-mono text-xs leading-none text-primary-foreground">
            {badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/catalog"
          className="shrink-0 font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          Ecom Shop
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((item) => renderNavLink(item, "bar"))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" />}>
                <HugeiconsIcon icon={UserCircleIcon} size={20} strokeWidth={1.8} />
                <span className="sr-only">Account</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.username ?? "Signed in"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/account" />}>
                  <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} />
                  Profile
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem render={<Link href="/admin" />}>
                    <HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} />
                    Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.8} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignedOutActions density="bar" />
          )}

          <Button
            variant="ghost"
            size="icon-lg"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={1.8} />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-base">Ecom Shop</SheetTitle>
          </SheetHeader>
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 pb-6">
            {items.map((item) => renderNavLink(item, "sheet"))}
            {!isAuthenticated && <SignedOutActions density="sheet" />}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
