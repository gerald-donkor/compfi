import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/chrome/page-hero"
import { ProductDetail } from "@/components/product/product-detail"
import { ProductInformation } from "@/components/product/product-information"
import { RelatedProducts } from "@/components/product/related-products"
import { catalogProducts, getCatalogProductBySlug } from "@/lib/catalog"

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return catalogProducts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getCatalogProductBySlug(slug)

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Compfi`,
      description: product.description,
      images: [
        {
          url: product.media.path,
          alt: product.media.alt,
        },
      ],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getCatalogProductBySlug(slug)

  if (!product) notFound()

  return (
    <main id="main-content">
      <PageHero
        variant="compact-breadcrumb"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />
      <ProductInformation product={product} />
      <RelatedProducts product={product} />
    </main>
  )
}
