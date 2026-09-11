import { desc, eq, inArray } from "drizzle-orm"
import { db, ensureDbSchema } from "./index"
import { orders, orderItems, type Order, type OrderItem, type ShippingAddress } from "./schema"

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
  const allItems = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds))

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

  const orderList = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))

  if (orderList.length === 0) return null

  const order = orderList[0]
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))

  return {
    ...order,
    items,
    parsedShippingAddress: parseShippingAddress(order.shippingAddress),
  }
}
