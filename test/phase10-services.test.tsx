import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { OrderHistory } from "@/components/account/order-history"
import { CartProvider, useCart } from "@/components/cart/cart-provider"
import { CheckoutContent } from "@/components/checkout/checkout-content"
import { ContactForm } from "@/components/contact/contact-form"
import { getCatalogProductBySlug } from "@/lib/catalog"
import type { OrderWithItems } from "@/db/orders"
import { checkA11y } from "./a11y"
import { resetTestClerkState, setTestClerkState } from "./setup"

const { assignHostedCheckout, placeOrderAction } = vi.hoisted(() => ({
  assignHostedCheckout: vi.fn(),
  placeOrderAction: vi.fn(),
}))

vi.mock("@/app/actions/checkout", () => ({ placeOrderAction }))
vi.mock("@/lib/payments/checkout-navigation", () => ({ assignHostedCheckout }))

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/checkout",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

// Helper to seed cart
function CartSeeder({ children }: { children: React.ReactNode }) {
  const { add } = useCart()
  React.useEffect(() => {
    const product = getCatalogProductBySlug("alder-dining-chair")
    if (product) {
      add(product, { finish: "natural-oak" }, 2)
    }
  }, [add])
  return <>{children}</>
}

describe("Phase 10: Real Services (Local SQLite Persistence & Orders)", () => {
  beforeEach(() => {
    resetTestClerkState()
    placeOrderAction.mockResolvedValue({
      success: true,
      orderId: "ORD-TEST-PAYMENT",
      authorizationUrl: "https://checkout.flutterwave.com/v3/hosted/pay/test",
    })
  })

  afterEach(() => {
    resetTestClerkState()
  })

  describe("OrderHistory Component", () => {
    it("renders accessible empty state with data-slot and custom className", async () => {
      const { container } = render(<OrderHistory orders={[]} className="custom-test-class" />)

      const section = container.querySelector("[data-slot='order-history']")
      expect(section).toBeInTheDocument()
      expect(section).toHaveClass("custom-test-class")

      expect(screen.getByRole("heading", { name: "No orders yet" })).toBeInTheDocument()
      const browseLink = screen.getByRole("link", { name: "Browse furniture" })
      expect(browseLink).toBeInTheDocument()
      expect(browseLink).toHaveAttribute("href", "/shop")

      expect(await checkA11y(container)).toEqual([])
    })

    it("renders order cards with item details, status badge, and totals", async () => {
      const mockOrders: OrderWithItems[] = [
        {
          id: "ORD-123456-ABCD",
          userId: "user_test_1",
          status: "confirmed",
          customerName: "Jane Doe",
          customerEmail: "jane@example.com",
          customerPhone: "555-0100",
          shippingAddress: JSON.stringify({
            addressLine1: "123 Main St",
            city: "Austin",
            state: "TX",
            zipCode: "78701",
            countryRegion: "United States",
          }),
          orderNotes: "Leave on porch",
          subtotalCents: 65800,
          shippingCents: 0,
          totalCents: 65800,
          paymentProvider: null,
          paymentReference: null,
          paymentTransactionId: null,
          paymentCurrency: null,
          paidAt: null,
          receiptStatus: null,
          receiptSentAt: null,
          createdAt: 1726070400000,
          parsedShippingAddress: {
            addressLine1: "123 Main St",
            city: "Austin",
            state: "TX",
            zipCode: "78701",
            countryRegion: "United States",
          },
          items: [
            {
              id: "item_1",
              orderId: "ORD-123456-ABCD",
              productSlug: "alder-dining-chair",
              productTitle: "Alder Dining Chair",
              size: "Standard",
              finish: "Natural oak",
              quantity: 2,
              unitPriceCents: 32900,
              totalPriceCents: 65800,
              imageSrc: "/images/catalog/alder-dining-chair.webp",
            },
          ],
        },
      ]

      const { container } = render(<OrderHistory orders={mockOrders} />)

      expect(container.querySelector("[data-slot='order-history']")).toBeInTheDocument()
      expect(screen.getByText("ORD-123456-ABCD")).toBeInTheDocument()
      expect(screen.getByText("Confirmed (legacy)")).toBeInTheDocument()
      expect(screen.getByText("Alder Dining Chair")).toBeInTheDocument()
      expect(screen.getByText("Size: Standard • Finish: Natural oak")).toBeInTheDocument()
      expect(screen.getByText("Qty: 2 × $329.00")).toBeInTheDocument()
      expect(screen.getByText("Total: $658.00")).toBeInTheDocument()

      expect(await checkA11y(container)).toEqual([])
    })
  })

  describe("CheckoutContent Order Placement", () => {
    it("opens the validated hosted checkout without clearing the local cart", async () => {
      setTestClerkState({ isSignedIn: true, userId: "user_test_sarah" })
      const user = userEvent.setup()

      const { container } = render(
        <CartProvider>
          <CartSeeder>
            <CheckoutContent />
          </CartSeeder>
        </CartProvider>
      )

      // Wait for cart to be seeded and checkout form to render
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Continue to secure payment" })
        ).toBeInTheDocument()
      })

      // Fill in required fields
      await user.type(screen.getByLabelText(/^First name/), "Sarah")
      await user.type(screen.getByLabelText(/^Last name/), "Connor")
      await user.type(screen.getByLabelText(/^Street address/), "100 Resistance Blvd")
      await user.type(screen.getByLabelText(/^City/), "Los Angeles")
      await user.type(screen.getByLabelText(/^State/), "CA")
      await user.type(screen.getByLabelText(/^ZIP code/), "90001")
      await user.type(screen.getByLabelText(/^Phone/), "213-555-0199")
      await user.type(screen.getByLabelText(/^Email address/), "sarah@resistance.org")

      // Submit order
      const placeOrderBtn = screen.getByRole("button", {
        name: "Continue to secure payment",
      })
      await user.click(placeOrderBtn)

      await waitFor(() => {
        expect(assignHostedCheckout).toHaveBeenCalledWith(
          "https://checkout.flutterwave.com/v3/hosted/pay/test"
        )
      })
      expect(screen.getByText("Alder Dining Chair")).toBeInTheDocument()

      expect(await checkA11y(container)).toEqual([])
    })
  })

  describe("ContactForm Submission", () => {
    it("submits contact inquiry and displays success confirmation banner", async () => {
      const user = userEvent.setup()
      const { container } = render(<ContactForm />)

      await user.type(screen.getByLabelText(/^Name/), "Jordan Blake")
      await user.type(screen.getByLabelText(/^Email address/), "jordan@example.com")
      await user.type(
        screen.getByLabelText(/^Message/),
        "Could you provide wood care instructions for the Alder Dining Chair?"
      )

      const submitBtn = screen.getByRole("button", { name: "Send message" })
      await user.click(submitBtn)

      await waitFor(() => {
        expect(
          screen.getByText("Thank you! Your message was received. We'll be in touch soon.")
        ).toBeInTheDocument()
      })

      expect(await checkA11y(container)).toEqual([])
    })
  })
})
