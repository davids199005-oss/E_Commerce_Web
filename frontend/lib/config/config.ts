import type { AppConfig } from "@/lib/types/config"

const rawApiBaseUrl: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL

if (rawApiBaseUrl === undefined || rawApiBaseUrl.length === 0) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local, e.g. NEXT_PUBLIC_API_BASE_URL=http://localhost:8000",
  )
}

export const config: AppConfig = {
  apiBaseUrl: rawApiBaseUrl.replace(/\/+$/, ""),
  tokenStorageKey: "ecom-shop.token",
  requestTimeoutMs: 30_000,
  chatTimeoutMs: 90_000,
  searchDebounceMs: 400,
  catalogPageSize: 15,
} as const
