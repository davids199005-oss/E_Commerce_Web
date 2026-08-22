"use client"

import type { KeyboardEvent, ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SentIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CHAT_MESSAGE_MAX_LENGTH } from "@/lib/features/chat/chatApi"
import type { ChatComposerProps } from "@/lib/types/components/chat"
import { cn } from "@/lib/utils"

const COUNTER_ID = "chat-composer-counter"

export function ChatComposer({
  value,
  onValueChange,
  onSend,
  isSending,
  blockedReason,
}: ChatComposerProps): ReactElement {
  const isBlocked: boolean = blockedReason !== undefined
  const isOverLimit: boolean = value.length > CHAT_MESSAGE_MAX_LENGTH
  const isEmpty: boolean = value.trim().length === 0
  const canSend: boolean = !isBlocked && !isSending && !isEmpty && !isOverLimit

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key !== "Enter" || event.shiftKey) return
    if (event.nativeEvent.isComposing) return
    event.preventDefault()
    if (canSend) onSend()
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
      <Label htmlFor="chat-composer" className="sr-only">
        Message the assistant
      </Label>
      <Textarea
        id="chat-composer"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isBlocked || isSending}
        aria-invalid={isOverLimit}
        aria-describedby={COUNTER_ID}
        placeholder="Ask about prices, stock, or what would suit what you are shopping for"
        className="max-h-56 min-h-20 overflow-y-auto border-0 bg-transparent px-1 text-sm aria-invalid:ring-0 focus-visible:ring-0 md:text-sm"
      />

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-3">
        <p
          className={cn(
            "min-w-0 flex-1 text-xs text-muted-foreground",
            isBlocked ? "block" : "hidden sm:block",
          )}
        >
          {blockedReason ?? "Enter sends, Shift + Enter starts a new line"}
        </p>
        <p
          id={COUNTER_ID}
          className={cn(
            "ml-auto font-mono text-xs tabular-nums",
            isOverLimit ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {value.length} / {CHAT_MESSAGE_MAX_LENGTH}
        </p>
        <Button size="lg" onClick={onSend} disabled={!canSend}>
          <HugeiconsIcon icon={SentIcon} strokeWidth={1.8} />
          {isSending ? "Sending" : "Send"}
        </Button>
      </div>
    </div>
  )
}
