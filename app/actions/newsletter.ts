"use server"

import { subscribeEmail } from "@/db/newsletter"
import { validateNewsletterEmail } from "@/lib/newsletter"

export type NewsletterActionResult =
  | {
      success: true
      message: string
    }
  | {
      success: false
      error: string
    }

export async function subscribeNewsletterAction(
  input: { email: string } | FormData
): Promise<NewsletterActionResult> {
  const emailRaw =
    input instanceof FormData ? input.get("email") : input?.email

  const validation = validateNewsletterEmail(emailRaw)
  if (!validation.valid || !validation.normalized) {
    return {
      success: false,
      error: validation.error ?? "Please enter a valid email address.",
    }
  }

  try {
    const result = await subscribeEmail(validation.normalized)

    if (!result.isNew) {
      return {
        success: true,
        message: "You are already subscribed to Compfi updates.",
      }
    }

    return {
      success: true,
      message: "Thank you for subscribing to Compfi updates.",
    }
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred while saving your subscription. Please try again.",
    }
  }
}
