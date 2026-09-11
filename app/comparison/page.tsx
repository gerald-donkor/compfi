import type { Metadata } from "next"
import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { PageHero } from "@/components/chrome/page-hero"
import { ProductComparison } from "@/components/comparison/product-comparison"
import { resolveComparison, type ComparisonQuery } from "@/lib/comparison"

export const metadata: Metadata = {
  title: "Product comparison",
  description: "Compare Compfi catalog products side by side.",
  alternates: {
    canonical: "/comparison",
  },
}
export default async function ComparisonPage({ searchParams }: { searchParams: Promise<ComparisonQuery> }) { const comparison = resolveComparison(await searchParams); return <main id="main-content"><PageHero title="Product comparison" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Product comparison" }]} /><ProductComparison comparison={comparison} /><BenefitsStrip /></main> }
