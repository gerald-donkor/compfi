import { CheckCircle2Icon, CircleAlertIcon, Clock3Icon } from "lucide-react"

import { ClearPaidCart } from "@/components/checkout/clear-paid-cart"
import { Money } from "@/components/commerce/money"
import { Container } from "@/components/layout/container"
import { Link } from "@/components/ui/link"
import type { OrderWithItems } from "@/db/orders"

export type PaymentResultProps = {
  status: "paid" | "pending" | "canceled" | "failed" | "invalid"
  order: OrderWithItems | null
}

const COPY = {
  pending: [
    "Payment is still processing",
    "We could not confirm the payment yet. Keep your cart and check again shortly.",
  ],
  canceled: [
    "Payment canceled",
    "No payment was confirmed. Your cart is still available if you want to try again.",
  ],
  failed: [
    "Payment was not completed",
    "No payment was confirmed. Return to checkout when you are ready to try again.",
  ],
  invalid: [
    "We could not verify this payment",
    "The payment details in this link are incomplete or do not match an order.",
  ],
} as const

export function PaymentResult({ status, order }: PaymentResultProps) {
  const paid = status === "paid" && order
  const [title, description] = paid
    ? ["Payment confirmed", "Your Compfi order is paid and securely recorded."]
    : COPY[status === "paid" ? "invalid" : status]
  const Icon = paid ? CheckCircle2Icon : status === "pending" ? Clock3Icon : CircleAlertIcon

  return (
    <Container className="py-16">
      {paid ? <ClearPaidCart /> : null}
      <section
        aria-labelledby="payment-result-heading"
        data-slot="payment-result"
        className="mx-auto max-w-2xl rounded-2xl border border-compfi-border bg-card p-6 text-center shadow-xs md:p-10"
      >
        <Icon aria-hidden="true" className="mx-auto mb-4 size-12 text-compfi-brand" />
        <h1 id="payment-result-heading" className="type-heading-lg text-balance text-compfi-ink">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-xl type-body text-muted-foreground">{description}</p>
        {order ? (
          <dl className="mx-auto mt-6 grid max-w-md gap-3 rounded-xl bg-compfi-wash p-4 text-left type-body-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Order reference</dt>
              <dd className="break-all font-semibold">{order.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-semibold">
                <Money amountCents={order.totalCents} />
              </dd>
            </div>
          </dl>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {paid ? (
            <Link href="/shop" variant="primary">
              Continue shopping
            </Link>
          ) : (
            <Link href="/checkout" variant="primary">
              Return to checkout
            </Link>
          )}
          <Link href="/contact" variant="muted">
            Contact Compfi
          </Link>
        </div>
      </section>
    </Container>
  )
}
