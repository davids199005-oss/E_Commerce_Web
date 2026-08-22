import type { User } from "@/lib/types/api"

export type ProfileFieldKey =
  | "first_name"
  | "last_name"
  | "username"
  | "email"
  | "phone"
  | "country"
  | "city"

export type ProfileDraft = Record<ProfileFieldKey, string>

export interface ProfileFieldSpec {
  key: ProfileFieldKey
  label: string
  type: "text" | "email" | "tel"
  autoComplete: string
}

export interface ProfileFormProps {
  user: User
}

export interface AccountSummaryCardProps {
  user: User
}

export interface DeleteAccountDialogProps {
  username: string
  onDeleted: () => void
}

export interface AccountViewProps {
  onDeleted: () => void
}
