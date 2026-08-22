"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Image01Icon } from "@hugeicons/core-free-icons"
import { itemImageSrc } from "@/lib/media/itemImageSrc"
import type { ProductImageProps } from "@/lib/types/components/catalog"
import { cn } from "@/lib/utils"

export function ProductImage({ imageUrl, name, className }: ProductImageProps): ReactElement {
  const [hasFailed, setHasFailed] = useState<boolean>(false)
  const src: string | null = itemImageSrc(imageUrl)

  return (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-muted",
        className,
      )}
    >
      {src === null || hasFailed ? (
        <span className="flex flex-col items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Image01Icon} size={26} strokeWidth={1.5} />
          <span className="text-xs">No photo</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setHasFailed(true)}
          className="size-full object-contain p-3"
        />
      )}
    </div>
  )
}
