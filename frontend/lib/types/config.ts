export interface AppConfig {
  readonly apiBaseUrl: string
  readonly tokenStorageKey: string
  readonly requestTimeoutMs: number
  readonly chatTimeoutMs: number
  readonly searchDebounceMs: number
  readonly catalogPageSize: number
}
