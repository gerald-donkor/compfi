import type { CatalogProduct, ProductCategory } from "@/types/commerce"

export const catalogCategories = ["dining", "living", "bedroom"] as const
export const catalogSorts = ["featured", "name", "price-low", "price-high"] as const
export const catalogViews = ["grid", "list"] as const
export const catalogPageSizes = [4, 8] as const

export type CatalogSort = (typeof catalogSorts)[number]
export type CatalogView = (typeof catalogViews)[number]
export type CatalogPageSize = (typeof catalogPageSizes)[number]
export type ShopQuery = Record<string, string | string[] | undefined>

export type CatalogViewOptions = {
  category?: ProductCategory
  sort: CatalogSort
  view: CatalogView
  pageSize: CatalogPageSize
  page: number
}

export type CatalogViewModel = CatalogViewOptions & {
  products: readonly CatalogProduct[]
  visibleProducts: readonly CatalogProduct[]
  totalCount: number
  visibleStart: number
  visibleEnd: number
  totalPages: number
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined
}

function includes<const T extends readonly string[]>(values: T, value: string | undefined): value is T[number] {
  return value !== undefined && values.includes(value)
}

function parsePage(value: string | undefined): number {
  if (!value || !/^[1-9]\d*$/.test(value)) return 1
  const page = Number(value)
  return Number.isSafeInteger(page) ? page : 1
}

export function resolveCatalogView(
  catalog: readonly CatalogProduct[],
  query: ShopQuery = {}
): CatalogViewModel {
  const categoryValue = firstValue(query.category)
  const sortValue = firstValue(query.sort)
  const viewValue = firstValue(query.view)
  const pageSizeValue = firstValue(query.pageSize)

  const category = includes(catalogCategories, categoryValue) ? categoryValue : undefined
  const sort = includes(catalogSorts, sortValue) ? sortValue : "featured"
  const view = includes(catalogViews, viewValue) ? viewValue : "grid"
  const pageSize = pageSizeValue === "4" ? 4 : 8
  const products = catalog
    .filter((product) => category === undefined || product.category === category)
    .map((product, index) => ({ product, index }))
    .sort((left, right) => {
      const byName = left.product.name.localeCompare(right.product.name, "en-US")
      const byPrice = left.product.priceCents - right.product.priceCents
      const result = sort === "name" ? byName : sort === "price-low" ? byPrice : sort === "price-high" ? -byPrice : 0
      return result || left.index - right.index
    })
    .map(({ product }) => product)
  const totalCount = products.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const page = Math.min(parsePage(firstValue(query.page)), totalPages)
  const visibleStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const visibleEnd = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount)

  return {
    category,
    sort,
    view,
    pageSize,
    page,
    products: Object.freeze(products),
    visibleProducts: Object.freeze(products.slice(visibleStart - 1, visibleEnd)),
    totalCount,
    visibleStart,
    visibleEnd,
    totalPages,
  }
}

export function shopHref(
  current: CatalogViewOptions,
  change: Partial<CatalogViewOptions> = {}
): string {
  const next = { ...current, ...change }
  const resultShapeChanged = Object.hasOwn(change, "category") || Object.hasOwn(change, "sort") || Object.hasOwn(change, "pageSize")
  const page = resultShapeChanged ? 1 : next.page
  const params = new URLSearchParams()
  if (next.category) params.set("category", next.category)
  if (next.sort !== "featured") params.set("sort", next.sort)
  if (next.view !== "grid") params.set("view", next.view)
  if (next.pageSize !== 8) params.set("pageSize", String(next.pageSize))
  if (page !== 1) params.set("page", String(page))
  const search = params.toString()
  return search ? `/shop?${search}` : "/shop"
}
