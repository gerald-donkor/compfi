export const CONTACT_FIELD_NAMES = ["name", "email", "message"] as const

export type ContactFieldName = (typeof CONTACT_FIELD_NAMES)[number]

export type ContactDetails = Readonly<Record<ContactFieldName, string>>

export type ContactErrors = Readonly<Partial<Record<ContactFieldName, string>>>

export const CONTACT_MAX_LENGTHS: Readonly<Record<ContactFieldName, number>> = Object.freeze({
  name: 80,
  email: 254,
  message: 2000,
})

const REQUIRED_MESSAGES: Readonly<Record<ContactFieldName, string>> = Object.freeze({
  name: "Enter your name.",
  email: "Enter your email address.",
  message: "Enter your message.",
})

const MAX_LENGTH_MESSAGES: Readonly<Record<ContactFieldName, string>> = Object.freeze({
  name: "Name must be 80 characters or fewer.",
  email: "Email address must be 254 characters or fewer.",
  message: "Message must be 2000 characters or fewer.",
})

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function reviewContactDetails(details: ContactDetails): ContactErrors {
  const errors: Partial<Record<ContactFieldName, string>> = {}

  for (const fieldName of CONTACT_FIELD_NAMES) {
    const value = details[fieldName].trim()

    if (!value) {
      errors[fieldName] = REQUIRED_MESSAGES[fieldName]
      continue
    }

    if (value.length > CONTACT_MAX_LENGTHS[fieldName]) {
      errors[fieldName] = MAX_LENGTH_MESSAGES[fieldName]
    }
  }

  const email = details.email.trim()
  if (email && !errors.email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address."
  }

  return Object.freeze(errors)
}
