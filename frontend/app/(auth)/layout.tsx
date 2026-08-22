"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import type { AuthLayoutProps } from "@/lib/types/components/auth"

export default function AuthLayout({ children }: AuthLayoutProps): ReactElement {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-accent/30 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/catalog"
          className="block text-center font-heading text-xl font-semibold tracking-tight text-foreground"
        >
          Ecom Shop
        </Link>

        <main className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
          {children}
        </main>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/catalog" className="underline-offset-4 hover:underline">
            Back to the catalog
          </Link>
        </p>
      </div>
    </div>
  )
}
