import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CartProvider } from "@/components/cart/cart-provider"
import { CheckoutContent } from "@/components/checkout/checkout-content"
import { ProductOptions } from "@/components/product/product-options"
import { catalogProducts } from "@/lib/catalog"
import {
  CHECKOUT_MAX_LENGTHS,
  reviewCheckoutDetails,
  type CheckoutDetails,
  type CheckoutFieldName,
} from "@/lib/checkout"
import { checkA11y } from "./a11y"

const { assignHostedCheckout, placeOrderAction } = vi.hoisted(() => ({
  assignHostedCheckout: vi.fn(),
  placeOrderAction: vi.fn(),
}))

vi.mock("@/app/actions/checkout", () => ({ placeOrderAction }))
vi.mock("@/lib/payments/checkout-navigation", () => ({ assignHostedCheckout }))

const atlas = catalogProducts.find((product) => product.slug === "atlas-bed")!

const validDetails: CheckoutDetails = {
  firstName: "Avery",
  lastName: "Stone",
  company: "",
  countryRegion: "United States",
  addressLine1: "240 Cedar Avenue",
  addressLine2: "",
  city: "Portland",
  state: "Oregon",
  zipCode: "97205-1234",
  phone: "+1 (503) 555-0198",
  email: "avery@example.com",
  orderNotes: "",
}

describe("checkout detail review", () => {
  it("accepts valid US details and returns an immutable empty record", () => {
    const errors = reviewCheckoutDetails(validDetails)
    expect(errors).toEqual({})
    expect(Object.isFrozen(errors)).toBe(true)
    expect(reviewCheckoutDetails({ ...validDetails, zipCode: "97205" })).toEqual({})
  })

  it("rejects trimmed blanks and invalid ZIP, phone, and email values", () => {
    const blankErrors = reviewCheckoutDetails({
      ...validDetails,
      firstName: "   ",
      city: "\t",
    })
    expect(blankErrors.firstName).toBe("Enter your first name.")
    expect(blankErrors.city).toBe("Enter your city.")

    const formatErrors = reviewCheckoutDetails({
      ...validDetails,
      zipCode: "9720",
      phone: "503-55",
      email: "avery@example",
    })
    expect(formatErrors.zipCode).toBe("Enter a 5-digit ZIP code or ZIP+4.")
    expect(formatErrors.phone).toBe("Enter a phone number with 10 to 15 digits.")
    expect(formatErrors.email).toBe("Enter a valid email address.")
    expect(reviewCheckoutDetails({ ...validDetails, phone: "call5035550198" }).phone).toBe(
      "Enter a phone number with 10 to 15 digits."
    )
  })

  it("enforces explicit upper bounds", () => {
    const boundedFields = Object.keys(CHECKOUT_MAX_LENGTHS) as CheckoutFieldName[]

    for (const fieldName of boundedFields) {
      const errors = reviewCheckoutDetails({
        ...validDetails,
        [fieldName]: "a".repeat(CHECKOUT_MAX_LENGTHS[fieldName] + 1),
      })
      expect(errors[fieldName], fieldName).toBeDefined()
    }
  })
})

describe("checkout presentation", () => {
  beforeEach(() => {
    assignHostedCheckout.mockClear()
    placeOrderAction.mockResolvedValue({
      success: true,
      orderId: "ORD-CHECKOUT-TEST",
      authorizationUrl: "https://checkout.flutterwave.com/v3/hosted/pay/test",
    })
  })

  it("renders a useful empty state without checkout controls", async () => {
    const { container } = render(
      <CartProvider>
        <CheckoutContent />
      </CartProvider>
    )
    expect(screen.getByRole("heading", { name: "Your cart is empty" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse furniture" })).toHaveAttribute("href", "/shop")
    expect(screen.queryByRole("form")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Check details" })).not.toBeInTheDocument()
    expect(await checkA11y(container)).toEqual([])
  })

  it("reviews populated details without submitting or clearing the cart", async () => {
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
        <CheckoutContent />
      </CartProvider>
    )

    await user.click(screen.getByRole("button", { name: "Add to cart" }))
    expect(screen.getByText("Billing details")).toBeInTheDocument()
    expect(screen.getByText("Queen · Oatmeal")).toBeInTheDocument()
    expect(screen.getAllByText("$1,599.00").length).toBeGreaterThan(0)

    await user.click(screen.getByRole("button", { name: "Continue to secure payment" }))
    const summary = screen.getByText("Check the highlighted details").closest("[role='alert']")
    expect(summary).not.toBeNull()
    await waitFor(() => expect(summary).toHaveFocus())
    expect(screen.getByLabelText("First name")).toHaveAttribute("aria-invalid", "true")

    for (const [label, value] of [
      ["First name", validDetails.firstName],
      ["Last name", validDetails.lastName],
      ["Street address", validDetails.addressLine1],
      ["City", validDetails.city],
      ["State", validDetails.state],
      ["ZIP code", validDetails.zipCode],
      ["Phone", validDetails.phone],
      ["Email address", validDetails.email],
    ] as const) {
      await user.type(screen.getByLabelText(label), value)
    }

    expect(screen.queryByText("Enter your first name.")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Continue to secure payment" }))
    await waitFor(() => {
      expect(assignHostedCheckout).toHaveBeenCalledWith(
        "https://checkout.flutterwave.com/v3/hosted/pay/test"
      )
    })
    expect(screen.getByRole("button", { name: "Continue to secure payment" })).toBeInTheDocument()
    expect(screen.getByText("Atlas Bed")).toBeInTheDocument()
    expect(await checkA11y(container)).toEqual([])
  })
})
