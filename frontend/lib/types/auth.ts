import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { User, UserCreate } from "@/lib/types/api"

export interface AuthState {
  token: string | null
  user: User | null
  isHydrated: boolean
}

export interface AuthRootState {
  auth: AuthState
}

export interface AuthStorage {
  read(): string | null
  write(token: string): void
  clear(): void
}

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  token: string
}

export type AuthFieldType = "text" | "email" | "tel" | "password"

export const LOGIN_FIELDS = ["username", "password"] as const

export type LoginField = (typeof LOGIN_FIELDS)[number]

export type RegisterField = keyof UserCreate

export interface RegisterFieldSpec {
  name: RegisterField
  label: string
  type: AuthFieldType
  autoComplete: string
  hint?: string
  half: boolean
}

export type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
