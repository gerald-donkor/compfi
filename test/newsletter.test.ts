import { describe, expect, it } from "vitest"
import { db, ensureDbSchema } from "@/db"
import { newsletterSubscribers } from "@/db/schema"
import { getSubscriberByEmail, subscribeEmail } from "@/db/newsletter"
import { subscribeNewsletterAction } from "@/app/actions/newsletter"
import { validateNewsletterEmail } from "@/lib/newsletter"
import { eq } from "drizzle-orm"

describe("Newsletter service: db/newsletter, lib/newsletter, and subscribeNewsletterAction", () => {
  it("validates newsletter email formatting and length", () => {
    expect(validateNewsletterEmail("").valid).toBe(false)
    expect(validateNewsletterEmail("   ").valid).toBe(false)
    expect(validateNewsletterEmail("notanemail").valid).toBe(false)
    expect(validateNewsletterEmail(123).valid).toBe(false)
    expect(validateNewsletterEmail("a".repeat(250) + "@example.com").valid).toBe(false)

    const valid = validateNewsletterEmail("  Hello@Compfi.com  ")
    expect(valid.valid).toBe(true)
    expect(valid.normalized).toBe("hello@compfi.com")
  })

  it("initializes schema and manages subscriber persistence", async () => {
    await ensureDbSchema()

    const testEmail = `test_sub_${Date.now()}@example.com`

    // Initially should be undefined
    const initial = await getSubscriberByEmail(testEmail)
    expect(initial).toBeUndefined()

    // Subscribe
    const subResult = await subscribeEmail(testEmail)
    expect(subResult.isNew).toBe(true)
    expect(subResult.id).toMatch(/^sub_/)

    // Query again
    const found = await getSubscriberByEmail(testEmail)
    expect(found).toBeDefined()
    expect(found?.email).toBe(testEmail)
    expect(found?.status).toBe("active")

    // Resubscribe (idempotent)
    const idempotentResult = await subscribeEmail(testEmail.toUpperCase())
    expect(idempotentResult.isNew).toBe(false)
    expect(idempotentResult.id).toBe(subResult.id)

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
      }

      // Re-subscribing is idempotent
      const duplicateRes = await subscribeNewsletterAction({ email })
      expect(duplicateRes.success).toBe(true)
      if (duplicateRes.success) {
        expect(duplicateRes.message).toBe("You are already subscribed to Compfi updates.")
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
