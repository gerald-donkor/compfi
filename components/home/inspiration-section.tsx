import type * as React from "react"
import NextLink from "next/link"
import { cn } from "cn"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { inspirationSlides } from "@/lib/home-editorial"
import { InspirationCarousel } from "./inspiration-carousel"

export type InspirationSectionProps = React.ComponentProps<"section">

export function InspirationSection({ className, ...props }: InspirationSectionProps) {
  return (
    <section className={cn("home-inspiration", className)} aria-labelledby="home-inspiration-heading" data-slot="inspiration-section" {...props}>
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
