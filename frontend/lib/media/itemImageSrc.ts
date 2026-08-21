import { config } from "@/lib/config/config";

export function itemImageSrc(imageUrl: string | null): string | null {
  if (!imageUrl) {
    return null;
  }
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const base = config.apiBaseUrl.replace(/\/$/, "");
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${base}${path}`;
}
