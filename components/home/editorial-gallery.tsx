import type * as React from "react"
import Image from "next/image"
import { cn } from "cn"

import { editorialImages } from "@/lib/home-editorial"

export type EditorialGalleryProps = React.ComponentProps<"section">

export function EditorialGallery({ className, ...props }: EditorialGalleryProps) {
  return (
    <section className={cn("home-editorial", className)} aria-labelledby="home-editorial-heading" data-slot="editorial-gallery" {...props}>
      <header className="home-editorial__heading">
        <p className="type-body text-muted">Share your space with</p>
        <h2 id="home-editorial-heading" className="type-heading-lg">#CompfiAtHome</h2>
      </header>
      <ul className="home-editorial__mosaic">
        {editorialImages.map((image) => (
          <li key={image.id} className="home-editorial__item" data-placement={image.placement}>
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 32vw, (min-width: 391px) 42vw, (min-width: 321px) 50vw, calc(100vw - 32px)" className="home-editorial__image" />
          </li>
        ))}
      </ul>
    </section>
  )
}
