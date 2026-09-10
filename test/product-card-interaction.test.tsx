import { readFileSync } from "node:fs"
import { join } from "node:path"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ProductCard } from "@/components/commerce/product-card"
import { catalogProducts } from "@/lib/catalog"
import { checkA11y } from "./a11y"

const globalsCss = readFileSync(join(process.cwd(), "app/globals.css"), "utf8")

describe("ProductCard overlay interaction contract", () => {
  it("exposes one clear destination with predictable names across image, title, and overlay links", () => {
    const product = catalogProducts[0]
    const detailHref = `/shop/${product.slug}`
    render(<ProductCard product={product} />)

    const namedLinks = screen.getAllByRole("link", { name: product.name })
    expect(namedLinks).toHaveLength(2)
    for (const link of namedLinks) {
      expect(link).toHaveAttribute("href", detailHref)
    }

    const overlayLink = screen.getByRole("link", { name: `View ${product.name}` })
    expect(overlayLink).toHaveAttribute("href", detailHref)
    expect(overlayLink).toHaveTextContent("View product")

    const destinations = new Set(
      screen.getAllByRole("link").map((link) => link.getAttribute("href"))
    )
    expect(destinations.has(detailHref)).toBe(true)
  })

  it("renders no badge node for a plain product and no discount without a compare-at price", () => {
    const plain = catalogProducts.find((product) => product.badge === undefined)!
    const { container } = render(<ProductCard product={plain} />)
    expect(container.querySelector(".product-card__badge")).toBeNull()

    const saleWithoutCompareAt = { ...catalogProducts[0], badge: "sale" as const, compareAtPriceCents: undefined }
    const { container: saleContainer } = render(<ProductCard product={saleWithoutCompareAt} />)
    expect(saleContainer.querySelector(".product-card__badge")).toBeNull()
  })

  it("keeps badge meaning in text and reuses motion tokens with a reduced-motion reset", () => {
    const sale = catalogProducts.find((product) => product.badge === "sale")!
    render(<ProductCard product={sale} />)
    expect(screen.getByText(/%/).textContent).toMatch(/%/)

    const overlayStart = globalsCss.indexOf(".product-card__overlay {")
    const overlayRule = overlayStart === -1 ? "" : globalsCss.slice(overlayStart, overlayStart + 600)
    expect(overlayRule).toContain("display: flex")
    expect(overlayRule).not.toContain("display: none")
    expect(overlayRule).toContain("var(--duration-fast)")
    expect(overlayRule).toContain("var(--ease-standard)")
    expect(globalsCss).toContain(".product-card:focus-within .product-card__overlay")
    expect(globalsCss).toContain("prefers-reduced-motion: reduce")

    const overlayLinkStart = globalsCss.indexOf(".product-card__overlay-link {")
    const overlayLinkRule =
      overlayLinkStart === -1 ? "" : globalsCss.slice(overlayLinkStart, overlayLinkStart + 500)
    expect(overlayLinkRule).toContain("var(--control-min)")

    const titleLinkStart = globalsCss.indexOf(".product-card__title-link {")
    const titleLinkRule =
      titleLinkStart === -1 ? "" : globalsCss.slice(titleLinkStart, titleLinkStart + 400)
    expect(titleLinkRule).toContain("var(--control-min)")
  })

  it("has no axe violations for a representative card", async () => {
    const { container } = render(<ProductCard product={catalogProducts[0]} />)
    expect(await checkA11y(container)).toEqual([])
  })
})
