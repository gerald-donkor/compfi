import type { ComponentProps } from "react"
import { cn } from "cn"

import { Money } from "@/components/commerce/money"
import { catalogCategoryLabels } from "@/lib/catalog-view"
import type { CatalogProduct } from "@/types/commerce"

export interface ComparisonTableProps extends ComponentProps<"section"> { products: readonly CatalogProduct[] }

const optionText = (labels: readonly { label: string }[] | undefined, singular: string) => labels?.length ? labels.map(({ label }) => label).join(", ") : `No ${singular} options`

export function ComparisonTable({ products, className, ...props }: ComparisonTableProps) {
  return <section {...props} className={cn("comparison-table", className)} data-slot="comparison-table">
    <p className="comparison-table__hint">Scroll horizontally to compare all product details.</p>
    <div className="comparison-table__scroll" role="region" tabIndex={0} aria-label="Product comparison table">
      <table>
        <caption>Compare selected Compfi products by their catalog details and available options.</caption>
        <thead><tr><th scope="col">Product</th>{products.map((product) => <th key={product.id} scope="col">{product.name}</th>)}</tr></thead>
        <tbody aria-label="Overview">
          <tr className="comparison-table__group"><th colSpan={products.length + 1} scope="rowgroup">Overview</th></tr>
          <tr><th scope="row">Price</th>{products.map((product) => <td key={product.id}><Money amountCents={product.priceCents} /></td>)}</tr>
          <tr><th scope="row">Category</th>{products.map((product) => <td key={product.id}>{catalogCategoryLabels[product.category]}</td>)}</tr>
          <tr><th scope="row">Summary</th>{products.map((product) => <td key={product.id}>{product.description}</td>)}</tr>
          <tr><th scope="row">Product details</th>{products.map((product) => <td key={product.id}>{product.detailDescription}</td>)}</tr>
        </tbody>
        <tbody aria-label="Options">
          <tr className="comparison-table__group"><th colSpan={products.length + 1} scope="rowgroup">Options</th></tr>
          <tr><th scope="row">Sizes</th>{products.map((product) => <td key={product.id}>{optionText(product.sizes, "size")}</td>)}</tr>
          <tr><th scope="row">Finishes</th>{products.map((product) => <td key={product.id}>{optionText(product.finishes, "finish")}</td>)}</tr>
        </tbody>
      </table>
    </div>
  </section>
}
