export const NEWSLETTER_MAX_EMAIL_LENGTH = 255
export const NEWSLETTER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface NewsletterValidationResult {
  valid: boolean
  normalized?: string
  error?: string
}

export function validateNewsletterEmail(
  rawEmail: unknown
): NewsletterValidationResult {
  if (typeof rawEmail !== "string") {
    return {
      valid: false,
      error: "Please enter a valid email address.",
    }
  }

  const trimmed = rawEmail.trim().toLowerCase()

  if (
    !trimmed ||
    trimmed.length > NEWSLETTER_MAX_EMAIL_LENGTH ||
    !NEWSLETTER_EMAIL_REGEX.test(trimmed)
  ) {
    return {
      valid: false,
      error: "Please enter a valid email address.",
    }
  }

  return {
    valid: true,
    normalized: trimmed,
  }
}
