import { isFlutterwaveCheckoutUrl } from "./flutterwave-shared"

export function assignHostedCheckout(authorizationUrl: string): void {
  if (!isFlutterwaveCheckoutUrl(authorizationUrl)) throw new Error("Invalid payment destination")
  window.location.assign(new URL(authorizationUrl).toString())
}
