"use client"

import type { ReactElement } from "react"
import { AdminNav } from "@/components/admin/AdminNav"
import { AdminGate } from "@/components/auth/AdminGate"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import type { AdminLayoutProps } from "@/lib/types/components/admin"

export default function AdminLayout({ children }: AdminLayoutProps): ReactElement {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <AdminGate>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:flex-row lg:gap-10 lg:px-8">
            <AdminNav />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </AdminGate>
      </main>
      <SiteFooter />
    </div>
  )
}
