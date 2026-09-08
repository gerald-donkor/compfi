import NextLink from "next/link"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { inspirationSlides } from "@/lib/home-editorial"
import { InspirationCarousel } from "./inspiration-carousel"

export function InspirationSection() {
  return (
    <section className="home-inspiration" aria-labelledby="home-inspiration-heading" data-slot="inspiration-section">
      <Container className="home-inspiration__inner">
        <div className="home-inspiration__copy">
          <h2 id="home-inspiration-heading" className="type-heading-lg">Rooms to make your own</h2>
          <p className="type-body text-muted">Explore calm layouts, natural materials, and ideas for shaping everyday spaces.</p>
          <Button render={<NextLink href="/shop" />} nativeButton={false}>Browse furniture</Button>
        </div>
        <InspirationCarousel slides={inspirationSlides} />
      </Container>
    </section>
  )
}
