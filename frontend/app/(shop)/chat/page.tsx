"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactElement } from "react"
import { toast } from "sonner"
import { BubbleChatIcon } from "@hugeicons/core-free-icons"
import { AuthGate } from "@/components/auth/AuthGate"
import { ChatComposer } from "@/components/chat/ChatComposer"
import { ChatMessage, ChatThinking } from "@/components/chat/ChatMessage"
import { EmptyState } from "@/components/feedback/EmptyState"
import { PageContainer } from "@/components/layout/PageContainer"
import { Button } from "@/components/ui/button"
import { isHttpStatus } from "@/lib/api/errorMessage"
import {
  CHAT_MESSAGE_MAX_LENGTH,
  useGetChatUsageQuery,
  useSendMessageMutation,
} from "@/lib/features/chat/chatApi"
import {
  PROMPT_RESET_NOTE,
  chatErrorMessage,
  promptsRemainingLabel,
} from "@/lib/features/chat/chatCopy"
import type { ChatTurn, ChatTurnKind } from "@/lib/types/chat"

const SUGGESTIONS: readonly string[] = [
  "Which headphones do you have under $200?",
  "What is out of stock right now?",
  "I am setting up a home office for about $500 — what should I buy?",
]

function Conversation(): ReactElement {
  const [turns, setTurns] = useState<readonly ChatTurn[]>([])
  const [draft, setDraft] = useState<string>("")

  const nextTurnId = useRef<number>(0)
  const transcript = useRef<HTMLDivElement | null>(null)

  const { data: usage } = useGetChatUsageQuery()
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  const isOutOfPrompts: boolean = usage !== undefined && usage.prompts_remaining <= 0
  const blockedReason: string | undefined = isOutOfPrompts
    ? `You have used all of today's prompts. ${PROMPT_RESET_NOTE}`
    : undefined

  useEffect(() => {
    if (turns.length === 0) return
    transcript.current?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [turns, isSending])

  function appendTurn(kind: ChatTurnKind, text: string): void {
    nextTurnId.current += 1
    const turn: ChatTurn = { id: String(nextTurnId.current), kind, text }
    setTurns((current) => [...current, turn])
  }

  async function handleSend(): Promise<void> {
    const text: string = draft.trim()
    if (isSending || isOutOfPrompts) return
    if (text.length === 0 || text.length > CHAT_MESSAGE_MAX_LENGTH) return

    setDraft("")
    appendTurn("user", text)

    const outcome = await sendMessage(text)

    if (outcome.error !== undefined) {
      const message: string = chatErrorMessage(outcome.error)
      appendTurn("notice", message)
      toast.error(message)
      if (!isHttpStatus(outcome.error, 429)) setDraft(text)
      return
    }

    appendTurn("assistant", outcome.data.answer)
    toast.success(promptsRemainingLabel(outcome.data.prompts_remaining))
  }

  return (
    <PageContainer
      title="Shopping assistant"
      description="Ask about what the shop sells. The assistant is given the whole catalog with prices and stock, so it answers from what is really on the shelves."
      actions={
        usage !== undefined ? (
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs tabular-nums text-muted-foreground">
            {promptsRemainingLabel(usage.prompts_remaining)}
          </span>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-6">
        {turns.length === 0 && !isSending && (
          <EmptyState
            icon={BubbleChatIcon}
            title="Start with a question about the catalog"
            description="Pick one of these to fill the box, or write your own. Nothing is sent until you press Send."
            action={
              <div className="flex flex-col items-stretch gap-2 sm:items-center">
                {SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="lg"
                    disabled={isOutOfPrompts}
                    onClick={() => setDraft(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            }
          />
        )}

        <div ref={transcript} aria-live="polite" className="flex flex-col gap-4 empty:hidden">
          {turns.map((turn) => (
            <ChatMessage key={turn.id} turn={turn} />
          ))}
          {isSending && <ChatThinking />}
        </div>

        <div className="sticky bottom-0 bg-background pt-2 pb-4">
          <ChatComposer
            value={draft}
            onValueChange={setDraft}
            onSend={() => {
              void handleSend()
            }}
            isSending={isSending}
            blockedReason={blockedReason}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default function ChatPage(): ReactElement {
  return (
    <AuthGate>
      <Conversation />
    </AuthGate>
  )
}
