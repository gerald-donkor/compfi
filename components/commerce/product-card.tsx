import Image from "next/image"
import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import { Money } from "@/components/commerce/money"
import type { CatalogProduct } from "@/types/commerce"
import { cn } from "cn"

export interface ProductCardProps extends ComponentProps<"article"> {
  product: CatalogProduct
}

function getDiscountPercent(product: CatalogProduct): number | undefined {
  if (product.badge !== "sale" || product.compareAtPriceCents === undefined) {
    return undefined
  }

  return Math.round(
    ((product.compareAtPriceCents - product.priceCents) / product.compareAtPriceCents) * 100
  )
}

export function ProductCard({ product, className, ...props }: ProductCardProps) {
  const detailHref = `/shop/${product.slug}`
  const discountPercent = getDiscountPercent(product)

  return (
    <article
      {...props}
      className={cn("product-card group/product-card", className)}
      data-slot="product-card"
    >
      <div className="product-card__media">
        <Link href={detailHref} aria-label={product.name} className="product-card__image-link">
          <Image
            src={product.media.path}
            alt={product.media.alt}
            width={product.media.width}
            height={product.media.height}
            sizes="(min-width: 1200px) calc((min(100vw - 200px, 1240px) - 96px) / 4), (min-width: 800px) calc((100vw - (2 * clamp(32px, calc(16.35vw - 135.36px), 100px)) - 64px) / 3), (min-width: 640px) calc((100vw - 96px) / 2), calc(100vw - 40px)"
            className="product-card__image"
          />
        </Link>
        {discountPercent !== undefined ? (
          <Badge variant="discount" className="product-card__badge">
            {discountPercent}%
          </Badge>
        ) : product.badge === "new" ? (
          <Badge variant="new" className="product-card__badge">
            New
          </Badge>
        ) : null}
        <div className="product-card__overlay">
          <Link
            href={detailHref}
            aria-label={`View ${product.name}`}
            className="product-card__overlay-link"
          >
            View product
          </Link>
        </div>
      </div>
      <div className="product-card__content">
        <h3 className="type-heading-sm product-card__title">
          <Link href={detailHref} className="product-card__title-link">
            {product.name}
          </Link>
        </h3>
        <p className="type-body text-muted product-card__description">{product.description}</p>
        <p className="product-card__prices">
          <Money amountCents={product.priceCents} />
          {product.compareAtPriceCents !== undefined ? (
            <>
              <span className="sr-only">Previous price </span>
              <s className="product-card__compare-price">
                <Money amountCents={product.compareAtPriceCents} />
              </s>
            </>
          ) : null}
        </p>
      </div>
    </article>
  )
}
