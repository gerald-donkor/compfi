import { catalogProducts } from "@/lib/catalog"
import type { CatalogProduct } from "@/types/commerce"

export type ComparisonQuery = Record<string, string | string[] | undefined>

export const comparisonCapacity = 3
export const comparisonDefaultSlugs = ["atlas-bed", "haven-sectional"] as const

export interface ComparisonViewModel {
  products: readonly CatalogProduct[]
  choices: readonly CatalogProduct[]
  count: number
  capacity: number
  removeHref: (slug: string) => string
}

function comparisonHref(slugs: readonly string[]): string {
  const params = new URLSearchParams()
  for (const slug of slugs) params.append("product", slug)
  const query = params.toString()
  return query ? `/comparison?${query}` : "/comparison?product="
}

function queryValues(query: ComparisonQuery): readonly string[] | undefined {
  const value = query.product
  if (value === undefined) return undefined
  return typeof value === "string" ? [value] : Array.isArray(value) ? value : []
}

export function resolveComparison(
  query: ComparisonQuery = {},
  catalog: readonly CatalogProduct[] = catalogProducts
): ComparisonViewModel {
  const values = queryValues(query)
  const known = new Map(catalog.map((product) => [product.slug, product]))
  const selectedSlugs = values === undefined
    ? [...comparisonDefaultSlugs]
    : values.filter((value, index, all) => known.has(value) && all.indexOf(value) === index).slice(0, comparisonCapacity)
  const products = selectedSlugs.flatMap((slug) => {
    const product = known.get(slug)
    return product ? [product] : []
  })
  const selected = new Set(selectedSlugs)

  return {
    products: Object.freeze(products),
    choices: Object.freeze(catalog.filter((product) => !selected.has(product.slug))),
    count: products.length,
    capacity: comparisonCapacity,
    removeHref: (slug) => comparisonHref(selectedSlugs.filter((current) => current !== slug)),
  }
}
