"use client"

import type { ReactElement } from "react"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import type { ShopLayoutProps } from "@/lib/types/components/layout"

export default function ShopLayout({ children }: ShopLayoutProps): ReactElement {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
