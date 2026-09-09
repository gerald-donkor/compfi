"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "cn"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import type { ProductMedia } from "@/types/commerce"

export interface ProductGalleryProps extends React.ComponentProps<"section"> {
  media: readonly ProductMedia[]
}

export function ProductGallery({
  media,
  className,
  "aria-label": ariaLabel = "Product gallery",
  ...props
}: ProductGalleryProps) {
  const mediaKey = media[0]?.path
  const [selection, setSelection] = React.useState({
    mediaKey,
    selectedPath: mediaKey,
    announcement: "",
  })

  if (selection.mediaKey !== mediaKey) {
    setSelection({ mediaKey, selectedPath: mediaKey, announcement: "" })
  }

  const selectedFromState = selection.mediaKey === mediaKey
    ? media.find((item) => item.path === selection.selectedPath)
    : undefined
  const selected = selectedFromState ?? media[0]

  if (!selected) {
    return (
      <section
        {...props}
        className={cn("product-detail-gallery", className)}
        aria-label={ariaLabel}
        data-slot="product-gallery"
        data-empty="true"
      >
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Product images unavailable</EmptyTitle>
            <EmptyDescription>Browse the product details while images are restored.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  function selectMedia(item: ProductMedia) {
    if (item.path === selected.path) return
    setSelection({
      mediaKey,
      selectedPath: item.path,
      announcement: `Showing ${item.alt}`,
    })
  }

  return (
    <section
      {...props}
      className={cn("product-detail-gallery", className)}
      aria-label={ariaLabel}
      data-slot="product-gallery"
    >
      <div className="product-detail-gallery__lead" data-slot="product-gallery-lead">
        <Image
          src={selected.path}
          alt={selected.alt}
          width={selected.width}
          height={selected.height}
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1280px) 423px, (min-width: 768px) 46vw, calc(100vw - 40px)"
          className="size-full object-contain"
        />
      </div>
      <div className="product-detail-gallery__thumbs" role="group" aria-label="Choose a product view">
        {media.map((item) => (
          <button
            key={item.path}
            type="button"
            aria-label={`Show ${item.alt}`}
            aria-pressed={item.path === selected.path}
            onClick={() => selectMedia(item)}
            className="product-detail-gallery__thumb"
            data-slot="product-gallery-thumbnail"
          >
            <Image
              src={item.path}
              alt=""
              width={item.width}
              height={item.height}
              sizes="76px"
              className="size-full object-contain"
            />
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {selectedFromState ? selection.announcement : ""}
      </p>
    </section>
  )
}
