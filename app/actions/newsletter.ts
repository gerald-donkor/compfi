"use server"

import { subscribeEmail } from "@/db/newsletter"

export type NewsletterActionResult =
  | {
      success: true
      message: string
      isNew: boolean
    }
  | {
      success: false
      error: string
    }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 255

export async function subscribeNewsletterAction(
  input: { email: string } | FormData
): Promise<NewsletterActionResult> {
  const emailRaw =
    input instanceof FormData ? input.get("email") : input?.email

  if (typeof emailRaw !== "string") {
    return {
      success: false,
      error: "Please enter a valid email address.",
    }
  }

  const email = emailRaw.trim()

  if (
    !email ||
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_REGEX.test(email)
  ) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    }
  }

  try {
    const result = await subscribeEmail(email)

    if (!result.isNew) {
      return {
        success: true,
        message: "You are already subscribed to Compfi updates.",
        isNew: false,
      }
    }

    return {
      success: true,
      message: "Thank you for subscribing to Compfi updates.",
      isNew: true,
    }
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred while saving your subscription. Please try again.",
    }
  }
}
