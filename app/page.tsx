import NextLink from "next/link"

import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="surface-hero min-h-screen py-20 md:py-24 lg:py-30">
        <Container>
          <div className="max-w-3xl">
            <p className="type-label mb-4 text-compfi-brand-action">
              <span translate="no">Compfi</span> foundations
            </p>
            <h1 className="type-display">Rooms that feel considered.</h1>
            <p className="type-body-lg text-muted mt-6 max-w-2xl">
              Compfi is taking shape around a calm, practical system for furniture
              and the spaces people make their own.
            </p>
            <Button
              render={<NextLink href="/design-system" />}
              nativeButton={false}
              className="mt-8"
            >
              Explore the design system
            </Button>
          </div>
        </Container>
      </main>
      <BenefitsStrip />
    </>
  )
}
