import type { ComponentProps } from "react"
import { cn } from "cn"

import { ProductGrid } from "@/components/commerce/product-grid"
import { Container } from "@/components/layout/container"
import { Link } from "@/components/ui/link"
import { getRelatedCatalogProducts } from "@/lib/catalog"
import type { CatalogProduct } from "@/types/commerce"

export interface RelatedProductsProps extends ComponentProps<"section"> {
  product: CatalogProduct
}

export function RelatedProducts({ product, className, ...props }: RelatedProductsProps) {
  const products = getRelatedCatalogProducts(product)

  return (
    <section
      {...props}
      className={cn("py-16 lg:py-20", className)}
      aria-labelledby="related-products-heading"
      data-slot="related-products"
    >
      <Container className="flex flex-col items-center gap-10">
        <h2 id="related-products-heading" className="type-heading-lg text-center text-balance">Related products</h2>
        <ProductGrid products={products} className="w-full" />
        <Link href="/shop" variant="primary" className="min-h-11 border border-primary px-8 py-3">
          View all products
        </Link>
      </Container>
    </section>
  )
}
