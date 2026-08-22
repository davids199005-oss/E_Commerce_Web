import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"

const FALLBACK = "Something went wrong. Please try again."

const STATUS_MESSAGES: ReadonlyMap<number, string> = new Map([
  [400, "The request was rejected. Please check the values you entered."],
  [401, "You need to sign in to do that."],
  [403, "You do not have permission to do that."],
  [404, "We could not find what you were looking for."],
  [409, "That conflicts with something that already exists."],
  [422, "Some of the values you entered are not valid."],
  [429, "Too many requests. Please slow down."],
  [500, "The server ran into a problem. Please try again."],
  [502, "The server is not responding correctly. Please try again."],
  [503, "The service is temporarily unavailable. Please try again shortly."],
])

function hasKey<K extends string>(value: unknown, key: K): value is Record<K, unknown> {
  return typeof value === "object" && value !== null && key in value
}

function isFetchBaseQueryError(
  error: FetchBaseQueryError | SerializedError,
): error is FetchBaseQueryError {
  return "status" in error
}

function joinIssues(detail: readonly unknown[]): string | null {
  const messages: string[] = []
  for (const issue of detail) {
    if (hasKey(issue, "msg") && typeof issue.msg === "string" && issue.msg.trim() !== "") {
      messages.push(issue.msg.trim())
    }
  }
  return messages.length > 0 ? messages.join(". ") : null
}

function detailMessage(data: unknown): string | null {
  if (!hasKey(data, "detail")) return null
  const detail = data.detail
  if (typeof detail === "string") {
    return detail.trim() === "" ? null : detail.trim()
  }
  if (Array.isArray(detail)) {
    return joinIssues(detail)
  }
  return null
}

export function getErrorMessage(error: FetchBaseQueryError | SerializedError | undefined): string {
  if (error === undefined) return FALLBACK

  if (!isFetchBaseQueryError(error)) {
    const message = error.message
    return message !== undefined && message.trim() !== "" ? message : FALLBACK
  }

  if (typeof error.status === "number") {
    if (error.status === 429) return "Too many requests. Please slow down."
    return detailMessage(error.data) ?? STATUS_MESSAGES.get(error.status) ?? FALLBACK
  }

  switch (error.status) {
    case "FETCH_ERROR":
      return "Cannot reach the server. Is the backend running?"
    case "TIMEOUT_ERROR":
      return "The request timed out. Please try again."
    case "PARSING_ERROR":
      return "The server sent a response we could not read."
    case "CUSTOM_ERROR":
      return error.error.trim() !== "" ? error.error : FALLBACK
  }
}

export function isHttpStatus(error: unknown, status: number): boolean {
  if (!hasKey(error, "status")) return false
  if (error.status === status) return true
  return (
    error.status === "PARSING_ERROR" &&
    hasKey(error, "originalStatus") &&
    error.originalStatus === status
  )
}
