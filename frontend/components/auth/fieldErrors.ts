import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { FieldErrors } from "@/lib/types/field-errors"

function hasKey<K extends string>(value: unknown, key: K): value is Record<K, unknown> {
  return typeof value === "object" && value !== null && key in value
}

function statusOf(error: FetchBaseQueryError | SerializedError | undefined): number | null {
  if (error === undefined || !("status" in error)) return null
  return typeof error.status === "number" ? error.status : null
}

function detailOf(error: FetchBaseQueryError | SerializedError | undefined): unknown {
  if (error === undefined || !("status" in error)) return undefined
  if (!hasKey(error.data, "detail")) return undefined
  return error.data.detail
}

function fieldOfLoc<TField extends string>(
  loc: readonly unknown[],
  fields: readonly TField[],
): TField | null {
  for (let index = loc.length - 1; index >= 0; index -= 1) {
    const segment: unknown = loc[index]
    if (typeof segment !== "string") continue
    const match = fields.find((field) => field === segment)
    if (match !== undefined) return match
  }
  return null
}

function fromIssues<TField extends string>(
  detail: readonly unknown[],
  fields: readonly TField[],
): FieldErrors<TField> {
  const result: FieldErrors<TField> = {}
  for (const issue of detail) {
    if (!hasKey(issue, "loc") || !Array.isArray(issue.loc)) continue
    if (!hasKey(issue, "msg") || typeof issue.msg !== "string") continue
    const field = fieldOfLoc(issue.loc, fields)
    if (field === null || result[field] !== undefined) continue
    result[field] = issue.msg.trim()
  }
  return result
}

function fromConflict<TField extends string>(
  detail: string,
  fields: readonly TField[],
): FieldErrors<TField> {
  const haystack: string = detail.toLowerCase()
  const result: FieldErrors<TField> = {}
  for (const field of fields) {
    if (haystack.includes(field) || haystack.includes(field.replace(/_/g, " "))) {
      result[field] = detail.trim()
      return result
    }
  }
  return result
}

export function fieldErrorsFrom<TField extends string>(
  error: FetchBaseQueryError | SerializedError | undefined,
  fields: readonly TField[],
): FieldErrors<TField> {
  const detail: unknown = detailOf(error)

  if (Array.isArray(detail)) return fromIssues(detail, fields)

  if (statusOf(error) === 409 && typeof detail === "string" && detail.trim() !== "") {
    return fromConflict(detail, fields)
  }

  return {}
}
