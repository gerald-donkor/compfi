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

  if (!trimmed) {
    return {
      valid: false,
      error: "Please enter a valid email address.",
    }
  }

  if (trimmed.length > NEWSLETTER_MAX_EMAIL_LENGTH) {
    return {
      valid: false,
      error: `Email address cannot exceed ${NEWSLETTER_MAX_EMAIL_LENGTH} characters.`,
    }
  }

  if (!NEWSLETTER_EMAIL_REGEX.test(trimmed)) {
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
