import { and, desc, eq, inArray, ne } from "drizzle-orm"
import { db, ensureDbSchema } from "./index"
import {
  orders,
  orderItems,
  processedPaymentEvents,
  type NewOrder,
  type NewOrderItem,
  type NotificationStatus,
  type Order,
  type OrderItem,
  type OrderStatus,
  type ShippingAddress,
} from "./schema"

export type OrderWithItems = Order & {
  items: OrderItem[]
  parsedShippingAddress: ShippingAddress
}

export function parseShippingAddress(raw: string): ShippingAddress {
  const fallback: ShippingAddress = {
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    countryRegion: "United States",
  }
  try {
    const parsed = JSON.parse(raw)
    return {
      addressLine1: parsed.addressLine1 || "",
      addressLine2: parsed.addressLine2 || undefined,
      city: parsed.city || "",
      state: parsed.state || "",
      zipCode: parsed.zipCode || "",
      countryRegion: parsed.countryRegion || "United States",
    }
  } catch {
    return fallback
  }
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  await ensureDbSchema()

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))

  if (userOrders.length === 0) return []

  const orderIds = userOrders.map((o) => o.id)
  const allItems = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))

  const itemsByOrderId = new Map<string, OrderItem[]>()
  for (const item of allItems) {
    const list = itemsByOrderId.get(item.orderId) ?? []
    list.push(item)
    itemsByOrderId.set(item.orderId, list)
  }

  return userOrders.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.id) ?? [],
    parsedShippingAddress: parseShippingAddress(order.shippingAddress),
  }))
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  await ensureDbSchema()

  const orderList = await db.select().from(orders).where(eq(orders.id, orderId))

  if (orderList.length === 0) return null

  const order = orderList[0]
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))

  return {
    ...order,
    items,
    parsedShippingAddress: parseShippingAddress(order.shippingAddress),
  }
}

export async function getOrderByPaymentReference(
  paymentReference: string
): Promise<OrderWithItems | null> {
  await ensureDbSchema()
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.paymentReference, paymentReference))
    .limit(1)
  return order ? getOrderById(order.id) : null
}

export async function createPendingOrder(
  order: NewOrder,
  items: readonly NewOrderItem[]
): Promise<void> {
  await ensureDbSchema()
  await db.transaction(async (tx) => {
    await tx.insert(orders).values(order)
    if (items.length) await tx.insert(orderItems).values([...items])
  })
}

export async function markOrderPaymentState(
  orderId: string,
  status: Extract<OrderStatus, "payment_failed" | "payment_canceled">
): Promise<void> {
  await ensureDbSchema()
  await db
    .update(orders)
    .set({ status })
    .where(and(eq(orders.id, orderId), ne(orders.status, "paid")))
}

export type MarkOrderPaidResult = {
  order: OrderWithItems | null
  transitioned: boolean
}

function isDatabaseBusy(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "SQLITE_BUSY"
  )
}

async function retryBusyTransaction(operation: () => Promise<void>): Promise<void> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await operation()
      return
    } catch (error) {
      if (!isDatabaseBusy(error) || attempt === 3) throw error
      await new Promise((resolve) => setTimeout(resolve, 10 * (attempt + 1)))
    }
  }
}

export async function markOrderPaid(input: {
  orderId: string
  transactionId: string
  eventId?: string
  eventType?: string
}): Promise<MarkOrderPaidResult> {
  await ensureDbSchema()
  const now = Date.now()
  let transitioned = false

  await retryBusyTransaction(() => db.transaction(async (tx) => {
    if (input.eventId) {
      const inserted = await tx
        .insert(processedPaymentEvents)
        .values({
          id: input.eventId,
          provider: "flutterwave",
          eventType: input.eventType ?? "charge.completed",
          processedAt: now,
        })
        .onConflictDoNothing()
        .returning({ id: processedPaymentEvents.id })
      if (inserted.length === 0) return
    }

    const updated = await tx
      .update(orders)
      .set({
        status: "paid",
        paymentTransactionId: input.transactionId,
        paidAt: now,
        receiptStatus: "pending",
      })
      .where(and(eq(orders.id, input.orderId), ne(orders.status, "paid")))
      .returning({ id: orders.id })
    transitioned = updated.length === 1
  }))

  return { order: await getOrderById(input.orderId), transitioned }
}

export async function recordOrderReceipt(
  orderId: string,
  status: Extract<NotificationStatus, "sent" | "failed">
): Promise<void> {
  await ensureDbSchema()
  const query = db.update(orders).set({
    receiptStatus: status,
    receiptSentAt: status === "sent" ? Date.now() : null,
  })
  await query.where(
    status === "sent"
      ? eq(orders.id, orderId)
      : and(eq(orders.id, orderId), ne(orders.receiptStatus, "sent"))
  )
}
