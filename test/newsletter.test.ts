import { describe, expect, it } from "vitest"
import { db, ensureDbSchema } from "@/db"
import { newsletterSubscribers } from "@/db/schema"
import { getSubscriberByEmail, subscribeEmail } from "@/db/newsletter"
import { subscribeNewsletterAction } from "@/app/actions/newsletter"
import { eq } from "drizzle-orm"

describe("Newsletter service: db/newsletter and subscribeNewsletterAction", () => {
  it("initializes schema and manages subscriber persistence", async () => {
    await ensureDbSchema()

    const testEmail = `test_sub_${Date.now()}@example.com`

    // Initially should be null
    const initial = await getSubscriberByEmail(testEmail)
    expect(initial).toBeNull()

    // Subscribe
    const subResult = await subscribeEmail(testEmail)
    expect(subResult.isNew).toBe(true)
    expect(subResult.subscriber.email).toBe(testEmail)
    expect(subResult.subscriber.status).toBe("active")
    expect(subResult.subscriber.id).toMatch(/^sub_/)

    // Query again
    const found = await getSubscriberByEmail(testEmail)
    expect(found).not.toBeNull()
    expect(found?.email).toBe(testEmail)

    // Resubscribe (idempotent)
    const idempotentResult = await subscribeEmail(testEmail.toUpperCase())
    expect(idempotentResult.isNew).toBe(false)
    expect(idempotentResult.subscriber.id).toBe(subResult.subscriber.id)

    // Clean up
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.email, testEmail))
  })

  describe("subscribeNewsletterAction validation and execution", () => {
    it("rejects invalid or missing email inputs", async () => {
      // Empty input
      const emptyResult = await subscribeNewsletterAction({ email: "" })
      expect(emptyResult.success).toBe(false)
      if (!emptyResult.success) {
        expect(emptyResult.error).toBe("Please enter a valid email address.")
      }

      // Whitespace only
      const whitespaceResult = await subscribeNewsletterAction({ email: "   " })
      expect(whitespaceResult.success).toBe(false)

      // Invalid format
      const invalidFormat1 = await subscribeNewsletterAction({ email: "notanemail" })
      expect(invalidFormat1.success).toBe(false)

      const invalidFormat2 = await subscribeNewsletterAction({ email: "user@" })
      expect(invalidFormat2.success).toBe(false)

      const invalidFormat3 = await subscribeNewsletterAction({ email: "user@domain" })
      expect(invalidFormat3.success).toBe(false)

      // Over 255 chars
      const longEmail = `${"a".repeat(250)}@example.com`
      const longResult = await subscribeNewsletterAction({ email: longEmail })
      expect(longResult.success).toBe(false)
    })

    it("processes valid subscriptions with object input", async () => {
      const email = `reader_${Date.now()}@compfi-test.com`

      const res = await subscribeNewsletterAction({ email: `  ${email.toUpperCase()}  ` })
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.message).toBe("Thank you for subscribing to Compfi updates.")
        expect(res.isNew).toBe(true)
      }

      // Re-subscribing is idempotent
      const duplicateRes = await subscribeNewsletterAction({ email })
      expect(duplicateRes.success).toBe(true)
      if (duplicateRes.success) {
        expect(duplicateRes.message).toBe("You are already subscribed to Compfi updates.")
        expect(duplicateRes.isNew).toBe(false)
      }

      // Cleanup
      await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.email, email))
    })

    it("processes valid subscriptions with FormData input", async () => {
      const email = `formdata_${Date.now()}@compfi-test.com`
      const formData = new FormData()
      formData.append("email", email)

      const res = await subscribeNewsletterAction(formData)
      expect(res.success).toBe(true)
      if (res.success) {
        expect(res.message).toBe("Thank you for subscribing to Compfi updates.")
      }

      // Cleanup
      await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.email, email))
    })
  })
})
