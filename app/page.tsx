import Link from "next/link";

import { Container } from "@/components/layout/container";

export default function HomePage() {
  return (
    <main id="main-content" className="surface-hero min-h-screen py-20 md:py-24 lg:py-30">
      <Container>
        <div className="max-w-3xl">
          <p className="type-label mb-4 text-compfi-brand-action"><span translate="no">Compfi</span> foundations</p>
          <h1 className="type-display">Rooms that feel considered.</h1>
          <p className="type-body-lg text-muted mt-6 max-w-2xl">
            Compfi is taking shape around a calm, practical system for furniture
            and the spaces people make their own.
          </p>
          <Link className="button-primary mt-8" href="/design-system">
            Explore the design system
          </Link>
        </div>
      </Container>
    </main>
  );
}
