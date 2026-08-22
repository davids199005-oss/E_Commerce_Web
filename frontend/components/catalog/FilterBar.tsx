"use client"

import { useState } from "react"
import type { KeyboardEvent, ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { TokenChip } from "@/components/catalog/SearchTokens"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatUsd } from "@/lib/format/money"
import type { ComparisonOp, NumericFilter, OpChoice } from "@/lib/types/catalog"
import type { ConditionComposerProps, FilterBarProps } from "@/lib/types/components/catalog"
import { cn } from "@/lib/utils"

const PRICE_OPS: readonly OpChoice[] = [
  { op: "lt", label: "Under" },
  { op: "gt", label: "Over" },
  { op: "eq", label: "Exactly" },
]

const STOCK_OPS: readonly OpChoice[] = [
  { op: "lt", label: "Fewer than" },
  { op: "gt", label: "More than" },
  { op: "eq", label: "Exactly" },
]

function priceLabel(filter: NumericFilter): string {
  const money: string = formatUsd(filter.value)
  if (filter.op === "lt") return `Under ${money}`
  if (filter.op === "gt") return `Over ${money}`
  return `Exactly ${money}`
}

function stockLabel(filter: NumericFilter): string {
  if (filter.op === "eq" && filter.value === 0) return "Out of stock"
  if (filter.op === "lt") return `Under ${filter.value} in stock`
  if (filter.op === "gt") return `Over ${filter.value} in stock`
  return `Exactly ${filter.value} in stock`
}

function ConditionComposer({
  legend,
  ops,
  placeholder,
  onSubmit,
}: ConditionComposerProps): ReactElement {
  const [op, setOp] = useState<ComparisonOp>(ops[0].op)
  const [draft, setDraft] = useState<string>("")

  const parsed: number = Number.parseFloat(draft)
  const isComplete: boolean = draft.trim() !== "" && Number.isFinite(parsed) && parsed >= 0

  function submit(): void {
    if (!isComplete) return
    onSubmit({ op, value: parsed })
    setDraft("")
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== "Enter") return
    event.preventDefault()
    submit()
  }

  return (
    <div className="flex h-12 items-center gap-1 rounded-xl border border-border bg-card px-2">
      <span className="pr-1 text-xs font-medium text-muted-foreground">{legend}</span>
      <div role="group" aria-label={`${legend} comparison`} className="flex items-center gap-0.5">
        {ops.map((choice) => (
          <button
            key={choice.op}
            type="button"
            aria-pressed={op === choice.op}
            onClick={() => setOp(choice.op)}
            className={cn(
              "rounded-lg px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              op === choice.op
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {choice.label}
          </button>
        ))}
      </div>
      <Input
        type="text"
        inputMode="decimal"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={`${legend} value`}
        placeholder={placeholder}
        className="h-8 w-20 rounded-lg font-mono"
      />
      <Button size="lg" variant="ghost" disabled={!isComplete} onClick={submit}>
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        Add
      </Button>
    </div>
  )
}

export function FilterBar({
  price,
  stock,
  onPriceChange,
  onStockChange,
  canClear,
  onClearAll,
}: FilterBarProps): ReactElement {
  const hasFilterChips: boolean = price !== null || stock !== null

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <ConditionComposer
          legend="Price"
          ops={PRICE_OPS}
          placeholder="50"
          onSubmit={onPriceChange}
        />
        <ConditionComposer
          legend="Stock"
          ops={STOCK_OPS}
          placeholder="5"
          onSubmit={onStockChange}
        />
        <Button
          size="lg"
          variant="outline"
          className="h-12 rounded-xl px-3"
          onClick={() => onStockChange({ op: "eq", value: 0 })}
        >
          Out of stock
        </Button>
      </div>

      {(hasFilterChips || canClear) && (
        <div className="flex flex-wrap items-center gap-2">
          {hasFilterChips && <span className="text-sm text-muted-foreground">Also limited to:</span>}
          {price !== null && (
            <TokenChip
              label={priceLabel(price)}
              removeLabel={`price filter ${priceLabel(price)}`}
              onRemove={() => onPriceChange(null)}
            />
          )}
          {stock !== null && (
            <TokenChip
              label={stockLabel(stock)}
              removeLabel={`stock filter ${stockLabel(stock)}`}
              onRemove={() => onStockChange(null)}
            />
          )}
          {canClear && (
            <Button size="lg" variant="ghost" className="ml-auto" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
