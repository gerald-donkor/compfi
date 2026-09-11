import { eq } from "drizzle-orm"
import { db, ensureDbSchema } from "./index"
import { newsletterSubscribers, type NewsletterSubscriber } from "./schema"

export async function getSubscriberByEmail(
  email: string
): Promise<NewsletterSubscriber | undefined> {
  await ensureDbSchema()
  const normalizedEmail = email.trim().toLowerCase()
  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, normalizedEmail))

  return rows[0] ?? undefined
}

export async function subscribeEmail(
  email: string
): Promise<{ isNew: boolean; id: string }> {
  await ensureDbSchema()
  const normalizedEmail = email.trim().toLowerCase()

  const existing = await getSubscriberByEmail(normalizedEmail)
  if (existing) {
    return { isNew: false, id: existing.id }
  }

  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const now = Date.now()

  try {
    await db.insert(newsletterSubscribers).values({
      id,
      email: normalizedEmail,
      createdAt: now,
      status: "active",
    })

    return {
      isNew: true,
      id,
    }
  } catch (error) {
    // Handle concurrent insertion race condition
    const concurrent = await getSubscriberByEmail(normalizedEmail)
    if (concurrent) {
      return { isNew: false, id: concurrent.id }
    }
    throw error
  }
}
