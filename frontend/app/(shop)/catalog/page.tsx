"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactElement } from "react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { CatalogPagination } from "@/components/catalog/CatalogPagination"
import { FilterBar } from "@/components/catalog/FilterBar"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { SearchTokens } from "@/components/catalog/SearchTokens"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingGrid } from "@/components/feedback/LoadingGrid"
import { PageContainer } from "@/components/layout/PageContainer"
import { Button } from "@/components/ui/button"
import { paginate } from "@/lib/catalog/paginate"
import { config } from "@/lib/config/config"
import { useListItemsQuery } from "@/lib/features/items/itemsApi"
import type { Item } from "@/lib/types/api"
import type { CatalogPageState, NumericFilter, Page } from "@/lib/types/catalog"
import { cn } from "@/lib/utils"

export default function CatalogPage(): ReactElement {
  const [tokens, setTokens] = useState<readonly string[]>([])
  const [committedTokens, setCommittedTokens] = useState<readonly string[]>([])
  const [price, setPrice] = useState<NumericFilter | null>(null)
  const [stock, setStock] = useState<NumericFilter | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setCommittedTokens(tokens), config.searchDebounceMs)
    return () => clearTimeout(timer)
  }, [tokens])

  const { data, error, isLoading, isFetching, refetch } = useListItemsQuery({
    names: committedTokens,
    price: price ?? undefined,
    stock: stock ?? undefined,
  })

  const items: readonly Item[] = useMemo(() => data?.items ?? [], [data])
  const hasConditions: boolean = tokens.length > 0 || price !== null || stock !== null

  const conditionsKey: string = JSON.stringify({ names: committedTokens, price, stock })
  const [pageState, setPageState] = useState<CatalogPageState>({
    key: conditionsKey,
    page: 1,
  })
  const page: number = pageState.key === conditionsKey ? pageState.page : 1

  const current: Page<Item> = paginate(items, page, config.catalogPageSize)

  function goToPage(next: number): void {
    setPageState({ key: conditionsKey, page: next })
    const reduceMotion: boolean = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  }

  function clearAll(): void {
    setTokens([])
    setPrice(null)
    setStock(null)
  }

  const noun: string = items.length === 1 ? "product" : "products"
  const scope: string = hasConditions ? "matching your conditions" : "in the catalog"
  const summary: string =
    current.pageCount > 1
      ? `Showing ${current.from}–${current.to} of ${items.length} ${noun} ${scope}`
      : `${items.length} ${noun} ${scope}`

  return (
    <PageContainer>
      <h1 className="sr-only">Catalog</h1>

      <section aria-label="Search and filter the catalog" className="mb-8 space-y-4 sm:mb-10">
        <SearchTokens tokens={tokens} onChange={setTokens} />
        <FilterBar
          price={price}
          stock={stock}
          onPriceChange={setPrice}
          onStockChange={setStock}
          canClear={hasConditions}
          onClearAll={clearAll}
        />
      </section>

      {isLoading ? (
        <LoadingGrid count={config.catalogPageSize} />
      ) : error !== undefined ? (
        <ErrorState error={error} onRetry={refetch} title="The catalog did not load" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Search01Icon}
          title="Nothing on the shelves matches that"
          description="Words are matched against product names only, so a shorter one reaches further — sun finds both Sunglasses and Sunscreen. Dropping a price or stock chip widens the search too."
          action={
            hasConditions ? (
              <Button size="lg" onClick={clearAll}>
                Clear all conditions
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p
            aria-live="polite"
            className={cn(
              "mb-4 text-sm text-muted-foreground transition-opacity",
              isFetching && "opacity-50",
            )}
          >
            {summary}
          </p>
          <ProductGrid items={current.items} />
          <CatalogPagination
            page={page}
            pageCount={current.pageCount}
            onPageChange={goToPage}
          />
        </>
      )}
    </PageContainer>
  )
}
