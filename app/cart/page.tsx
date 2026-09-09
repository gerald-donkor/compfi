import type { Metadata } from "next"

import { CartContent } from "@/components/cart/cart-content"
import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { PageHero } from "@/components/chrome/page-hero"

export const metadata: Metadata = { title: "Cart", description: "Review the furniture in your Compfi cart." }

export default function CartPage() {
  return <main id="main-content"><PageHero title="Cart" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} /><CartContent /><BenefitsStrip /></main>
}
