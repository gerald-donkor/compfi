import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { placeOrderAction } from "@/app/actions/checkout"
import { submitContactInquiryAction } from "@/app/actions/contact"
import { calculateShippingCents } from "@/lib/checkout"
import { getOrderById } from "@/db/orders"
import { db } from "@/db"
import { orders, contactInquiries } from "@/db/schema"
import { eq } from "drizzle-orm"

describe("Server Actions: checkout and contact persistence", () => {
  beforeEach(() => {
    vi.stubEnv("FLUTTERWAVE_SECRET_KEY", "test-secret")
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "success",
            data: {
              link: "https://checkout.flutterwave.com/v3/hosted/pay/test",
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  const validDetails = {
    firstName: "John",
    lastName: "Appleseed",
    company: "Acme Design",
    countryRegion: "United States",
    addressLine1: "1 Infinite Loop",
    addressLine2: "Suite 100",
    city: "Cupertino",
    state: "CA",
    zipCode: "95014",
    phone: "408-555-1234",
    email: "john@example.com",
    orderNotes: "Leave at door",
  }

  it("rejects empty cart submission", async () => {
    const result = await placeOrderAction(validDetails, [])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.message).toContain("cart is empty")
    }
  })

  it("rejects invalid billing details", async () => {
    const invalidDetails = {
      ...validDetails,
      firstName: "",
      email: "invalid-email",
    }
    const result = await placeOrderAction(invalidDetails, [
      { slug: "alder-dining-chair", quantity: 1 },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors?.firstName).toBeDefined()
      expect(result.errors?.email).toBeDefined()
    }
  })

  it("rejects invalid variant options", async () => {
    const invalidFinishResult = await placeOrderAction(validDetails, [
      {
        slug: "alder-dining-chair",
        quantity: 1,
        finish: "non-existent-finish",
      },
    ])
    expect(invalidFinishResult.success).toBe(false)
    if (!invalidFinishResult.success) {
      expect(invalidFinishResult.message).toContain("not valid for Alder Dining Chair")
    }

    const invalidSizeResult = await placeOrderAction(validDetails, [
      { slug: "alder-dining-chair", quantity: 1, size: "king" },
    ])
    expect(invalidSizeResult.success).toBe(false)
    if (!invalidSizeResult.success) {
      expect(invalidSizeResult.message).toContain("not valid for Alder Dining Chair")
    }
  })

  it("rejects invalid or out-of-range quantities", async () => {
    const zeroResult = await placeOrderAction(validDetails, [
      { slug: "alder-dining-chair", quantity: 0 },
    ])
    expect(zeroResult.success).toBe(false)
    if (!zeroResult.success) {
      expect(zeroResult.message).toContain("must be an integer between 1 and 10")
    }

    const excessiveResult = await placeOrderAction(validDetails, [
      { slug: "alder-dining-chair", quantity: 11 },
    ])
    expect(excessiveResult.success).toBe(false)
    if (!excessiveResult.success) {
      expect(excessiveResult.message).toContain("must be an integer between 1 and 10")
    }

    const floatResult = await placeOrderAction(validDetails, [
      { slug: "alder-dining-chair", quantity: 2.5 },
    ])
    expect(floatResult.success).toBe(false)
    if (!floatResult.success) {
      expect(floatResult.message).toContain("must be an integer between 1 and 10")
    }
  })

  it("calculates shipping accurately with threshold logic", () => {
    expect(calculateShippingCents(0)).toBe(2500)
    expect(calculateShippingCents(49999)).toBe(2500)
    expect(calculateShippingCents(50000)).toBe(0)
    expect(calculateShippingCents(100000)).toBe(0)
  })

  it("calculates authoritative totals and persists order", async () => {
    // Alder dining chair is 32900 cents ($329). 2 chairs = $658, which hits free shipping ($0)
    const result = await placeOrderAction(validDetails, [
      { slug: "alder-dining-chair", quantity: 2, finish: "natural-oak" },
    ])

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.orderId).toMatch(/^ORD-/)
      expect(result.authorizationUrl).toMatch(/^https:\/\/checkout\.flutterwave\.com\//)

      // Query database directly
      const savedOrder = await getOrderById(result.orderId)
      expect(savedOrder).not.toBeNull()
      expect(savedOrder?.customerName).toBe("John Appleseed")
      expect(savedOrder?.items).toHaveLength(1)
      expect(savedOrder?.items[0].productTitle).toBe("Alder Dining Chair")
      expect(savedOrder?.items[0].quantity).toBe(2)
      expect(savedOrder?.items[0].unitPriceCents).toBe(32900)
      expect(savedOrder?.subtotalCents).toBe(65800)
      expect(savedOrder?.shippingCents).toBe(0)
      expect(savedOrder?.totalCents).toBe(65800)
      expect(savedOrder?.status).toBe("pending_payment")

      // Cleanup
      await db.delete(orders).where(eq(orders.id, result.orderId))
    }
  })

  it("adds standard shipping for orders under $500 threshold", async () => {
    // 1 chair is $329 (< $500), so shipping should be $25 (2500 cents)
    const result = await placeOrderAction(validDetails, [
      { slug: "alder-dining-chair", quantity: 1 },
    ])

    expect(result.success).toBe(true)
    if (result.success) {
      const savedOrder = await getOrderById(result.orderId)
      expect(savedOrder?.subtotalCents).toBe(32900)
      expect(savedOrder?.shippingCents).toBe(2500)
      expect(savedOrder?.totalCents).toBe(35400)

      // Cleanup
      await db.delete(orders).where(eq(orders.id, result.orderId))
    }
  })

  it("validates and persists contact inquiries", async () => {
    const invalidResult = await submitContactInquiryAction({
      name: "",
      email: "bad-email",
      message: "",
    })
    expect(invalidResult.success).toBe(false)
    if (!invalidResult.success) {
      expect(invalidResult.errors?.name).toBeDefined()
      expect(invalidResult.errors?.email).toBeDefined()
      expect(invalidResult.errors?.message).toBeDefined()
    }

    const validResult = await submitContactInquiryAction({
      name: "Morgan Lee",
      email: "morgan@example.com",
      message: "I love your handcrafted wooden tables!",
    })
    expect(validResult.success).toBe(true)
    if (validResult.success) {
      expect(validResult.inquiryId).toMatch(/^inq_/)

      // Cleanup
      await db.delete(contactInquiries).where(eq(contactInquiries.id, validResult.inquiryId))
    }
  })
})
