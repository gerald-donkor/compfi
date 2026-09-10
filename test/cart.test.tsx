import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { CartContent } from "@/components/cart/cart-content"
import { CartProvider } from "@/components/cart/cart-provider"
import { CartDrawer } from "@/components/chrome/cart-drawer"
import { ProductOptions } from "@/components/product/product-options"
import { addCartLine, cartItemCount, cartSubtotalCents, createCartLine, removeCartLine, setCartLineQuantity } from "@/lib/cart"
import { catalogProducts } from "@/lib/catalog"
import { checkA11y } from "./a11y"

const atlas = catalogProducts.find((product) => product.slug === "atlas-bed")!

describe("cart model", () => {
  it("accepts catalog selections, merges matching lines, clamps quantities, and calculates cents", () => {
    const first = createCartLine(atlas, { size: "queen", finish: "oatmeal" }, 8)!
    const state = addCartLine([], first)
    const merged = addCartLine(state, createCartLine(atlas, { size: "queen", finish: "oatmeal" }, 8)!)
    const variant = addCartLine(merged, createCartLine(atlas, { size: "king", finish: "warm-sand" }, 2)!)

    expect(createCartLine(atlas, { size: "invalid" })).toBeUndefined()
    expect(merged[0].quantity).toBe(10)
    expect(variant).toHaveLength(2)
    expect(cartItemCount(variant)).toBe(12)
    expect(cartSubtotalCents(variant, catalogProducts)).toBe(atlas.priceCents * 12)
  })

  it("keeps first-add order and safely ignores missing lines", () => {
    const line = createCartLine(atlas)!; const state = addCartLine([], line)
    expect(setCartLineQuantity(state, { slug: "missing" }, 4)).toBe(state)
    expect(removeCartLine(state, { slug: "missing" })).toEqual(state)
    expect(setCartLineQuantity(state, line, 0)).toEqual([])
  })
})

describe("cart interactions", () => {
  it("omits checkout entry points when the cart is empty", () => {
    render(<CartProvider><CartDrawer /><CartContent /></CartProvider>)
    expect(screen.queryByRole("link", { name: "Proceed to checkout" })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Checkout" })).not.toBeInTheDocument()
  })

  it("synchronizes detail additions, the drawer, and the cart page", async () => {
    const user = userEvent.setup()
    const { container } = render(<CartProvider><ProductOptions product={atlas} sizes={atlas.sizes} defaultSize={atlas.defaultSize} finishes={atlas.finishes} defaultFinish={atlas.defaultFinish} /><CartDrawer /><CartContent /></CartProvider>)

    await user.click(screen.getByRole("button", { name: "Add to cart" }))
    expect(screen.getByRole("button", { name: "Open cart, 1 items" })).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: atlas.name })[0]).toHaveAttribute("href", `/shop/${atlas.slug}`)
    expect(screen.getAllByText("$1,599.00").length).toBeGreaterThan(0)
    expect(screen.getByRole("link", { name: "Proceed to checkout" })).toHaveAttribute("href", "/checkout")
    await user.click(screen.getByRole("button", { name: "Open cart, 1 items" }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "View cart" })).toHaveAttribute("href", "/cart")
    expect(screen.getByRole("link", { name: "Checkout" })).toHaveAttribute("href", "/checkout")
    await user.click(screen.getByRole("button", { name: "Close" }))
    await user.click(screen.getAllByRole("button", { name: "Increase quantity" })[1])
    expect(screen.getByRole("button", { name: "Open cart, 2 items" })).toBeInTheDocument()
    expect(await checkA11y(container)).toEqual([])
  })
})
