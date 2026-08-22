import { parseMoney } from "@/lib/format/money"
import type { ItemDraft, ItemDraftErrors, ItemUpdate } from "@/lib/types/admin"
import type { Item, ItemCreate } from "@/lib/types/api"

export const EMPTY_ITEM_DRAFT: ItemDraft = {
  name: "",
  price_usd: "",
  stock_qty: "0",
  image_url: "",
}

export function itemDraftFrom(item: Item): ItemDraft {
  return {
    name: item.name,
    price_usd: item.price_usd,
    stock_qty: String(item.stock_qty),
    image_url: item.image_url ?? "",
  }
}

const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/
const STOCK_PATTERN = /^\d+$/

export function validateItemDraft(draft: ItemDraft): ItemDraftErrors {
  const errors: ItemDraftErrors = {}

  if (draft.name.trim() === "") {
    errors.name = "Give the item a name."
  }
  if (!PRICE_PATTERN.test(draft.price_usd.trim())) {
    errors.price_usd = "A number like 24.99, with no currency sign."
  }
  if (!STOCK_PATTERN.test(draft.stock_qty.trim())) {
    errors.stock_qty = "A whole number, zero or more."
  }

  return errors
}

function imageUrlOf(draft: ItemDraft): string | null {
  const path: string = draft.image_url.trim()
  return path === "" ? null : path
}

export function itemDraftToCreate(draft: ItemDraft): ItemCreate {
  return {
    name: draft.name.trim(),
    price_usd: draft.price_usd.trim(),
    stock_qty: Number(draft.stock_qty.trim()),
    image_url: imageUrlOf(draft),
  }
}

export function itemDraftToUpdate(draft: ItemDraft, item: Item): ItemUpdate {
  const changes: ItemUpdate = {}

  const name: string = draft.name.trim()
  if (name !== item.name) {
    changes.name = name
  }

  const price: string = draft.price_usd.trim()
  if (parseMoney(price) !== parseMoney(item.price_usd)) {
    changes.price_usd = price
  }

  const stock: number = Number(draft.stock_qty.trim())
  if (stock !== item.stock_qty) {
    changes.stock_qty = stock
  }

  const imageUrl: string | null = imageUrlOf(draft)
  if (imageUrl !== item.image_url) {
    changes.image_url = imageUrl
  }

  return changes
}
