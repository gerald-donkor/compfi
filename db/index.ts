import fs from "node:fs"
import path from "node:path"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

const dbDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbUrl = process.env.DATABASE_URL || `file:${path.join(dbDir, "compfi.db")}`

export const client = createClient({
  url: dbUrl,
})

export const db = drizzle(client, { schema })

let schemaInitialized = false

export async function ensureDbSchema() {
  if (schemaInitialized) return

  await client.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      order_notes TEXT,
      subtotal_cents INTEGER NOT NULL,
      shipping_cents INTEGER NOT NULL DEFAULT 0,
      total_cents INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_slug TEXT NOT NULL,
      product_title TEXT NOT NULL,
      size TEXT,
      finish TEXT,
      quantity INTEGER NOT NULL,
      unit_price_cents INTEGER NOT NULL,
      total_price_cents INTEGER NOT NULL,
      image_src TEXT NOT NULL
    );
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `)

  schemaInitialized = true
}
