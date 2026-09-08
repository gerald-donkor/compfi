import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ProductCard } from "@/components/commerce/product-card"
import { catalogProducts } from "@/lib/catalog"
import { checkA11y } from "./a11y"

describe("ProductCard", () => {
  it("renders a catalog product with its accessible details and navigation", async () => {
    const product = catalogProducts[1]
    const { container } = render(<ProductCard product={product} data-testid="morrow-card" />)

    const card = screen.getByTestId("morrow-card")
    expect(card).toHaveAttribute("data-slot", "product-card")
    expect(screen.getByRole("heading", { name: product.name, level: 3 })).toBeInTheDocument()
    expect(screen.getByAltText(product.media.alt)).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: product.name })[0]).toHaveAttribute(
      "href",
      `/shop/${product.slug}`
    )
    expect(screen.getByText("15%")).toBeInTheDocument()
    expect(screen.getByText("$849.00")).toBeInTheDocument()
    expect(screen.getByText("$999.00")).toBeInTheDocument()

    expect(await checkA11y(container)).toEqual([])
  })

  it("only renders a New badge and no compare-at price when the fixture calls for it", () => {
    render(<ProductCard product={catalogProducts[3]} />)

    expect(screen.getByText("New")).toBeInTheDocument()
    expect(screen.queryByText("$999.00")).not.toBeInTheDocument()
  })
})
