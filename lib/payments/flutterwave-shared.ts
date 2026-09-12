const FLUTTERWAVE_CHECKOUT_HOST = "checkout.flutterwave.com"

export function isFlutterwaveCheckoutUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname === FLUTTERWAVE_CHECKOUT_HOST
  } catch {
    return false
  }
}
