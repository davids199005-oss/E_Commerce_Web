import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import type { FetchArgs } from "@reduxjs/toolkit/query"
import { isHttpStatus } from "@/lib/api/errorMessage"
import { config } from "@/lib/config/config"
import { authStorage } from "@/lib/features/auth/authStorage"
import { loggedOut } from "@/lib/features/auth/authSlice"
import type { AppBaseQuery, AuthRootState } from "@/lib/types/auth"

function hasAuthToken(state: unknown): state is AuthRootState {
  if (typeof state !== "object" || state === null || !("auth" in state)) return false
  const auth: unknown = state.auth
  if (typeof auth !== "object" || auth === null || !("token" in auth)) return false
  return typeof auth.token === "string" || auth.token === null
}

const CREDENTIAL_PATHS = ["auth/login", "auth/register"]

function isCredentialRequest(args: string | FetchArgs): boolean {
  const url = typeof args === "string" ? args : args.url
  const path = url.replace(/^\/+/, "")
  return CREDENTIAL_PATHS.some((candidate) => path.startsWith(candidate))
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  timeout: config.requestTimeoutMs,
  prepareHeaders: (headers, { getState }) => {
    const state: unknown = getState()
    if (hasAuthToken(state) && state.auth.token !== null) {
      headers.set("Authorization", `Bearer ${state.auth.token}`)
    }
    return headers
  },
})

export const baseQueryWithAuth: AppBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (isHttpStatus(result.error, 401) && !isCredentialRequest(args)) {
    authStorage.clear()
    api.dispatch(loggedOut())
  }

  return result
}
