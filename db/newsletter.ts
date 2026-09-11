import { eq } from "drizzle-orm"
import { db, ensureDbSchema } from "./index"
import { newsletterSubscribers, type NewsletterSubscriber } from "./schema"

export async function getSubscriberByEmail(
  email: string
): Promise<NewsletterSubscriber | null> {
  await ensureDbSchema()
  const normalizedEmail = email.trim().toLowerCase()
  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, normalizedEmail))

  return rows[0] ?? null
}

export async function subscribeEmail(
  email: string
): Promise<{ isNew: boolean; subscriber: NewsletterSubscriber }> {
  await ensureDbSchema()
  const normalizedEmail = email.trim().toLowerCase()

  const existing = await getSubscriberByEmail(normalizedEmail)
  if (existing) {
    return { isNew: false, subscriber: existing }
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
      subscriber: {
        id,
        email: normalizedEmail,
        createdAt: now,
        status: "active",
      },
    }
  } catch (error) {
    // Handle concurrent insertion race condition
    const concurrent = await getSubscriberByEmail(normalizedEmail)
    if (concurrent) {
      return { isNew: false, subscriber: concurrent }
    }
    throw error
  }
}
