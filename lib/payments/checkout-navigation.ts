export function assignHostedCheckout(authorizationUrl: string): void {
  const checkoutUrl = new URL(authorizationUrl)
  if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.flutterwave.com") {
    throw new Error("Invalid payment destination")
  }
  window.location.assign(checkoutUrl.toString())
}
