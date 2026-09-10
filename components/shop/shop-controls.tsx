"use client"

import { Grid2X2Icon, ListIcon, SlidersHorizontalIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { catalogCategories, type CatalogViewOptions, shopHref } from "@/lib/catalog-view"
import { catalogCategoryLabels } from "@/lib/catalog-view"


export interface ShopControlsProps {
  options: CatalogViewOptions
  totalCount: number
}

export function ShopControls({ options, totalCount }: ShopControlsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const navigate = (href: string) => startTransition(() => router.push(href))

  return (
    <section className="shop-controls surface-wash" aria-label="Shop controls" aria-busy={isPending} data-slot="shop-controls" data-loading={isPending || undefined}>
      <div className="compfi-container shop-controls__inner">
        <div className="shop-controls__primary">
          <details className="shop-controls__filter" data-slot="shop-filter">
            <summary aria-label="Filter products by room"><SlidersHorizontalIcon aria-hidden="true" />Filter</summary>
            <div className="shop-controls__filter-options" aria-label="Room categories">
              <a aria-current={!options.category ? "page" : undefined} href={shopHref(options, { category: undefined })}>All rooms</a>
              {catalogCategories.map((category) => <a key={category} aria-current={options.category === category ? "page" : undefined} href={shopHref(options, { category })}>{catalogCategoryLabels[category]}</a>)}
            </div>
          </details>
          <ToggleGroup aria-label="Product view" value={[options.view]} onValueChange={(value) => { const view = value[0]; if (view === "grid" || view === "list") navigate(shopHref(options, { view })) }} variant="outline" spacing={0}>
            <ToggleGroupItem value="grid" aria-label="Grid view" data-composite-item-active={options.view === "grid" ? "" : undefined} disabled={isPending}><Grid2X2Icon aria-hidden="true" /></ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view" data-composite-item-active={options.view === "list" ? "" : undefined} disabled={isPending}><ListIcon aria-hidden="true" /></ToggleGroupItem>
          </ToggleGroup>
          <p className="shop-controls__count" aria-hidden="true">{totalCount} {totalCount === 1 ? "product" : "products"}</p>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{isPending ? "Updating products…" : `${totalCount} ${totalCount === 1 ? "product" : "products"}`}</p>
        </div>
        <div className="shop-controls__selects">
          <label>Show
            <NativeSelect aria-label="Products per page" value={String(options.pageSize)} disabled={isPending} onChange={(event) => navigate(shopHref(options, { pageSize: event.target.value === "4" ? 4 : 8 }))}>
              <NativeSelectOption value="8">8</NativeSelectOption><NativeSelectOption value="4">4</NativeSelectOption>
            </NativeSelect>
          </label>
          <label>Sort by
            <NativeSelect aria-label="Sort products" value={options.sort} disabled={isPending} onChange={(event) => navigate(shopHref(options, { sort: event.target.value as CatalogViewOptions["sort"] }))}>
              <NativeSelectOption value="featured">Featured</NativeSelectOption><NativeSelectOption value="name">Name</NativeSelectOption><NativeSelectOption value="price-low">Price: low to high</NativeSelectOption><NativeSelectOption value="price-high">Price: high to low</NativeSelectOption>
            </NativeSelect>
          </label>
        </div>
      </div>
    </section>
  )
}
