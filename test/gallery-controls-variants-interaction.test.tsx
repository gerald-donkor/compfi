import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CartProvider } from "@/components/cart/cart-provider"
import { InspirationCarousel } from "@/components/home/inspiration-carousel"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInformation } from "@/components/product/product-information"
import { ProductOptions } from "@/components/product/product-options"
import { ShopControls } from "@/components/shop/shop-controls"
import { ShopResults } from "@/components/shop/shop-results"
import { catalogProducts } from "@/lib/catalog"
import { resolveCatalogView } from "@/lib/catalog-view"
import { inspirationSlides } from "@/lib/home-editorial"
import { checkA11y } from "./a11y"

const atlas = catalogProducts.find((product) => product.slug === "atlas-bed")!

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe("Gallery, controls, variants, and pagination interaction contracts", () => {
  it("operates gallery thumbnails via keyboard with polite status and lead update", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ProductGallery media={atlas.gallery} aria-label="Atlas Bed gallery" />
    )

    const firstThumb = screen.getByRole("button", { name: `Show ${atlas.gallery[0].alt}` })
    const secondThumb = screen.getByRole("button", { name: `Show ${atlas.gallery[1].alt}` })

    expect(firstThumb).toHaveAttribute("aria-pressed", "true")
    expect(secondThumb).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByRole("status")).toHaveTextContent("")

    await user.tab()
    expect(firstThumb).toHaveFocus()

    await user.tab()
    expect(secondThumb).toHaveFocus()
    await user.keyboard("{Enter}")

    expect(secondThumb).toHaveAttribute("aria-pressed", "true")
    expect(firstThumb).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByRole("status")).toHaveTextContent(`Showing ${atlas.gallery[1].alt}`)

    // Activating already selected thumbnail does not re-announce or error
    await user.keyboard("{Enter}")
    expect(screen.getByRole("status")).toHaveTextContent(`Showing ${atlas.gallery[1].alt}`)

    expect(await checkA11y(container)).toEqual([])
  })

  it("handles single-image gallery gracefully without breaking navigation", () => {
    const singleMedia = [atlas.gallery[0]]
    render(<ProductGallery media={singleMedia} aria-label="Single view" />)

    expect(screen.getByRole("img", { name: singleMedia[0].alt })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: `Show ${singleMedia[0].alt}` })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByRole("status")).toHaveTextContent("")
  })

  it("announces variant selections politely and enforces quantity boundaries", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ProductOptions
        product={atlas}
        sizes={atlas.sizes}
        defaultSize={atlas.defaultSize}
        finishes={atlas.finishes}
        defaultFinish={atlas.defaultFinish}
      />
    )

    const kingBtn = screen.getByRole("button", { name: "King" })
    await user.click(kingBtn)
    expect(kingBtn).toHaveAttribute("data-pressed", "")
    expect(screen.getByRole("status")).toHaveTextContent("Selected size King")

    const warmSandBtn = screen.getByRole("button", { name: "Warm sand" })
    await user.click(warmSandBtn)
    expect(warmSandBtn).toHaveAttribute("data-pressed", "")
    expect(screen.getByRole("status")).toHaveTextContent("Selected finish Warm sand")

    const incBtn = screen.getByRole("button", { name: "Increase quantity" })
    const decBtn = screen.getByRole("button", { name: "Decrease quantity" })
    const spin = screen.getByRole("spinbutton", { name: "Quantity" })

    expect(decBtn).toBeDisabled()
    await user.click(incBtn)
    expect(spin).toHaveValue(2)
    expect(decBtn).not.toBeDisabled()
    expect(screen.getByRole("status")).toHaveTextContent("Quantity set to 2")

    // Keyboard ArrowUp on spinbutton
    await user.click(spin)
    await user.keyboard("{ArrowUp}")
    expect(spin).toHaveValue(3)
    expect(screen.getByRole("status")).toHaveTextContent("Quantity set to 3")

    // Clamping to max 10
    await user.clear(spin)
    await user.type(spin, "15{Enter}")
    expect(spin).toHaveValue(10)
    expect(incBtn).toBeDisabled()
    expect(screen.getByRole("status")).toHaveTextContent("Quantity set to 10")

    expect(await checkA11y(container)).toEqual([])
  })

  it("guards Add to Cart with busy state and prevents duplicate triggers", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CartProvider>
        <ProductOptions
          product={atlas}
          sizes={atlas.sizes}
          defaultSize={atlas.defaultSize}
          finishes={atlas.finishes}
          defaultFinish={atlas.defaultFinish}
        />
      </CartProvider>
    )

    const addBtn = screen.getByRole("button", { name: "Add to cart" })
    expect(addBtn).toBeEnabled()
    expect(addBtn).not.toHaveAttribute("aria-busy")

    // Focus button
    addBtn.focus()
    expect(addBtn).toHaveFocus()

    await user.click(addBtn)

    // Button remains enabled (does NOT lose focus to body) with aria-busy="true"
    expect(addBtn).toBeEnabled()
    expect(addBtn).toHaveAttribute("aria-busy", "true")
    expect(addBtn).toHaveFocus()

    // Provider live message announced
    expect(screen.getByText(new RegExp(`${atlas.name} added to cart`, "i"))).toBeInTheDocument()

    // Accessible name kept
    expect(addBtn).toHaveTextContent("Add to cart")

    await waitFor(() => {
      expect(addBtn).not.toHaveAttribute("aria-busy")
    })

    expect(await checkA11y(container)).toEqual([])
  })

  it("provides single polite live region in ShopControls and roving view toggle", async () => {
    const viewOptions = {
      category: undefined,
      sort: "featured" as const,
      pageSize: 8 as const,
      view: "grid" as const,
      page: 1,
    }
    const { container } = render(<ShopControls options={viewOptions} totalCount={8} />)

    expect(container.querySelector(".shop-controls__count")).toHaveTextContent("8 products")
    // Settled status clears so virtual cursor does not announce duplicate count
    expect(screen.getByRole("status")).toHaveTextContent("")

    const gridBtn = screen.getByRole("button", { name: "Grid view" })
    const listBtn = screen.getByRole("button", { name: "List view" })

    expect(gridBtn).toHaveAttribute("tabindex", "0")
    expect(gridBtn).toHaveAttribute("data-composite-item-active")
    expect(listBtn).toHaveAttribute("tabindex", "-1")

    expect(await checkA11y(container)).toEqual([])
  })

  it("operates ProductInformation tabs with keyboard navigation and panel switching", async () => {
    const user = userEvent.setup()
    const { container } = render(<ProductInformation product={atlas} />)

    const descTab = screen.getByRole("tab", { name: "Description" })
    const detailsTab = screen.getByRole("tab", { name: "Details" })

    expect(descTab).toHaveAttribute("aria-selected", "true")
    expect(detailsTab).toHaveAttribute("aria-selected", "false")
    expect(screen.getByText(atlas.detailDescription)).toBeInTheDocument()

    // Keyboard navigation between tabs
    await user.click(descTab)
    expect(descTab).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    expect(detailsTab).toHaveFocus()
    await user.keyboard("{Enter}")

    expect(detailsTab).toHaveAttribute("aria-selected", "true")
    expect(descTab).toHaveAttribute("aria-selected", "false")
    expect(screen.getByText(atlas.id)).toBeInTheDocument()

    expect(await checkA11y(container)).toEqual([])
  })

  it("operates InspirationCarousel with dots, arrows, and polite status announcement", async () => {
    const user = userEvent.setup()
    const { container } = render(<InspirationCarousel slides={inspirationSlides} />)

    // Initial status
    const status = screen.getByRole("status")
    expect(status).toHaveTextContent(`Room 1 of ${inspirationSlides.length}: ${inspirationSlides[0].title}`)

    // Dots have accessible label and aria-current on active
    const dot1 = screen.getByRole("button", { name: `Go to room 1: ${inspirationSlides[0].title}` })
    const dot2 = screen.getByRole("button", { name: `Go to room 2: ${inspirationSlides[1].title}` })

    expect(dot1).toHaveAttribute("aria-current", "true")
    expect(dot2).not.toHaveAttribute("aria-current")

    // Click next dot
    await user.click(dot2)
    expect(dot2).toHaveAttribute("aria-current", "true")
    expect(status).toHaveTextContent(`Room 2 of ${inspirationSlides.length}: ${inspirationSlides[1].title}`)

    expect(await checkA11y(container)).toEqual([])
  })

  it("renders real pagination links with Prev and Next at multi-page view", async () => {
    const model = resolveCatalogView(catalogProducts, { pageSize: "4", page: "2" })
    const { container } = render(<ShopResults view={model} />)

    const pagination = screen.getByRole("navigation", { name: "pagination" })
    expect(pagination).toBeInTheDocument()

    const prevLink = screen.getByRole("link", { name: "Go to previous page" })
    const nextLink = screen.queryByRole("link", { name: "Go to next page" })
    const activePage = screen.getByRole("link", { name: "2" })

    expect(prevLink).toHaveAttribute("href", "/shop?pageSize=4")
    expect(prevLink).toHaveTextContent("Prev")
    expect(activePage).toHaveAttribute("aria-current", "page")
    expect(nextLink).not.toBeInTheDocument() // Page 2 of 2, so no Next link

    expect(await checkA11y(container)).toEqual([])
  })
})
