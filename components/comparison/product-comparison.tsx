import type { ComponentProps } from "react"
import { cn } from "cn"

import { ComparisonProductSummary } from "@/components/comparison/comparison-product-summary"
import { ComparisonTable } from "@/components/comparison/comparison-table"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldLabel } from "@/components/ui/field"
import { Link } from "@/components/ui/link"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import type { ComparisonViewModel } from "@/lib/comparison"

export interface ProductComparisonProps extends ComponentProps<"section"> { comparison: ComparisonViewModel }

export function ProductComparison({ comparison, className, ...props }: ProductComparisonProps) {
  const canAdd = comparison.choices.length > 0 && comparison.count < comparison.capacity
  return <section {...props} className={cn("product-comparison", className)} data-slot="product-comparison">
    <Container>
      <div className="product-comparison__intro"><h2 className="type-heading-lg">Compare products</h2><p className="text-muted">Review catalog details and available options side by side.</p><p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Comparing {comparison.count} {comparison.count === 1 ? "product" : "products"}</p></div>
      {comparison.count ? <>
        {comparison.count === 1 ? <p className="product-comparison__guidance">Add another product to compare their catalog details side by side.</p> : null}
        <div className="product-comparison__summaries">{comparison.products.map((product) => <ComparisonProductSummary key={product.id} product={product} removeHref={comparison.removeHref(product.slug)} />)}
          {canAdd ? <ComparisonPicker comparison={comparison} /> : <p className="product-comparison__full">Comparison is full. Remove a product to add another.</p>}</div><ComparisonTable products={comparison.products} /></> : <div className="product-comparison__empty"><Empty><EmptyHeader><EmptyTitle>Choose products to compare</EmptyTitle><EmptyDescription>Add a product below or browse the collection.</EmptyDescription></EmptyHeader><Link href="/shop">Browse products</Link></Empty>{canAdd ? <ComparisonPicker comparison={comparison} /> : null}</div>}
    </Container>
  </section>
}

function ComparisonPicker({ comparison }: { comparison: ComparisonViewModel }) {
  return <form className="comparison-picker" action="/comparison" method="get" data-slot="comparison-picker">
    {comparison.products.map((product) => <input key={product.id} type="hidden" name="product" value={product.slug} />)}
    <Field className="comparison-picker__field"><FieldLabel htmlFor="comparison-product">Add a product</FieldLabel><NativeSelect id="comparison-product" name="product" required className="comparison-picker__select"><NativeSelectOption value="">Select a product</NativeSelectOption>{comparison.choices.map((product) => <NativeSelectOption key={product.id} value={product.slug}>{product.name}</NativeSelectOption>)}</NativeSelect></Field><Button type="submit">Add product</Button>
  </form>
}
