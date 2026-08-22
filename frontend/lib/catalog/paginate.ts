import type { Page, PageToken } from "@/lib/types/catalog"

export function paginate<T>(items: readonly T[], page: number, size: number): Page<T> {
  const pageCount: number = Math.max(1, Math.ceil(items.length / size))
  const safePage: number = Math.min(Math.max(page, 1), pageCount)
  const start: number = (safePage - 1) * size
  const slice: readonly T[] = items.slice(start, start + size)

  return {
    items: slice,
    pageCount,
    from: slice.length === 0 ? 0 : start + 1,
    to: start + slice.length,
  }
}

export function buildPageRange(current: number, pageCount: number, window = 1): readonly PageToken[] {
  if (pageCount <= 1) return [1]

  const shown = new Set<number>([1, pageCount])
  for (let page = current - window; page <= current + window; page += 1) {
    if (page >= 1 && page <= pageCount) shown.add(page)
  }

  const sorted: number[] = [...shown].sort((left, right) => left - right)
  const tokens: PageToken[] = []
  let previous: number | null = null

  for (const page of sorted) {
    if (previous !== null && page - previous === 2) tokens.push(previous + 1)
    else if (previous !== null && page - previous > 2) tokens.push("gap")
    tokens.push(page)
    previous = page
  }

  return tokens
}
