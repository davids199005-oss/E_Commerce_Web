import { config } from "@/lib/config/config"
import type { AuthStorage } from "@/lib/types/auth"

const TOKEN_KEY: string = config.tokenStorageKey

export function read(): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function write(token: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
  } catch {
    return
  }
}

export function clear(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    return
  }
}

export const authStorage: AuthStorage = { read, write, clear }
