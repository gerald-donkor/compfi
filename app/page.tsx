import type { Metadata } from "next"

import { ProductGrid } from "@/components/commerce/product-grid"
import { CampaignHero } from "@/components/home/campaign-hero"
import { EditorialGallery } from "@/components/home/editorial-gallery"
import { InspirationSection } from "@/components/home/inspiration-section"
import { RoomCategoryGrid } from "@/components/home/room-category-grid"
import { Container } from "@/components/layout/container"
import { Link } from "@/components/ui/link"
import { catalogProducts } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Home",
  description: "Discover Compfi furniture for considered rooms.",
}

export default function HomePage() {
  return (
    <>
      <main id="main-content">
        <CampaignHero />
        <section className="home-rooms" aria-labelledby="home-rooms-heading">
          <Container>
            <div className="home-section-intro">
              <h2 id="home-rooms-heading" className="type-heading-lg">
                Browse by room
              </h2>
              <p className="type-body-lg text-muted">
                Start with the space, then find pieces that belong there.
              </p>
            </div>
            <RoomCategoryGrid />
          </Container>
        </section>
        <section className="home-featured" aria-labelledby="home-featured-heading">
          <Container>
            <div className="home-featured__heading-row">
              <h2 id="home-featured-heading" className="type-heading-lg">
                Featured furniture
              </h2>
              <Link href="/shop" className="home-featured__all-link">
                View all products
              </Link>
            </div>
            <ProductGrid products={catalogProducts} />
          </Container>
        </section>
        <InspirationSection />
        <EditorialGallery />
      </main>
    </>
  )
}
