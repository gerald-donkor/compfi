import { NextResponse } from "next/server"

import { reconcileFlutterwavePayment } from "@/lib/payments/fulfillment"
import { PaymentProviderError, verifyFlutterwaveSignature } from "@/lib/payments/flutterwave"

export async function POST(request: Request) {
  const rawBody = await request.text()
  try {
    if (
      !verifyFlutterwaveSignature(
        rawBody,
        request.headers.get("flutterwave-signature"),
        request.headers.get("verif-hash")
      )
    ) {
      return NextResponse.json({ received: false }, { status: 401 })
    }
  } catch (error) {
    if (error instanceof PaymentProviderError) {
      return NextResponse.json({ received: false }, { status: 503 })
    }
    return NextResponse.json({ received: false }, { status: 401 })
  }

  let event: {
    id?: string | number
    type?: string
    data?: { id?: string | number; tx_ref?: string }
  }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ received: false }, { status: 400 })
  }

  if (event.type !== "charge.completed") return NextResponse.json({ received: true })
  const transactionId = String(event.data?.id ?? "")
  const paymentReference = event.data?.tx_ref ?? ""
  const eventId = String(event.id ?? "")
  if (!transactionId || !paymentReference || !eventId) {
    return NextResponse.json({ received: false }, { status: 400 })
  }

  const result = await reconcileFlutterwavePayment({
    transactionId,
    paymentReference,
    eventId: `flutterwave:${eventId}`,
    eventType: event.type,
  })
  if (result.status === "pending") {
    return NextResponse.json({ received: false, reconciled: false }, { status: 503 })
  }
  return NextResponse.json({
    received: true,
    reconciled: result.status === "paid",
  })
}
