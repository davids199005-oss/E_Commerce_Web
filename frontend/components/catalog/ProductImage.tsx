"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { itemImageSrc } from "@/lib/media/itemImageSrc";

export function ProductImage({
  imageUrl,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: {
  imageUrl: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const src = itemImageSrc(imageUrl);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn("bg-muted", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => {
        setFailed(true);
      }}
    />
  );
}
