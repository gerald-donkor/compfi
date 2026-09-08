import type { ComponentProps } from "react"

import { ProductCard } from "@/components/commerce/product-card"
import type { CatalogProduct } from "@/types/commerce"
import { cn } from "cn"

export interface ProductGridProps extends ComponentProps<"ul"> {
  products: readonly CatalogProduct[]
}

export function ProductGrid({ products, className, ...props }: ProductGridProps) {
  return (
    <ul {...props} className={cn("product-grid", className)} data-slot="product-grid">
      {products.map((product) => (
        <li key={product.id} data-slot="product-grid-item">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
