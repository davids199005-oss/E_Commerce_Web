"use client"

import { useState } from "react"
import type { ChangeEvent, KeyboardEvent, ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import type { SearchTokensProps, TokenChipProps } from "@/lib/types/components/catalog"

export function TokenChip({ label, removeLabel, onRemove }: TokenChipProps): ReactElement {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-lg bg-accent pr-1 pl-3 text-sm font-medium text-accent-foreground">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${removeLabel}`}
        className="flex size-6 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2.4} />
      </button>
    </span>
  )
}

const SEPARATOR = ","

export function SearchTokens({ tokens, onChange }: SearchTokensProps): ReactElement {
  const [draft, setDraft] = useState<string>("")

  function commit(parts: readonly string[]): void {
    const next: string[] = [...tokens]
    for (const part of parts) {
      const token: string = part.trim().toLowerCase()
      if (token !== "" && !next.includes(token)) {
        next.push(token)
      }
    }
    if (next.length !== tokens.length) {
      onChange(next)
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const value: string = event.target.value
    if (!value.includes(SEPARATOR)) {
      setDraft(value)
      return
    }
    const parts: string[] = value.split(SEPARATOR)
    const tail: string = parts.pop() ?? ""
    commit(parts)
    setDraft(tail)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      event.preventDefault()
      commit([draft])
      setDraft("")
      return
    }
    if (event.key === "Backspace" && draft === "" && tokens.length > 0) {
      event.preventDefault()
      onChange(tokens.slice(0, -1))
    }
  }

  function handleBlur(): void {
    if (draft.trim() === "") return
    commit([draft])
    setDraft("")
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
          <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.8} />
        </span>
        <Input
          type="text"
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          aria-label="Search product names"
          aria-describedby="search-token-semantics"
          placeholder={'Type a word, press Enter — try "sun", then "table"'}
          className="h-14 rounded-2xl border-border bg-card pr-4 pl-12 text-base shadow-sm md:text-base"
        />
      </div>

      <div id="search-token-semantics" className="flex flex-wrap items-center gap-2">
        {tokens.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every word becomes a chip, and a product matches when{" "}
            <span className="font-medium text-foreground">any</span> chip appears in its name. Two
            words widen the search rather than narrowing it.
          </p>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">Matching any of:</span>
            {tokens.map((token) => (
              <TokenChip
                key={token}
                label={token}
                removeLabel={`search word ${token}`}
                onRemove={() => onChange(tokens.filter((candidate) => candidate !== token))}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
