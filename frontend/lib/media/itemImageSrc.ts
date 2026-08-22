import { config } from "@/lib/config/config"

export function itemImageSrc(imageUrl: string | null): string | null {
  if (imageUrl === null) {
    return null
  }

  const path: string = imageUrl.trim()
  if (path.length === 0) {
    return null
  }
  if (path.startsWith("http")) {
    return path
  }

  return `${config.apiBaseUrl}${encodeURI(path.startsWith("/") ? path : `/${path}`)}`
}
