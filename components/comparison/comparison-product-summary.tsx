import type { ComponentProps } from "react"
import Image from "next/image"
import { cn } from "cn"

import { Money } from "@/components/commerce/money"
import { Link } from "@/components/ui/link"
import type { CatalogProduct } from "@/types/commerce"

export interface ComparisonProductSummaryProps extends ComponentProps<"article"> {
  product: CatalogProduct
  removeHref: string
}

export function ComparisonProductSummary({ product, removeHref, className, ...props }: ComparisonProductSummaryProps) {
  return <article {...props} className={cn("comparison-summary", className)} data-slot="comparison-product-summary">
    <Link href={`/shop/${product.slug}`} aria-label={`View ${product.name}`} className="comparison-summary__image-link">
      <Image src={product.media.path} alt={product.media.alt} width={product.media.width} height={product.media.height} sizes="(min-width: 1024px) 280px, (min-width: 640px) calc(50vw - 48px), calc(100vw - 40px)" className="comparison-summary__image" />
    </Link>
    <div className="comparison-summary__content">
      <Link href={`/shop/${product.slug}`} className="type-heading-sm">{product.name}</Link>
      <Money amountCents={product.priceCents} />
      {product.compareAtPriceCents ? <s className="text-muted"> <Money amountCents={product.compareAtPriceCents} /></s> : null}
      <Link href={removeHref} variant="muted" className="comparison-summary__remove">Remove {product.name} from comparison</Link>
    </div>
  </article>
}
