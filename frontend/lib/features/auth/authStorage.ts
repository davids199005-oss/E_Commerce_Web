import { config } from "@/lib/config/config";

export const authStorage = {
  read(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(config.tokenStorageKey);
  },
  write(token: string): void {
    window.localStorage.setItem(config.tokenStorageKey, token);
  },
  clear(): void {
    window.localStorage.removeItem(config.tokenStorageKey);
  },
};
