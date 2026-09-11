import fs from "node:fs"
import path from "node:path"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import { ensureDbSchema as initDbSchema } from "./init"
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

export async function ensureDbSchema() {
  await initDbSchema(client)
}
