"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Image01Icon } from "@hugeicons/core-free-icons"
import { itemImageSrc } from "@/lib/media/itemImageSrc"
import type { OrderLineThumbnailProps } from "@/lib/types/components/orders"
import { cn } from "@/lib/utils"

export function OrderLineThumbnail({
  imageUrl,
  name,
  className,
}: OrderLineThumbnailProps): ReactElement {
  const src: string | null = itemImageSrc(imageUrl)

  if (src === null) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground",
          className,
        )}
      >
        <HugeiconsIcon icon={Image01Icon} size={20} strokeWidth={1.8} />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      loading="lazy"
      className={cn("size-16 shrink-0 rounded-xl bg-muted object-cover", className)}
    />
  )
}
