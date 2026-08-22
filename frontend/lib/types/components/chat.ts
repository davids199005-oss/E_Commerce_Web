import type { ChatTurn } from "@/lib/types/chat"

export interface ChatMessageProps {
  turn: ChatTurn
}

export interface ChatComposerProps {
  value: string
  onValueChange: (next: string) => void
  onSend: () => void
  isSending: boolean
  blockedReason?: string
}
