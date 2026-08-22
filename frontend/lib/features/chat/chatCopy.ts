import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { getErrorMessage, isHttpStatus } from "@/lib/api/errorMessage"

export const PROMPT_RESET_NOTE = "Your allowance resets at midnight UTC."

export function chatErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (isHttpStatus(error, 429)) {
    return `You have used all of today's prompts. ${PROMPT_RESET_NOTE}`
  }
  if (isHttpStatus(error, 503)) {
    return "The assistant is unavailable right now. No prompt was used, so nothing was lost."
  }
  return getErrorMessage(error)
}

export function promptsRemainingLabel(remaining: number): string {
  if (remaining <= 0) return "No prompts left today"
  return remaining === 1 ? "1 prompt left today" : `${remaining} prompts left today`
}
