import type { Client } from "@libsql/client"

let schemaInitialized = false
let schemaInitPromise: Promise<void> | null = null

export async function ensureDbSchema(client: Client) {
  if (schemaInitialized) return
  if (schemaInitPromise) return schemaInitPromise

  schemaInitPromise = (async () => {
    try {
      await client.execute("PRAGMA busy_timeout = 5000;")
      await client.execute("PRAGMA journal_mode = WAL;")
    } catch {
      // ignore pragma failure on non-sqlite environments
    }

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
      payment_provider TEXT,
      payment_reference TEXT,
      payment_transaction_id TEXT,
      payment_currency TEXT,
      paid_at INTEGER,
      receipt_status TEXT,
      receipt_sent_at INTEGER,
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
      customer_notification_status TEXT,
      customer_notified_at INTEGER,
      merchant_notification_status TEXT,
      merchant_notified_at INTEGER,
      created_at INTEGER NOT NULL
    );
  `)

    await client.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active'
    );
  `)

    await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
  `)

    const addMissingColumns = async (table: string, columns: Record<string, string>) => {
      const result = await client.execute(`PRAGMA table_info(${table});`)
      const existing = new Set(result.rows.map((row) => String(row.name)))
      for (const [name, definition] of Object.entries(columns)) {
        if (!existing.has(name)) {
          try {
            await client.execute(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition};`)
          } catch (error) {
            const refreshed = await client.execute(`PRAGMA table_info(${table});`)
            if (!refreshed.rows.some((row) => String(row.name) === name)) throw error
          }
        }
      }
    }

    await addMissingColumns("orders", {
      payment_provider: "TEXT",
      payment_reference: "TEXT",
      payment_transaction_id: "TEXT",
      payment_currency: "TEXT",
      paid_at: "INTEGER",
      receipt_status: "TEXT",
      receipt_sent_at: "INTEGER",
    })
    await addMissingColumns("contact_inquiries", {
      customer_notification_status: "TEXT",
      customer_notified_at: "INTEGER",
      merchant_notification_status: "TEXT",
      merchant_notified_at: "INTEGER",
    })

    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_reference
      ON orders(payment_reference) WHERE payment_reference IS NOT NULL;
    `)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS processed_payment_events (
        id TEXT PRIMARY KEY,
        provider TEXT NOT NULL,
        event_type TEXT NOT NULL,
        processed_at INTEGER NOT NULL
      );
    `)

    schemaInitialized = true
  })()

  try {
    await schemaInitPromise
  } catch (error) {
    schemaInitPromise = null
    throw error
  }
}
