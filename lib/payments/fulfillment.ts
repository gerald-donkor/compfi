import "server-only"

import {
  getOrderByPaymentReference,
  markOrderPaid,
  markOrderPaymentState,
  recordOrderReceipt,
  type OrderWithItems,
} from "@/db/orders"
import { orderReceiptMessage } from "@/lib/email/messages"
import { sendTransactionalEmail } from "@/lib/email/resend"
import { inspectFlutterwaveTransaction, PaymentProviderError } from "./flutterwave"

export type ReconciliationResult =
  | { status: "paid"; order: OrderWithItems }
  | { status: "invalid" | "pending" | "failed" | "canceled"; order: OrderWithItems | null }

export async function reconcileFlutterwavePayment(input: {
  transactionId: string
  paymentReference: string
  eventId?: string
  eventType?: string
}): Promise<ReconciliationResult> {
  const existingOrder = await getOrderByPaymentReference(input.paymentReference)
  if (!existingOrder) return { status: "invalid", order: null }

  let verified
  try {
    verified = await inspectFlutterwaveTransaction({
      transactionId: input.transactionId,
      paymentReference: input.paymentReference,
      amountCents: existingOrder.totalCents,
    })
  } catch (error) {
    return {
      status: error instanceof PaymentProviderError && error.code === "invalid" ? "invalid" : "pending",
      order: existingOrder,
    }
  }

  if (verified.status === "failed" || verified.status === "canceled") {
    try {
      const status = verified.status === "canceled" ? "payment_canceled" : "payment_failed"
      await markOrderPaymentState(existingOrder.id, status)
      return {
        status: verified.status,
        order: await getOrderByPaymentReference(input.paymentReference),
      }
    } catch {
      return { status: "pending", order: existingOrder }
    }
  }
  if (verified.status !== "successful") return { status: "pending", order: existingOrder }

  try {
    const result = await markOrderPaid({
      orderId: existingOrder.id,
      transactionId: verified.transactionId,
      eventId: input.eventId,
      eventType: input.eventType,
    })
    if (!result.order) return { status: "invalid", order: null }

    if (!result.transitioned && result.order.receiptStatus === "sent") {
      return { status: "paid", order: result.order }
    }

    let delivery: "sent" | "failed" = "failed"
    try {
      delivery = await sendTransactionalEmail({
        to: result.order.customerEmail,
        message: orderReceiptMessage(result.order),
        idempotencyKey: `order-paid/${result.order.id}`,
      })
    } catch {
      delivery = "failed"
    }
    try {
      await recordOrderReceipt(result.order.id, delivery)
      const refreshed = await getOrderByPaymentReference(input.paymentReference)
      if (refreshed) return { status: "paid", order: refreshed }
    } catch {
      // A receipt-state write must never downgrade an already verified payment.
    }
    return { status: "paid", order: result.order }
  } catch {
    return { status: "pending", order: existingOrder }
  }
}
