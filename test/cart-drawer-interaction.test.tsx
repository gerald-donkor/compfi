import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { CartProvider } from "@/components/cart/cart-provider"
import { CartDrawer } from "@/components/chrome/cart-drawer"
import { ProductOptions } from "@/components/product/product-options"
import { catalogProducts } from "@/lib/catalog"
import { checkA11y } from "./a11y"

const atlas = catalogProducts.find((product) => product.slug === "atlas-bed")!

function renderDrawerWithSeededCart() {
  return render(
    <CartProvider>
      <ProductOptions
        product={atlas}
        sizes={atlas.sizes}
        defaultSize={atlas.defaultSize}
        finishes={atlas.finishes}
        defaultFinish={atlas.defaultFinish}
      />
      <CartDrawer />
    </CartProvider>
  )
}

describe("CartDrawer modal interaction contract", () => {
  it("opens a labelled dialog, closes on Escape, and returns focus to the trigger", async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <CartDrawer />
      </CartProvider>
    )

    const trigger = screen.getByRole("button", { name: "Open cart" })
    await user.click(trigger)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText("Your cart")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()

    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it("announces removal politely and moves focus to recovery when the last line is removed", async () => {
    const user = userEvent.setup()
    renderDrawerWithSeededCart()

    await user.click(screen.getByRole("button", { name: "Add to cart" }))
    expect(screen.getByRole("button", { name: "Open cart, 1 items" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Open cart, 1 items" }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: `Remove ${atlas.name}` }))

    await waitFor(() => expect(screen.getByText("Your cart is empty")).toBeInTheDocument())
    const liveRegion = document.body.querySelector('[aria-live="polite"]')
    expect(liveRegion?.textContent).toMatch(/removed from cart/i)
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Browse furniture" })).toHaveFocus()
    )
  })

  it("tolerates rapid open/close without a stuck trap or lost focus return", async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <CartDrawer />
      </CartProvider>
    )

    const trigger = screen.getByRole("button", { name: "Open cart" })
    await user.click(trigger)
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())

    await user.click(trigger)
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it("announces a single removal without duplicating the live message", async () => {
    const user = userEvent.setup()
    renderDrawerWithSeededCart()

    await user.click(screen.getByRole("button", { name: "Add to cart" }))
    await user.click(screen.getByRole("button", { name: "Open cart, 1 items" }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: `Remove ${atlas.name}` }))
    await waitFor(() => expect(screen.getByText("Your cart is empty")).toBeInTheDocument())

    expect(screen.queryByRole("button", { name: `Remove ${atlas.name}` })).not.toBeInTheDocument()
    const liveRegion = document.body.querySelector('[aria-live="polite"]')
    expect(liveRegion?.textContent).toMatch(/removed from cart/i)
    expect(liveRegion?.textContent).not.toMatch(/removed from cart.*removed from cart/i)
  })

  it("keeps dialog semantics and focus treatment accessible", async () => {
    const { container } = render(
      <CartProvider>
        <CartDrawer />
      </CartProvider>
    )
    expect(await checkA11y(container)).toEqual([])
  })
})
