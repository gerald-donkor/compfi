import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export type OrderStatus =
  | "confirmed"
  | "pending_payment"
  | "paid"
  | "payment_failed"
  | "payment_canceled"

export type NotificationStatus = "pending" | "sent" | "failed"

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  status: text("status").notNull().default("confirmed").$type<OrderStatus>(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  orderNotes: text("order_notes"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  paymentProvider: text("payment_provider").$type<"flutterwave">(),
  paymentReference: text("payment_reference"),
  paymentTransactionId: text("payment_transaction_id"),
  paymentCurrency: text("payment_currency"),
  paidAt: integer("paid_at"),
  receiptStatus: text("receipt_status").$type<NotificationStatus>(),
  receiptSentAt: integer("receipt_sent_at"),
  createdAt: integer("created_at").notNull(),
})

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull(),
  productTitle: text("product_title").notNull(),
  size: text("size"),
  finish: text("finish"),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  totalPriceCents: integer("total_price_cents").notNull(),
  imageSrc: text("image_src").notNull(),
})

export const contactInquiries = sqliteTable("contact_inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  customerNotificationStatus: text("customer_notification_status").$type<NotificationStatus>(),
  customerNotifiedAt: integer("customer_notified_at"),
  merchantNotificationStatus: text("merchant_notification_status").$type<NotificationStatus>(),
  merchantNotifiedAt: integer("merchant_notified_at"),
  createdAt: integer("created_at").notNull(),
})

export const processedPaymentEvents = sqliteTable("processed_payment_events", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull().$type<"flutterwave">(),
  eventType: text("event_type").notNull(),
  processedAt: integer("processed_at").notNull(),
})

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at").notNull(),
  status: text("status").notNull().default("active").$type<"active" | "unsubscribed">(),
})

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
export type ContactInquiry = typeof contactInquiries.$inferSelect
export type NewContactInquiry = typeof contactInquiries.$inferInsert
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert

export interface NewsletterSubscriberRecord {
  id: string
  email: string
  createdAt: number
  status: "active" | "unsubscribed"
}

export type ShippingAddress = {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  countryRegion: string
}
