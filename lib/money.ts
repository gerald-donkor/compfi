const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Format integer amount in cents into en-US USD currency string.
 * Throws TypeError for non-safe-integer or floating-point values.
 */
export function formatMoney(amountCents: number): string {
  if (!Number.isSafeInteger(amountCents)) {
    throw new TypeError(
      `formatMoney expected a safe integer in cents, received ${amountCents}`
    )
  }

  return usdFormatter.format(amountCents / 100)
}
