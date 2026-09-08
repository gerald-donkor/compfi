import { describe, expect, it } from "vitest"
import { catalogProducts } from "@/lib/catalog"
import { resolveCatalogView, shopHref } from "@/lib/catalog-view"

describe("catalog view", () => {
  it("normalizes unsafe query values and preserves fixture order", () => {
    const view = resolveCatalogView(catalogProducts, { category: ["living"], page: "0", sort: "unknown", pageSize: "16" })
    expect(view.category).toBeUndefined()
    expect(view.visibleProducts.map((product) => product.id)).toEqual(catalogProducts.map((product) => product.id))
    expect(view.pageSize).toBe(8)
  })

  it("filters, sorts stably, and clamps real pages without mutating fixtures", () => {
    const before = catalogProducts.map((product) => product.id)
    const filtered = resolveCatalogView(catalogProducts, { category: "living", sort: "price-high", pageSize: "4", page: "99" })
    expect(filtered.totalCount).toBe(3)
    expect(filtered.page).toBe(1)
    expect(filtered.visibleStart).toBe(1)
    expect(filtered.visibleEnd).toBe(3)
    expect(filtered.visibleProducts.map((product) => product.id)).toEqual(["haven-sectional", "cove-media-console", "sora-lounge-chair"])
    expect(catalogProducts.map((product) => product.id)).toEqual(before)
  })

  it("builds canonical local URLs and resets pagination when result shape changes", () => {
    const view = resolveCatalogView(catalogProducts, { pageSize: "4", page: "2", view: "list" })
    expect(shopHref(view, { sort: "name" })).toBe("/shop?sort=name&view=list&pageSize=4")
    expect(shopHref(view, { page: 1 })).toBe("/shop?view=list&pageSize=4")
    expect(shopHref(view, { category: undefined })).toBe("/shop?view=list&pageSize=4")
  })

  it("accepts only the closed query unions and preserves every supported option", () => {
    for (const sort of ["featured", "name", "price-low", "price-high"] as const) {
      const view = resolveCatalogView(catalogProducts, { category: "dining", sort, view: "list", pageSize: "4", page: "2" })
      expect(view.category).toBe("dining")
      expect(view.sort).toBe(sort)
      expect(view.view).toBe("list")
      expect(view.pageSize).toBe(4)
      expect(view.page).toBe(1)
    }

    const invalid = resolveCatalogView(catalogProducts, { category: "office", sort: ["name"], view: "table", pageSize: "0", page: "9007199254740992" })
    expect(invalid).toMatchObject({ category: undefined, sort: "featured", view: "grid", pageSize: 8, page: 1 })
  })

  it("reports an empty catalog truthfully", () => {
    const view = resolveCatalogView([], { page: "2", pageSize: "4" })
    expect(view).toMatchObject({ totalCount: 0, totalPages: 1, page: 1, visibleStart: 0, visibleEnd: 0, visibleProducts: [] })
  })
})
