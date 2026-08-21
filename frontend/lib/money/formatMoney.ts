import type { MoneyJson } from "@/lib/types/api";

export function parseMoney(value: MoneyJson): number {
  return typeof value === "number" ? value : Number(value);
}

export function formatMoney(value: MoneyJson): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
  }).format(parseMoney(value));
}
