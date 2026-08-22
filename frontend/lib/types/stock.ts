export type StockStatus =
  | { kind: "in"; label: string }
  | { kind: "low"; label: string }
  | { kind: "out"; label: string }
