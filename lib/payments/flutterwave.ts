import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

export { isFlutterwaveCheckoutUrl } from "./flutterwave-shared"
import { isFlutterwaveCheckoutUrl } from "./flutterwave-shared"

const FLUTTERWAVE_API = "https://api.flutterwave.com/v3"

export class PaymentProviderError extends Error {
  constructor(
    message = "Secure payment is temporarily unavailable. Please try again.",
    readonly code: "unavailable" | "invalid" = "unavailable"
  ) {
    super(message)
    this.name = "PaymentProviderError"
  }
}

type Fetcher = typeof fetch

function requireSecret(name: "FLUTTERWAVE_SECRET_KEY" | "FLUTTERWAVE_SECRET_HASH"): string {
  const value = process.env[name]?.trim()
  if (!value) throw new PaymentProviderError("Secure payment is not configured yet.")
  return value
}

export function assertFlutterwaveConfiguration(): void {
  requireSecret("FLUTTERWAVE_SECRET_KEY")
  requireSecret("FLUTTERWAVE_SECRET_HASH")
}

export function usdCentsToDecimal(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new PaymentProviderError()
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`
}

function decimalToCents(value: unknown): number | null {
  const match = String(value).match(/^(\d+)(?:\.(\d{1,2}))?$/)
  if (!match) return null
  const cents = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"))
  return Number.isSafeInteger(cents) ? cents : null
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    throw new PaymentProviderError()
  }
}

export async function initializeFlutterwavePayment(
  input: {
    orderId: string
    amountCents: number
    customer: { email: string; name: string; phone: string }
    callbackUrl: string
  },
  fetcher: Fetcher = fetch
): Promise<{ authorizationUrl: string; paymentReference: string }> {
  assertFlutterwaveConfiguration()
  const secretKey = requireSecret("FLUTTERWAVE_SECRET_KEY")
  const response = await fetcher(`${FLUTTERWAVE_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: input.orderId,
      amount: usdCentsToDecimal(input.amountCents),
      currency: "USD",
      redirect_url: input.callbackUrl,
      payment_options: "card",
      customer: {
        email: input.customer.email,
        name: input.customer.name,
        phonenumber: input.customer.phone,
      },
      customizations: {
        title: "Compfi",
        description: `Payment for order ${input.orderId}`,
      },
      meta: { order_id: input.orderId },
    }),
  })
  const payload = (await readJson(response)) as {
    status?: string
    data?: { link?: string }
  }
  const authorizationUrl = payload.data?.link ?? ""
  if (!response.ok || payload.status !== "success" || !isFlutterwaveCheckoutUrl(authorizationUrl)) {
    throw new PaymentProviderError()
  }
  return { authorizationUrl, paymentReference: input.orderId }
}

export type VerifiedFlutterwaveTransaction = {
  transactionId: string
  paymentReference: string
}

export type InspectedFlutterwaveTransaction = VerifiedFlutterwaveTransaction & {
  status: "successful" | "failed" | "canceled" | "pending"
}

function normalizeTransactionStatus(value: string | undefined): InspectedFlutterwaveTransaction["status"] {
  if (value === "successful") return "successful"
  if (value === "failed") return "failed"
  if (value === "cancelled" || value === "canceled") return "canceled"
  return "pending"
}

export async function inspectFlutterwaveTransaction(
  input: {
    transactionId: string
    paymentReference: string
    amountCents: number
  },
  fetcher: Fetcher = fetch
): Promise<InspectedFlutterwaveTransaction> {
  const secretKey = requireSecret("FLUTTERWAVE_SECRET_KEY")
  if (!/^\d+$/.test(input.transactionId))
    throw new PaymentProviderError("Payment could not be verified.", "invalid")
  const response = await fetcher(
    `${FLUTTERWAVE_API}/transactions/${encodeURIComponent(input.transactionId)}/verify`,
    { headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store" }
  )
  const payload = (await readJson(response)) as {
    status?: string
    data?: {
      id?: number | string
      status?: string
      tx_ref?: string
      currency?: string
      amount?: unknown
    }
  }
  const data = payload.data
  if (!response.ok) {
    throw new PaymentProviderError(
      "Payment could not be verified.",
      response.status >= 500 ? "unavailable" : "invalid"
    )
  }
  if (
    payload.status !== "success" ||
    !data ||
    data.tx_ref !== input.paymentReference ||
    data.currency !== "USD" ||
    decimalToCents(data.amount) !== input.amountCents
  ) {
    throw new PaymentProviderError("Payment could not be verified.", "invalid")
  }
  return {
    transactionId: String(data.id ?? input.transactionId),
    paymentReference: data.tx_ref,
    status: normalizeTransactionStatus(data.status),
  }
}

export async function verifyFlutterwaveTransaction(
  input: {
    transactionId: string
    paymentReference: string
    amountCents: number
  },
  fetcher: Fetcher = fetch
): Promise<VerifiedFlutterwaveTransaction> {
  const transaction = await inspectFlutterwaveTransaction(input, fetcher)
  if (transaction.status !== "successful") {
    throw new PaymentProviderError("Payment could not be verified.", "invalid")
  }
  return {
    transactionId: transaction.transactionId,
    paymentReference: transaction.paymentReference,
  }
}

function constantTimeEqual(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)
  return (
    actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
  )
}

export function verifyFlutterwaveSignature(
  rawBody: string,
  signature: string | null,
  verificationHash: string | null = null
): boolean {
  const secretHash = requireSecret("FLUTTERWAVE_SECRET_HASH")
  if (signature) {
    const expected = createHmac("sha256", secretHash).update(rawBody).digest("base64")
    return constantTimeEqual(signature, expected)
  }
  return verificationHash ? constantTimeEqual(verificationHash, secretHash) : false
}
