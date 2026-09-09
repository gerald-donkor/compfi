import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { ProductGallery } from "@/components/product/product-gallery"
import { catalogProducts } from "@/lib/catalog"
import { checkA11y } from "./a11y"

describe("ProductGallery", () => {
  it("selects a view with pressed semantics and restrained status", async () => {
    const user = userEvent.setup()
    const product = catalogProducts[0]
    const { container } = render(<ProductGallery media={product.gallery} aria-label="Alder views" />)

    const lead = screen.getByRole("img", { name: product.gallery[0].alt })
    expect(decodeURIComponent(lead.getAttribute("src") ?? "")).toContain(product.gallery[0].path)
    expect(screen.getByRole("status")).toHaveTextContent("")

    const alternate = screen.getByRole("button", { name: `Show ${product.gallery[1].alt}` })
    await user.click(alternate)
    expect(alternate).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("img", { name: product.gallery[1].alt })).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent(`Showing ${product.gallery[1].alt}`)

    await user.tab()
    await user.keyboard("{Enter}")
    expect(await checkA11y(container)).toEqual([])
  })

  it("resets visually for a new media set and handles empty media", () => {
    const { rerender } = render(<ProductGallery media={catalogProducts[0].gallery} />)
    rerender(<ProductGallery media={catalogProducts[1].gallery} />)
    expect(screen.getByRole("img", { name: catalogProducts[1].gallery[0].alt })).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("")

    rerender(<ProductGallery media={[]} />)
    expect(screen.getByText("Product images unavailable")).toBeInTheDocument()
  })
})
