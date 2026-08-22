const usdFormatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function parseMoney(value: string): number {
  const parsed: number = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatUsd(value: string | number): string {
  const amount: number = typeof value === "number" ? value : parseMoney(value)
  return usdFormatter.format(Number.isFinite(amount) ? amount : 0)
}
