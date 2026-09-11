import { describe, expect, it } from "vitest"
import { ensureDbSchema, db } from "@/db"
import { orders, orderItems, contactInquiries } from "@/db/schema"
import { eq } from "drizzle-orm"

describe("db schema and connection", () => {
  it("initializes schema and inserts/queries an order", async () => {
    await ensureDbSchema()

    const orderId = `test_ord_${Date.now()}`
    await db.insert(orders).values({
      id: orderId,
      userId: "user_test_123",
      status: "confirmed",
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhone: "555-123-4567",
      shippingAddress: JSON.stringify({
        addressLine1: "123 Main St",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        countryRegion: "United States",
      }),
      orderNotes: "Leave at front door",
      subtotalCents: 50000,
      shippingCents: 0,
      totalCents: 50000,
      createdAt: Date.now(),
    })

    await db.insert(orderItems).values({
      id: `item_${Date.now()}`,
      orderId: orderId,
      productSlug: "alder-dining-chair",
      productTitle: "Alder Dining Chair",
      size: "Standard",
      finish: "Natural Ash",
      quantity: 2,
      unitPriceCents: 25000,
      totalPriceCents: 50000,
      imageSrc: "/images/products/alder-dining-chair-1.webp",
    })

    const retrievedOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))

    expect(retrievedOrders).toHaveLength(1)
    expect(retrievedOrders[0].customerName).toBe("Jane Doe")
    expect(retrievedOrders[0].totalCents).toBe(50000)

    const retrievedItems = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    expect(retrievedItems).toHaveLength(1)
    expect(retrievedItems[0].productTitle).toBe("Alder Dining Chair")
    expect(retrievedItems[0].quantity).toBe(2)

    // Clean up
    await db.delete(orders).where(eq(orders.id, orderId))
  })

  it("inserts and queries contact inquiries", async () => {
    await ensureDbSchema()

    const inquiryId = `inq_${Date.now()}`
    await db.insert(contactInquiries).values({
      id: inquiryId,
      name: "Alex Smith",
      email: "alex@example.com",
      message: "Do you offer fabric swatches?",
      createdAt: Date.now(),
    })

    const retrieved = await db
      .select()
      .from(contactInquiries)
      .where(eq(contactInquiries.id, inquiryId))

    expect(retrieved).toHaveLength(1)
    expect(retrieved[0].name).toBe("Alex Smith")

    // Clean up
    await db.delete(contactInquiries).where(eq(contactInquiries.id, inquiryId))
  })
})
