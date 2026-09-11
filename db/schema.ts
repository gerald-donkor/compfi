import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  status: text("status").notNull().default("confirmed"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  orderNotes: text("order_notes"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
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
  createdAt: integer("created_at").notNull(),
})

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at").notNull(),
  status: text("status").notNull().default("active"),
})

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
export type ContactInquiry = typeof contactInquiries.$inferSelect
export type NewContactInquiry = typeof contactInquiries.$inferInsert
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert

export type ShippingAddress = {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  countryRegion: string
}
