import { desc, eq } from "drizzle-orm"
import { db, ensureDbSchema } from "./index"
import { orders, orderItems, type Order, type OrderItem } from "./schema"

export type OrderWithItems = Order & {
  items: OrderItem[]
  parsedShippingAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    countryRegion: string
  }
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  await ensureDbSchema()

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))

  const results: OrderWithItems[] = []

  for (const order of userOrders) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))

    let parsedShippingAddress = {
      addressLine1: "",
      city: "",
      state: "",
      zipCode: "",
      countryRegion: "United States",
    }
    try {
      parsedShippingAddress = JSON.parse(order.shippingAddress)
    } catch {
      // fallback
    }

    results.push({
      ...order,
      items,
      parsedShippingAddress,
    })
  }

  return results
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

  let parsedShippingAddress = {
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    countryRegion: "United States",
  }
  try {
    parsedShippingAddress = JSON.parse(order.shippingAddress)
  } catch {
    // fallback
  }

  return {
    ...order,
    items,
    parsedShippingAddress,
  }
}
