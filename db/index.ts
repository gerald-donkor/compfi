import fs from "node:fs"
import path from "node:path"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import { resolveDatabaseConfig } from "./config"
import { ensureDbSchema as initDbSchema } from "./init"
import * as schema from "./schema"

const databaseConfig = resolveDatabaseConfig()
if (!databaseConfig.isRemote) {
  const dbDir = path.dirname(databaseConfig.url.replace(/^file:/, ""))
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
}

export const client = createClient({
  url: databaseConfig.url,
  authToken: databaseConfig.authToken,
})

export const db = drizzle(client, { schema })

export async function ensureDbSchema() {
  await initDbSchema(client)
}
