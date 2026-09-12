import path from "node:path"

export type DatabaseConfig = {
  url: string
  authToken?: string
  isRemote: boolean
}

export function resolveDatabaseConfig(
  env: Readonly<Record<string, string | undefined>> = process.env,
  cwd = process.cwd()
): DatabaseConfig {
  const url = env.TURSO_DATABASE_URL?.trim()
  const authToken = env.TURSO_AUTH_TOKEN?.trim()

  if (Boolean(url) !== Boolean(authToken)) {
    throw new Error("Turso requires both TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.")
  }

  if (url && authToken) return { url, authToken, isRemote: true }

  if (env.NODE_ENV === "production" && env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("Production requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.")
  }

  return {
    url: env.DATABASE_URL?.trim() || `file:${path.join(cwd, "data", "compfi.db")}`,
    isRemote: false,
  }
}
