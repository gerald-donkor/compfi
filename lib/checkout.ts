export const CHECKOUT_FIELD_NAMES = [
  "firstName",
  "lastName",
  "company",
  "countryRegion",
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "zipCode",
  "phone",
  "email",
  "orderNotes",
] as const

export type CheckoutFieldName = (typeof CHECKOUT_FIELD_NAMES)[number]

export type CheckoutDetails = Readonly<Record<CheckoutFieldName, string>>

export type CheckoutErrors = Readonly<Partial<Record<CheckoutFieldName, string>>>

export const FREE_SHIPPING_THRESHOLD_CENTS = 50000 // $500
export const STANDARD_SHIPPING_CENTS = 2500 // $25

export function calculateShippingCents(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : STANDARD_SHIPPING_CENTS
}

export const CHECKOUT_MAX_LENGTHS: Readonly<Record<CheckoutFieldName, number>> = Object.freeze({
  firstName: 80,
  lastName: 80,
  company: 100,
  countryRegion: 13,
  addressLine1: 120,
  addressLine2: 120,
  city: 80,
  state: 80,
  zipCode: 10,
  phone: 25,
  email: 254,
  orderNotes: 500,
})

const REQUIRED_MESSAGES: Readonly<Partial<Record<CheckoutFieldName, string>>> = Object.freeze({
  firstName: "Enter your first name.",
  lastName: "Enter your last name.",
  addressLine1: "Enter your street address.",
  city: "Enter your city.",
  state: "Enter your state.",
  zipCode: "Enter your ZIP code.",
  phone: "Enter your phone number.",
  email: "Enter your email address.",
})

const MAX_LENGTH_MESSAGES: Readonly<Record<CheckoutFieldName, string>> = Object.freeze({
  firstName: "First name must be 80 characters or fewer.",
  lastName: "Last name must be 80 characters or fewer.",
  company: "Company name must be 100 characters or fewer.",
  countryRegion: "Country/region must be United States.",
  addressLine1: "Street address must be 120 characters or fewer.",
  addressLine2: "Apartment, suite, or unit must be 120 characters or fewer.",
  city: "City must be 80 characters or fewer.",
  state: "State must be 80 characters or fewer.",
  zipCode: "ZIP code must be 10 characters or fewer.",
  phone: "Phone number must be 25 characters or fewer.",
  email: "Email address must be 254 characters or fewer.",
  orderNotes: "Order notes must be 500 characters or fewer.",
})

const ZIP_CODE_PATTERN = /^\d{5}(?:-\d{4})?$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[\d\s()+.-]+$/

export function reviewCheckoutDetails(details: CheckoutDetails): CheckoutErrors {
  const errors: Partial<Record<CheckoutFieldName, string>> = {}

  for (const fieldName of CHECKOUT_FIELD_NAMES) {
    const value = details[fieldName].trim()
    const requiredMessage = REQUIRED_MESSAGES[fieldName]

    if (!value && requiredMessage) {
      errors[fieldName] = requiredMessage
      continue
    }

    if (value.length > CHECKOUT_MAX_LENGTHS[fieldName]) {
      errors[fieldName] = MAX_LENGTH_MESSAGES[fieldName]
    }
  }

  if (details.countryRegion.trim() !== "United States") {
    errors.countryRegion = "Country/region must be United States."
  }

  const zipCode = details.zipCode.trim()
  if (zipCode && !errors.zipCode && !ZIP_CODE_PATTERN.test(zipCode)) {
    errors.zipCode = "Enter a 5-digit ZIP code or ZIP+4."
  }

  const phone = details.phone.trim()
  if (phone && !errors.phone) {
    const digitCount = phone.replace(/\D/g, "").length
    if (!PHONE_PATTERN.test(phone) || digitCount < 10 || digitCount > 15) {
      errors.phone = "Enter a phone number with 10 to 15 digits."
    }
  }

  const email = details.email.trim()
  if (email && !errors.email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address."
  }

  return Object.freeze(errors)
}
