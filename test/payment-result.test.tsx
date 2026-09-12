import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { CartProvider, useCart } from "@/components/cart/cart-provider"
import { PaymentResult } from "@/components/checkout/payment-result"
import type { OrderWithItems } from "@/db/orders"
import { getCatalogProductBySlug } from "@/lib/catalog"
import { checkA11y } from "./a11y"

const paidOrder = {
  id: "ORD-PAID-123",
  userId: null,
  status: "paid",
  customerName: "Avery Stone",
  customerEmail: "avery@example.com",
  customerPhone: "555-0100",
  shippingAddress: "{}",
  orderNotes: null,
  subtotalCents: 32900,
  shippingCents: 2500,
  totalCents: 35400,
  paymentProvider: "flutterwave",
  paymentReference: "ORD-PAID-123",
  paymentTransactionId: "42",
  paymentCurrency: "USD",
  paidAt: 1,
  receiptStatus: "sent",
  receiptSentAt: 1,
  createdAt: 1,
  items: [],
  parsedShippingAddress: {
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    countryRegion: "United States",
  },
} satisfies OrderWithItems

function SeededCart({ children }: { children: React.ReactNode }) {
  const { add } = useCart()
  React.useEffect(() => {
    const product = getCatalogProductBySlug("alder-dining-chair")
    if (product) add(product, {}, 1)
  }, [add])
  return <>{children}</>
}

function CartCount() {
  const { lines } = useCart()
  return <output aria-label="Test cart count">{lines.length}</output>
}

describe("PaymentResult", () => {
  it.each([
    ["pending", "Payment is still processing"],
    ["canceled", "Payment canceled"],
    ["failed", "Payment was not completed"],
    ["invalid", "We could not verify this payment"],
  ] as const)("renders the %s recovery state without clearing the cart", async (status, heading) => {
    const { container } = render(
      <CartProvider>
        <SeededCart>
          <PaymentResult status={status} order={paidOrder} />
          <CartCount />
        </SeededCart>
      </CartProvider>
    )
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText("Test cart count")).toHaveTextContent("1"))
    expect(await checkA11y(container)).toEqual([])
  })

  it("clears the cart only when rendering a verified paid result", async () => {
    const { rerender } = render(
      <CartProvider>
        <SeededCart>
          <PaymentResult status="pending" order={paidOrder} />
          <CartCount />
        </SeededCart>
      </CartProvider>
    )
    await waitFor(() => expect(screen.getByLabelText("Test cart count")).toHaveTextContent("1"))
    rerender(
      <CartProvider>
        <PaymentResult status="paid" order={paidOrder} />
        <CartCount />
      </CartProvider>
    )
    expect(screen.getByRole("heading", { name: "Payment confirmed" })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText("Test cart count")).toHaveTextContent("0"))
  })
})
