import { describe, expect, it } from "vitest"
import { searchStorefront } from "@/lib/search"

describe("searchStorefront", () => {
  it("returns empty results for empty or whitespace query", () => {
    expect(searchStorefront("")).toEqual({ products: [], articles: [], totalCount: 0 })
    expect(searchStorefront("   ")).toEqual({ products: [], articles: [], totalCount: 0 })
  })

  it("safely handles special regex characters and long input without throwing", () => {
    expect(() => searchStorefront("([*+?^${}()|/\\])")).not.toThrow()
    const longString = "a".repeat(200)
    expect(() => searchStorefront(longString)).not.toThrow()
  })

  it("finds products by name, sets formatted price and shop href", () => {
    const results = searchStorefront("Atlas")
    expect(results.products.length).toBeGreaterThan(0)
    const atlas = results.products.find((p) => p.title.toLowerCase().includes("atlas"))
    expect(atlas).toBeDefined()
    expect(atlas?.type).toBe("product")
    expect(atlas?.href).toMatch(/^\/shop\/atlas-bed/)
    expect(atlas?.priceFormatted).toMatch(/^\$\d+(,\d+)?\.\d{2}$/)
    expect(atlas?.badge).toBe("Bedroom")
  })

  it("finds products by room category", () => {
    const results = searchStorefront("dining")
    expect(results.products.length).toBeGreaterThan(0)
    for (const product of results.products) {
      expect(product.badge).toBe("Dining Room")
    }
  })

  it("finds blog articles by title and category with blog href", () => {
    const results = searchStorefront("millennial")
    expect(results.articles.length).toBeGreaterThan(0)
    const article = results.articles[0]
    expect(article.type).toBe("article")
    expect(article.href).toMatch(/^\/blog#/)
    expect(article.badge).toBeDefined()
    expect(article.subtitle).toMatch(/\d{4}/)
  })

  it("ranks exact/starts-with title matches ahead of description-only matches", () => {
    const results = searchStorefront("Haven")
    expect(results.products[0].title.toLowerCase()).toContain("haven")
  })

  it("aggregates total count across products and articles", () => {
    // "wood" appears in both products (e.g. descriptions/names) and blog category
    const results = searchStorefront("wood")
    expect(results.totalCount).toBe(results.products.length + results.articles.length)
    expect(results.totalCount).toBeGreaterThan(0)
  })
})
