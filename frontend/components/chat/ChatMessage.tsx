"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, AiMagicIcon, Loading03Icon } from "@hugeicons/core-free-icons"
import type { ChatMessageProps } from "@/lib/types/components/chat"
import { cn } from "@/lib/utils"

const BUBBLE_BASE =
  "max-w-[85ch] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words"

function AssistantMark(): ReactElement {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"
    >
      <HugeiconsIcon icon={AiMagicIcon} size={16} strokeWidth={1.8} />
    </span>
  )
}

export function ChatMessage({ turn }: ChatMessageProps): ReactElement {
  switch (turn.kind) {
    case "user":
      return (
        <div className="flex justify-end">
          <p className={cn(BUBBLE_BASE, "bg-primary text-primary-foreground")}>{turn.text}</p>
        </div>
      )
    case "notice":
      return (
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
          >
            <HugeiconsIcon icon={Alert02Icon} size={16} strokeWidth={1.8} />
          </span>
          <p
            role="status"
            className={cn(BUBBLE_BASE, "border border-border bg-muted text-muted-foreground")}
          >
            {turn.text}
          </p>
        </div>
      )
    case "assistant":
      return (
        <div className="flex items-start gap-3">
          <AssistantMark />
          <p className={cn(BUBBLE_BASE, "border border-border bg-card text-foreground")}>
            {turn.text}
          </p>
        </div>
      )
    default: {
      const _exhaustive: never = turn.kind
      return _exhaustive
    }
  }
}

export function ChatThinking(): ReactElement {
  return (
    <div className="flex items-start gap-3">
      <AssistantMark />
      <p
        className={cn(
          BUBBLE_BASE,
          "flex items-center gap-2 border border-border bg-card text-muted-foreground",
        )}
      >
        <HugeiconsIcon icon={Loading03Icon} size={16} strokeWidth={1.8} className="animate-spin" />
        Reading the catalog. This takes a moment.
      </p>
    </div>
  )
}
