const TOKEN_STORAGE_KEY = "ecommerce_token";

export const authStorage = {
  read(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  write(token: string): void {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clear(): void {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};