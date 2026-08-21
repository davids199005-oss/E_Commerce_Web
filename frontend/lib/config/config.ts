function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const config = {
  apiBaseUrl: requireEnv(
    "NEXT_PUBLIC_API_BASE_URL",
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ),
  tokenStorageKey: "ecommerce_token",
  requestTimeoutMs: 30_000,
  searchDebounceMs: 400,
  tablePageSize: 10,
  toastDurationMs: 4_000,
} as const;
