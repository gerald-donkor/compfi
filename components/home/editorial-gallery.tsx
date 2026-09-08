import Image from "next/image"

import { editorialImages } from "@/lib/home-editorial"

export function EditorialGallery() {
  return (
    <section className="home-editorial" aria-labelledby="home-editorial-heading" data-slot="editorial-gallery">
      <header className="home-editorial__heading">
        <p className="type-body text-muted">Share your space with</p>
        <h2 id="home-editorial-heading" className="type-heading-lg">#CompfiAtHome</h2>
      </header>
      <ul className="home-editorial__mosaic">
        {editorialImages.map((image) => (
          <li key={image.id} className="home-editorial__item" data-placement={image.placement}>
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 32vw, (min-width: 640px) 42vw, 50vw" className="home-editorial__image" />
          </li>
        ))}
      </ul>
    </section>
  )
}
