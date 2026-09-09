import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import ProductError from "@/app/shop/[slug]/error"
import ProductLoading from "@/app/shop/[slug]/loading"
import ProductNotFound from "@/app/shop/[slug]/not-found"
import ProductPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/shop/[slug]/page"
import { ProductInformation } from "@/components/product/product-information"
import { ProductOptions } from "@/components/product/product-options"
import { catalogProducts } from "@/lib/catalog"
import { formatMoney } from "@/lib/money"
import { checkA11y } from "./a11y"

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND")
  },
}))

describe("product detail route", () => {
  it("prerenders every fixture and creates product metadata", async () => {
    expect(generateStaticParams()).toEqual(catalogProducts.map(({ slug }) => ({ slug })))
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "atlas-bed" }) })
    expect(metadata.title).toBe("Atlas Bed")
    expect(metadata.description).toBe(catalogProducts[4].description)
  })

  it("renders one main and one product heading from promised params", async () => {
    const page = await ProductPage({ params: Promise.resolve({ slug: "atlas-bed" }) })
    render(page)

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("heading", { level: 1, name: "Atlas Bed" })).toBeInTheDocument()
    expect(screen.getByText("$1,599.00")).toBeInTheDocument()
    expect(screen.queryByText(/\breviews?\b|\brating\b|\bstock\b|\bwarranty\b/i)).not.toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: "Morrow Dining Table" })[0]).toHaveAttribute("href", "/shop/morrow-dining-table")
    expect(screen.getByRole("link", { name: "Compare" })).toHaveAttribute("href", "/comparison?product=atlas-bed")
  })

  it("renders every slug with unique metadata and catalog-backed content", async () => {
    const titles = new Set<string>()

    for (const product of catalogProducts) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: product.slug }),
      })
      titles.add(String(metadata.title))

      const page = await ProductPage({
        params: Promise.resolve({ slug: product.slug }),
      })
      const rendered = render(page)
      expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(product.name)
      expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
      expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/shop")
      expect(screen.getByText(formatMoney(product.priceCents))).toBeInTheDocument()
      expect(screen.getByText(product.detailDescription)).toBeInTheDocument()
      rendered.unmount()
    }

    expect(titles.size).toBe(catalogProducts.length)
  })

  it("does not swallow the not-found interrupt", async () => {
    await expect(ProductPage({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("NEXT_NOT_FOUND")
  })

  it("provides safe loading, not-found, and error recovery states", async () => {
    const reset = vi.fn()
    const { rerender } = render(<ProductLoading />)
    expect(screen.getByRole("main", { name: "Loading product" })).toHaveAttribute("aria-busy", "true")

    rerender(<ProductNotFound />)
    expect(screen.getByRole("link", { name: "Browse products" })).toHaveAttribute("href", "/shop")

    rerender(<ProductError error={new Error("private detail")} reset={reset} />)
    expect(screen.queryByText("private detail")).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }))
    expect(reset).toHaveBeenCalledOnce()
  })
})

describe("product detail interactions", () => {
  it("keeps options independent and cart action inert while comparison navigates", async () => {
    const user = userEvent.setup()
    const product = catalogProducts[4]
    const { container } = render(
      <ProductOptions
        sizes={product.sizes}
        defaultSize={product.defaultSize}
        finishes={product.finishes}
        defaultFinish={product.defaultFinish}
        comparisonHref="/comparison?product=atlas-bed"
      />
    )

    await user.click(screen.getByRole("button", { name: "King" }))
    await user.click(screen.getByRole("button", { name: "Warm sand" }))
    await user.click(screen.getByRole("button", { name: "Increase quantity" }))
    expect(screen.getByRole("button", { name: "King" })).toHaveAttribute("data-pressed", "")
    expect(screen.getByRole("button", { name: "Warm sand" })).toHaveAttribute("data-pressed", "")
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(2)
    await user.clear(screen.getByRole("spinbutton", { name: "Quantity" }))
    await user.type(screen.getByRole("spinbutton", { name: "Quantity" }), "20{Enter}")
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(10)
    expect(screen.getByRole("button", { name: "Increase quantity" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeDisabled()
    expect(screen.getByRole("link", { name: "Compare" })).toHaveAttribute("href", "/comparison?product=atlas-bed")
    expect(screen.getByText("Online ordering is not available in this preview.")).toBeVisible()
    expect(await checkA11y(container)).toEqual([])
  })

  it("omits unavailable option groups without removing quantity or actions", () => {
    render(<ProductOptions />)

    expect(screen.queryByText("Size")).not.toBeInTheDocument()
    expect(screen.queryByText("Finish")).not.toBeInTheDocument()
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(1)
    expect(screen.getByRole("button", { name: "Decrease quantity" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeDisabled()
  })

  it("uses Base UI tab relationships and keyboard selection", async () => {
    const user = userEvent.setup()
    const { container } = render(<ProductInformation product={catalogProducts[4]} />)
    const description = screen.getByRole("tab", { name: "Description" })
    const details = screen.getByRole("tab", { name: "Details" })

    expect(description).toHaveAttribute("aria-selected", "true")
    await user.click(details)
    expect(details).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Product ID")
    await user.keyboard("{Home}")
    expect(description).toHaveFocus()
    await user.keyboard("{End}")
    expect(details).toHaveFocus()
    await user.keyboard("{ArrowLeft}")
    expect(description).toHaveFocus()
    expect(await checkA11y(container)).toEqual([])
  })
})
