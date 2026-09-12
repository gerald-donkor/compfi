import type { Metadata } from "next"

import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { PaymentResult, type PaymentResultProps } from "@/components/checkout/payment-result"
import { getOrderByPaymentReference } from "@/db/orders"
import { reconcileFlutterwavePayment } from "@/lib/payments/fulfillment"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Payment result",
  robots: { index: false, follow: false },
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function readScalarParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : ""
}

export default async function PaymentCompletePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = await searchParams
  const paymentReference = readScalarParam(query.tx_ref)
  const transactionId = readScalarParam(query.transaction_id)
  let result: PaymentResultProps = { status: "invalid", order: null }

  if (paymentReference && transactionId) {
    result = await reconcileFlutterwavePayment({
      transactionId,
      paymentReference,
    })
  } else if (paymentReference) {
    const order = await getOrderByPaymentReference(paymentReference)
    result = { status: "pending", order }
  }

  return (
    <main id="main-content">
      <PaymentResult {...result} />
      <BenefitsStrip />
    </main>
  )
}
