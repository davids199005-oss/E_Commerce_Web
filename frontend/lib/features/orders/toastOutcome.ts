import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errorMessage"
import type { MutationOutcome } from "@/lib/types/orders"

export function toastOutcome(outcome: MutationOutcome, fallbackSuccess: string): boolean {
  if (outcome.error !== undefined) {
    toast.error(getErrorMessage(outcome.error))
    return false
  }

  const message: string = outcome.data.message.trim()
  toast.success(message === "" ? fallbackSuccess : message)
  return true
}
