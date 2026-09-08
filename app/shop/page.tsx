import type { Metadata } from "next"
import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { PageHero } from "@/components/chrome/page-hero"
import { ShopControls } from "@/components/shop/shop-controls"
import { ShopResults } from "@/components/shop/shop-results"
import { catalogProducts } from "@/lib/catalog"
import { resolveCatalogView } from "@/lib/catalog-view"

export const metadata: Metadata = { title: "Shop", description: "Browse Compfi furniture by room, price, and collection order." }

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const view = resolveCatalogView(catalogProducts, await searchParams)
  return <main id="main-content"><PageHero title="Shop" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]} /><ShopControls options={view} totalCount={view.totalCount} /><ShopResults view={view} /><BenefitsStrip /></main>
}
