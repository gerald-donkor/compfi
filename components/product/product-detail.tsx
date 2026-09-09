import type { ComponentProps } from "react"
import { cn } from "cn"

import { Money } from "@/components/commerce/money"
import { Container } from "@/components/layout/container"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductOptions } from "@/components/product/product-options"
import { Separator } from "@/components/ui/separator"
import type { CatalogProduct } from "@/types/commerce"

export interface ProductDetailProps extends ComponentProps<"section"> {
  product: CatalogProduct
}

const categoryLabels: Record<CatalogProduct["category"], string> = {
  dining: "Dining",
  living: "Living",
  bedroom: "Bedroom",
}

export function ProductDetail({ product, className, ...props }: ProductDetailProps) {
  return (
    <section
      {...props}
      className={cn("product-detail-summary", className)}
      data-slot="product-detail"
    >
      <Container className="product-detail-summary__layout">
        <ProductGallery media={product.gallery} />
        <div className="flex min-w-0 flex-col gap-6" data-slot="product-detail-summary">
          <div className="flex flex-col gap-3">
            <h1 className="type-heading-xl text-balance">{product.name}</h1>
            <Money amountCents={product.priceCents} className="type-heading-md text-muted-foreground" />
            <p className="type-body max-w-prose">{product.description}</p>
          </div>

          <ProductOptions
            sizes={product.sizes}
            defaultSize={product.defaultSize}
            finishes={product.finishes}
            defaultFinish={product.defaultFinish}
            comparisonHref={`/comparison?product=${product.slug}`}
          />

          <Separator />
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 type-body-sm text-muted-foreground">
            <dt>Product ID</dt>
            <dd>{product.id}</dd>
            <dt>Category</dt>
            <dd>{categoryLabels[product.category]}</dd>
          </dl>
        </div>
      </Container>
    </section>
  )
}
