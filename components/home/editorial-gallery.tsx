import type * as React from "react"
import Image from "next/image"
import { cn } from "cn"

import { editorialImages } from "@/lib/home-editorial"

const imageSizes = {
  shelf: "(min-width: 1024px) 10vw, (min-width: 391px) 25vw, (min-width: 321px) 50vw, calc(100vw - 32px)",
  workspace: "(min-width: 1024px) 25vw, (min-width: 391px) 75vw, (min-width: 321px) 50vw, calc(100vw - 32px)",
  nook: "(min-width: 1024px) 20vw, (min-width: 391px) 50vw, (min-width: 321px) 50vw, calc(100vw - 32px)",
  bedroom: "(min-width: 1024px) 25vw, (min-width: 391px) 25vw, (min-width: 321px) 50vw, calc(100vw - 32px)",
  dining: "(min-width: 1024px) 20vw, (min-width: 391px) 25vw, (min-width: 321px) 50vw, calc(100vw - 32px)",
  chair: "(min-width: 1024px) 15vw, (min-width: 391px) 25vw, (min-width: 321px) 50vw, calc(100vw - 32px)",
  tables: "(min-width: 1024px) 20vw, (min-width: 391px) 50vw, (min-width: 321px) 100vw, calc(100vw - 32px)",
  art: "(min-width: 1024px) 15vw, (min-width: 391px) 25vw, (min-width: 321px) 50vw, calc(100vw - 32px)",
  kitchen: "(min-width: 1024px) 25vw, (min-width: 391px) 50vw, (min-width: 321px) 50vw, calc(100vw - 32px)",
} as const satisfies Record<(typeof editorialImages)[number]["placement"], string>

export type EditorialGalleryProps = React.ComponentProps<"section">

export function EditorialGallery({ className, ...props }: EditorialGalleryProps) {
  return (
    <section {...props} className={cn("home-editorial", className)} aria-labelledby="home-editorial-heading" data-slot="editorial-gallery">
      <header className="home-editorial__heading">
        <p className="type-body text-muted">Share your space with</p>
        <h2 id="home-editorial-heading" className="type-heading-lg">#CompfiAtHome</h2>
      </header>
      <ul className="home-editorial__mosaic">
        {editorialImages.map((image) => (
          <li key={image.id} className="home-editorial__item" data-placement={image.placement}>
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={imageSizes[image.placement]} className="home-editorial__image" />
          </li>
        ))}
      </ul>
    </section>
  )
}
