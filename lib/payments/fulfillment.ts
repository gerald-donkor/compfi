import "server-only"

import {
  getOrderByPaymentReference,
  markOrderPaid,
  recordOrderReceipt,
  type OrderWithItems,
} from "@/db/orders"
import { orderReceiptMessage } from "@/lib/email/messages"
import { sendTransactionalEmail } from "@/lib/email/resend"
import { verifyFlutterwaveTransaction } from "./flutterwave"

export type ReconciliationResult =
  | { status: "paid"; order: OrderWithItems }
  | { status: "invalid" | "pending"; order: OrderWithItems | null }

export async function reconcileFlutterwavePayment(input: {
  transactionId: string
  paymentReference: string
  eventId?: string
  eventType?: string
}): Promise<ReconciliationResult> {
  const existingOrder = await getOrderByPaymentReference(input.paymentReference)
  if (!existingOrder) return { status: "invalid", order: null }

  try {
    const verified = await verifyFlutterwaveTransaction({
      transactionId: input.transactionId,
      paymentReference: input.paymentReference,
      amountCents: existingOrder.totalCents,
    })
    const result = await markOrderPaid({
      orderId: existingOrder.id,
      transactionId: verified.transactionId,
      eventId: input.eventId,
      eventType: input.eventType,
    })
    if (!result.order) return { status: "invalid", order: null }

    if (result.transitioned || result.order.receiptStatus !== "sent") {
      const delivery = await sendTransactionalEmail({
        to: result.order.customerEmail,
        message: orderReceiptMessage(result.order),
        idempotencyKey: `order-paid/${result.order.id}`,
      })
      await recordOrderReceipt(result.order.id, delivery)
      const refreshed = await getOrderByPaymentReference(input.paymentReference)
      if (refreshed) return { status: "paid", order: refreshed }
    }
    return { status: "paid", order: result.order }
  } catch {
    return { status: "pending", order: existingOrder }
  }
}
