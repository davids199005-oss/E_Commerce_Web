export interface ChatUsage {
  prompts_used: number
  prompts_remaining: number
}

export interface ChatAnswer extends ChatUsage {
  answer: string
}

export type ChatTurnKind = "user" | "assistant" | "notice"

export interface ChatTurn {
  id: string
  kind: ChatTurnKind
  text: string
}
