import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  getOrderByPaymentReference: vi.fn(),
  markOrderPaid: vi.fn(),
  markOrderPaymentState: vi.fn(),
  recordOrderReceipt: vi.fn(),
  inspectFlutterwaveTransaction: vi.fn(),
  sendTransactionalEmail: vi.fn(),
  orderReceiptMessage: vi.fn(() => ({ subject: "Receipt", text: "Receipt", html: "<p>Receipt</p>" })),
}))

vi.mock("@/db/orders", () => ({
  getOrderByPaymentReference: mocks.getOrderByPaymentReference,
  markOrderPaid: mocks.markOrderPaid,
  markOrderPaymentState: mocks.markOrderPaymentState,
  recordOrderReceipt: mocks.recordOrderReceipt,
}))
vi.mock("@/lib/email/messages", () => ({ orderReceiptMessage: mocks.orderReceiptMessage }))
vi.mock("@/lib/email/resend", () => ({ sendTransactionalEmail: mocks.sendTransactionalEmail }))
vi.mock("@/lib/payments/flutterwave", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/payments/flutterwave")>()
  return { ...original, inspectFlutterwaveTransaction: mocks.inspectFlutterwaveTransaction }
})

import { reconcileFlutterwavePayment } from "@/lib/payments/fulfillment"
import { PaymentProviderError } from "@/lib/payments/flutterwave"
import type { OrderWithItems } from "@/db/orders"

const order = {
  id: "ORD-123",
  userId: null,
  status: "pending_payment",
  customerName: "Avery Stone",
  customerEmail: "avery@example.com",
  customerPhone: "555-0100",
  shippingAddress: "{}",
  orderNotes: null,
  subtotalCents: 100,
  shippingCents: 0,
  totalCents: 100,
  paymentProvider: "flutterwave",
  paymentReference: "ORD-123",
  paymentTransactionId: null,
  paymentCurrency: "USD",
  paidAt: null,
  receiptStatus: null,
  receiptSentAt: null,
  createdAt: 1,
  items: [],
  parsedShippingAddress: {
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    countryRegion: "United States",
  },
} satisfies OrderWithItems

describe("payment reconciliation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getOrderByPaymentReference.mockResolvedValue(order)
    mocks.markOrderPaymentState.mockResolvedValue(undefined)
    mocks.recordOrderReceipt.mockResolvedValue(undefined)
    mocks.sendTransactionalEmail.mockResolvedValue("sent")
  })

  it("keeps a verified payment paid when receipt bookkeeping fails", async () => {
    mocks.inspectFlutterwaveTransaction.mockResolvedValue({
      transactionId: "42",
      paymentReference: order.id,
      status: "successful",
    })
    const paidOrder = { ...order, status: "paid" as const, paymentTransactionId: "42" }
    mocks.markOrderPaid.mockResolvedValue({ order: paidOrder, transitioned: true })
    mocks.sendTransactionalEmail.mockResolvedValue("failed")
    mocks.recordOrderReceipt.mockRejectedValue(new Error("temporary database failure"))

    await expect(reconcileFlutterwavePayment({
      transactionId: "42",
      paymentReference: order.id,
    })).resolves.toEqual({ status: "paid", order: paidOrder })
  })

  it("persists a provider-verified failed transaction", async () => {
    mocks.inspectFlutterwaveTransaction.mockResolvedValue({
      transactionId: "43",
      paymentReference: order.id,
      status: "failed",
    })
    const result = await reconcileFlutterwavePayment({
      transactionId: "43",
      paymentReference: order.id,
    })
    expect(mocks.markOrderPaymentState).toHaveBeenCalledWith(order.id, "payment_failed")
    expect(result.status).toBe("failed")
  })

  it("distinguishes an invalid transaction from a temporary verification failure", async () => {
    mocks.inspectFlutterwaveTransaction.mockRejectedValueOnce(
      new PaymentProviderError("Payment could not be verified.", "invalid")
    )
    await expect(reconcileFlutterwavePayment({
      transactionId: "44",
      paymentReference: order.id,
    })).resolves.toMatchObject({ status: "invalid" })

    mocks.inspectFlutterwaveTransaction.mockRejectedValueOnce(new TypeError("network unavailable"))
    await expect(reconcileFlutterwavePayment({
      transactionId: "44",
      paymentReference: order.id,
    })).resolves.toMatchObject({ status: "pending" })
  })
})
