import { createClient } from "@libsql/client"
import { describe, expect, it } from "vitest"
import { ensureDbSchema, db } from "@/db"
import { ensureDbSchema as initializeSchema } from "@/db/init"
import { createPendingOrder, getOrderById, markOrderPaid } from "@/db/orders"
import { orders, orderItems, contactInquiries, processedPaymentEvents } from "@/db/schema"
import { eq } from "drizzle-orm"

describe("db schema and connection", () => {
  it("adds production-service columns to a legacy database without replacing rows", async () => {
    const legacyClient = createClient({ url: ":memory:" })
    await legacyClient.execute(`CREATE TABLE orders (
      id TEXT PRIMARY KEY, user_id TEXT, status TEXT NOT NULL DEFAULT 'confirmed',
      customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL, order_notes TEXT, subtotal_cents INTEGER NOT NULL,
      shipping_cents INTEGER NOT NULL DEFAULT 0, total_cents INTEGER NOT NULL, created_at INTEGER NOT NULL
    );`)
    await legacyClient.execute(`CREATE TABLE contact_inquiries (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
      message TEXT NOT NULL, created_at INTEGER NOT NULL
    );`)
    await legacyClient.execute({
      sql: `INSERT INTO orders (
        id, status, customer_name, customer_email, customer_phone, shipping_address,
        subtotal_cents, shipping_cents, total_cents, created_at
      ) VALUES (?, 'confirmed', 'Legacy Buyer', 'legacy@example.com', '555-0100', '{}', 100, 0, 100, 1)`,
      args: ["legacy-order"],
    })

    await initializeSchema(legacyClient)
    const columns = await legacyClient.execute("PRAGMA table_info(orders);")
    expect(columns.rows.map((row) => row.name)).toEqual(
      expect.arrayContaining(["payment_reference", "payment_transaction_id", "receipt_status"])
    )
    expect((await legacyClient.execute("SELECT status FROM orders WHERE id = 'legacy-order'"))
      .rows[0].status).toBe("confirmed")
    await legacyClient.close()
  })

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

    const retrievedOrders = await db.select().from(orders).where(eq(orders.id, orderId))

    expect(retrievedOrders).toHaveLength(1)
    expect(retrievedOrders[0].customerName).toBe("Jane Doe")
    expect(retrievedOrders[0].totalCents).toBe(50000)

    const retrievedItems = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))

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

  it("transitions a pending order to paid once and ignores a replayed event", async () => {
    const orderId = `test_payment_${Date.now()}`
    const eventId = `flutterwave:${orderId}`
    await createPendingOrder(
      {
        id: orderId,
        status: "pending_payment",
        customerName: "Pat Doe",
        customerEmail: "pat@example.com",
        customerPhone: "555-555-0100",
        shippingAddress: JSON.stringify({
          addressLine1: "1 Main St",
          city: "Accra",
          state: "GA",
          zipCode: "00000",
          countryRegion: "United States",
        }),
        subtotalCents: 10000,
        shippingCents: 2500,
        totalCents: 12500,
        paymentProvider: "flutterwave",
        paymentReference: orderId,
        paymentCurrency: "USD",
        createdAt: Date.now(),
      },
      []
    )

    const attempts = await Promise.all([
      markOrderPaid({ orderId, transactionId: "42", eventId }),
      markOrderPaid({ orderId, transactionId: "42", eventId }),
    ])
    expect(attempts.map((attempt) => attempt.transitioned).sort()).toEqual([false, true])
    expect((await getOrderById(orderId))?.status).toBe("paid")

    await db.delete(processedPaymentEvents).where(eq(processedPaymentEvents.id, eventId))
    await db.delete(orders).where(eq(orders.id, orderId))
  })
})
