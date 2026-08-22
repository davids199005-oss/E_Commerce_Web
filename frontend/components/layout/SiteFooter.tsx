"use client"

import type { ReactElement } from "react"

export function SiteFooter(): ReactElement {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-xs text-muted-foreground">
          Ecom Shop. A small catalog of everyday things.
        </p>
      </div>
    </footer>
  )
}
