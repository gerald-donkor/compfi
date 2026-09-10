import type { Metadata } from "next"

import { CheckoutContent } from "@/components/checkout/checkout-content"
import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { PageHero } from "@/components/chrome/page-hero"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your Compfi cart and checkout details.",
}

export default function CheckoutPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Checkout"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <CheckoutContent />
      <BenefitsStrip />
    </main>
  )
}
