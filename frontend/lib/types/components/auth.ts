import type { ReactNode } from "react"
import type { AuthFieldType } from "@/lib/types/auth"

export interface AuthFieldProps {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  type?: AuthFieldType
  autoComplete?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

export interface AuthFormProps {
  title: string
  description: string
  submitLabel: string
  pendingLabel: string
  isPending: boolean
  formError: string | null
  onSubmit: () => void
  children: ReactNode
  footer: ReactNode
}

export interface AuthGateProps {
  children: ReactNode
}

export interface AdminGateProps {
  children: ReactNode
}

export interface AuthHydratorProps {
  children: ReactNode
}

export interface AuthLayoutProps {
  children: ReactNode
}
