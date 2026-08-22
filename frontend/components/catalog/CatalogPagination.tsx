"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { buildPageRange } from "@/lib/catalog/paginate"
import type { PageToken } from "@/lib/types/catalog"
import type { CatalogPaginationProps } from "@/lib/types/components/catalog"
import { cn } from "@/lib/utils"

export function CatalogPagination({
  page,
  pageCount,
  onPageChange,
}: CatalogPaginationProps): ReactElement | null {
  if (pageCount <= 1) return null

  const tokens: readonly PageToken[] = buildPageRange(page, pageCount)

  return (
    <nav aria-label="Catalog pages" className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
      </Button>

      <p className="px-2 text-sm text-muted-foreground sm:hidden" aria-hidden="true">
        Page {page} of {pageCount}
      </p>

      <ul className="hidden items-center gap-1 sm:flex">
        {tokens.map((token, index) =>
          token === "gap" ? (
            <li
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-sm text-muted-foreground select-none"
            >
              &hellip;
            </li>
          ) : (
            <li key={token}>
              <Button
                variant={token === page ? "default" : "ghost"}
                size="icon"
                onClick={() => onPageChange(token)}
                aria-label={`Page ${token}`}
                aria-current={token === page ? "page" : undefined}
                className={cn("font-mono tabular-nums", token === page && "pointer-events-none")}
              >
                {token}
              </Button>
            </li>
          ),
        )}
      </ul>

      <Button
        variant="outline"
        size="icon"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
      </Button>
    </nav>
  )
}
