function requireEnv(name: string, value: string | undefined): string {
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
  }
  
  export const config = {
    // Environment
    apiBaseUrl: requireEnv(
      "NEXT_PUBLIC_API_BASE_URL",
      process.env.NEXT_PUBLIC_API_BASE_URL,
    ),
  
    // Storage
    tokenStorageKey: "ecommerce_token",
  
    // Network
    requestTimeoutMs: 30_000,
  
    // Interface
    searchDebounceMs: 400,
    tablePageSize: 10,
    toastDurationMs: 4_000,
  } as const;