import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import ComparisonError from "@/app/comparison/error"
import ComparisonLoading from "@/app/comparison/loading"
import ComparisonPage from "@/app/comparison/page"
import { ProductComparison } from "@/components/comparison/product-comparison"
import { comparisonDefaultSlugs, resolveComparison } from "@/lib/comparison"
import { checkA11y } from "./a11y"

describe("comparison resolver", () => {
  it("uses a deterministic default and canonical URLs", () => {
    const comparison = resolveComparison()
    expect(comparison.products.map((product) => product.slug)).toEqual(comparisonDefaultSlugs)
    expect(comparison.addHref("alder-dining-chair")).toBe("/comparison?product=atlas-bed&product=haven-sectional&product=alder-dining-chair")
    expect(comparison.removeHref("atlas-bed")).toBe("/comparison?product=haven-sectional")
  })

  it("keeps known first occurrences, excludes choices, and caps selection", () => {
    const comparison = resolveComparison({ product: ["haven-sectional", "missing", "haven-sectional", "atlas-bed", "cove-media-console", "alder-dining-chair"] })
    expect(comparison.products.map((product) => product.slug)).toEqual(["haven-sectional", "atlas-bed", "cove-media-console"])
    expect(comparison.choices.map((product) => product.slug)).not.toContain("atlas-bed")
    expect(comparison.count).toBe(3)
  })

  it("distinguishes an explicit empty selection", () => {
    const comparison = resolveComparison({ product: "" })
    expect(comparison.products).toEqual([])
    expect(comparison.removeHref("anything")).toBe("/comparison?product=")
  })
})

describe("comparison page", () => {
  it("renders semantic default comparison content", async () => {
    const page = await ComparisonPage({ searchParams: Promise.resolve({}) })
    const { container } = render(page)
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
    expect(screen.getByRole("heading", { level: 1, name: "Product comparison" })).toBeInTheDocument()
    expect(screen.getByRole("table")).toHaveAccessibleName(/compare selected compfi products/i)
    expect(screen.getByRole("link", { name: "Remove Atlas Bed from comparison" })).toHaveAttribute("href", "/comparison?product=haven-sectional")
    expect(screen.getByRole("combobox", { name: "Add a product" })).toBeRequired()
    expect(screen.queryByText(/warranty|rating|stock|add to cart/i)).not.toBeInTheDocument()
    expect(await checkA11y(container)).toEqual([])
  })

  it("renders useful empty and full states", async () => {
    const empty = await ComparisonPage({ searchParams: Promise.resolve({ product: "" }) })
    const { rerender } = render(empty)
    expect(screen.getByText("Choose products to compare")).toBeVisible()
    expect(screen.queryByRole("table")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse products" })).toHaveAttribute("href", "/shop")
    rerender(<ProductComparison comparison={resolveComparison({ product: ["atlas-bed", "haven-sectional", "cove-media-console"] })} />)
    expect(screen.getByText("Comparison is full. Remove a product to add another.")).toBeVisible()
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument()
  })

  it("provides safe loading and error recovery", () => {
    const reset = () => undefined
    const { rerender } = render(<ComparisonLoading />)
    expect(screen.getByRole("main", { name: "Loading product comparison" })).toHaveAttribute("aria-busy", "true")
    rerender(<ComparisonError error={new Error("private")} reset={reset} />)
    expect(screen.queryByText("private")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Return to Shop" })).toHaveAttribute("href", "/shop")
  })
})
