"use client"

import * as React from "react"
import { CheckCircle2Icon, ShoppingCartIcon } from "lucide-react"

import { placeOrderAction } from "@/app/actions/checkout"
import { useCart } from "@/components/cart/cart-provider"
import { Money } from "@/components/commerce/money"
import { Container } from "@/components/layout/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input, type InputProps } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cartLineKey, cartLineSelectionLabel, type CartLine } from "@/lib/cart"
import {
  CHECKOUT_FIELD_NAMES,
  CHECKOUT_MAX_LENGTHS,
  reviewCheckoutDetails,
  type CheckoutDetails,
  type CheckoutErrors,
  type CheckoutFieldName,
} from "@/lib/checkout"
import { formatMoney } from "@/lib/money"
import type { CatalogProduct } from "@/types/commerce"

const FIELD_LABELS: Readonly<Record<CheckoutFieldName, string>> = Object.freeze({
  firstName: "First name",
  lastName: "Last name",
  company: "Company name (optional)",
  countryRegion: "Country/region",
  addressLine1: "Street address",
  addressLine2: "Apartment, suite, or unit (optional)",
  city: "City",
  state: "State",
  zipCode: "ZIP code",
  phone: "Phone",
  email: "Email address",
  orderNotes: "Order notes (optional)",
})

type CheckoutInputFieldProps = Omit<InputProps, "id" | "name"> & {
  name: CheckoutFieldName
  error?: string
}

function CheckoutInputField({ name, error, ...props }: CheckoutInputFieldProps) {
  const id = `checkout-${name}`
  const errorId = `${id}-error`

  return (
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel htmlFor={id}>{FIELD_LABELS[name]}</FieldLabel>
      <Input
        {...props}
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="checkout-field-control"
      />
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  )
}

function selectionLabel(line: CartLine, product: CatalogProduct): string | undefined {
  const size = product.sizes?.find((option) => option.value === line.size)?.label
  const finish = product.finishes?.find((option) => option.value === line.finish)?.label
  return cartLineSelectionLabel({ slug: line.slug, size, finish })
}

function CheckoutSummary() {
  const { lines, productFor, subtotalCents } = useCart()

  return (
    <section aria-labelledby="checkout-summary-heading">
      <div className="checkout-summary-heading">
        <h2 id="checkout-summary-heading" className="type-heading-md">
          Product
        </h2>
        <span className="type-heading-md">Subtotal</span>
      </div>
      <ul className="checkout-summary-lines">
        {lines.map((line) => {
          const product = productFor(line)
          if (!product) return null
          const details = selectionLabel(line, product)
          const lineTotalCents = product.priceCents * line.quantity

          return (
            <li key={cartLineKey(line)} className="checkout-summary-line">
              <div className="min-w-0 break-words">
                <span className="font-medium">{product.name}</span>
                <span className="ml-2 whitespace-nowrap">× {line.quantity}</span>
                {details ? (
                  <p className="type-body-sm text-muted-foreground">{details}</p>
                ) : null}
              </div>
              <Money amountCents={lineTotalCents} className="text-right tabular-nums font-medium" />
            </li>
          )
        })}
      </ul>
      <div className="checkout-summary-subtotal">
        <span className="type-body text-muted-foreground">Subtotal</span>
        <Money amountCents={subtotalCents} className="type-body font-medium" />
      </div>
      <div className="checkout-summary-subtotal">
        <span className="type-body text-muted-foreground">Shipping</span>
        <span className="type-body font-medium">
          {subtotalCents >= 50000 ? "Free" : formatMoney(2500)}
        </span>
      </div>
      <Separator className="checkout-summary-separator" />
      <div className="checkout-summary-total">
        <span className="type-heading-sm">Total</span>
        <Money
          amountCents={subtotalCents + (subtotalCents >= 50000 ? 0 : 2500)}
          className="type-heading-md text-compfi-brand"
        />
      </div>
    </section>
  )
}

function CheckoutEmpty({ headingRef }: { headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <Container className="py-16">
      <Empty className="checkout-empty">
        <EmptyMedia variant="icon">
          <ShoppingCartIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="type-heading-lg focus-visible:outline-none"
          >
            Your cart is empty
          </h2>
          <EmptyDescription>
            Add furniture to your cart before reviewing checkout details.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/shop" variant="primary">
            Browse furniture
          </Link>
        </EmptyContent>
      </Empty>
    </Container>
  )
}

type ConfirmedOrder = {
  orderId: string
  subtotalCents: number
  shippingCents: number
  totalCents: number
  createdAt: number
  itemCount: number
  customerName: string
  customerEmail: string
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    countryRegion: string
  }
}

function OrderConfirmation({ order }: { order: ConfirmedOrder }) {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-compfi-border bg-card p-6 md:p-10 shadow-xs">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-compfi-wash text-compfi-brand mb-4">
            <CheckCircle2Icon className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="type-heading-lg text-compfi-ink">Order confirmed</h2>
          <p className="mt-2 type-body text-muted-foreground">
            Thank you for shopping with Compfi. Your order has been placed and saved to our database.
          </p>
          <div className="mt-4 inline-flex items-center rounded-md bg-compfi-wash px-3 py-1.5 text-sm font-medium text-compfi-ink">
            Order reference: <span className="font-semibold ml-1.5">{order.orderId}</span>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-6 sm:grid-cols-2 text-left">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Shipping to
            </h3>
            <p className="mt-2 font-medium text-compfi-ink">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 ? (
              <p className="text-sm text-muted-foreground">{order.shippingAddress.addressLine2}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{order.customerEmail}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Order Summary
            </h3>
            <div className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({order.itemCount}):</span>
                <span className="font-medium text-compfi-ink">
                  {formatMoney(order.subtotalCents)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium text-compfi-ink">
                  {order.shippingCents === 0 ? "Free" : formatMoney(order.shippingCents)}
                </span>
              </div>
              <div className="flex justify-between border-t border-compfi-border pt-1.5 font-semibold text-compfi-brand">
                <span>Total:</span>
                <span>{formatMoney(order.totalCents)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className={cn(buttonVariants({ variant: "default" }), "min-h-11 min-w-44 justify-center")}
          >
            Continue shopping
          </Link>
          <Link
            href="/account"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 min-w-44 justify-center")}
          >
            View in account
          </Link>
        </div>
      </div>
    </Container>
  )
}

function detailsFrom(form: HTMLFormElement): CheckoutDetails {
  const formData = new FormData(form)
  return Object.freeze(
    Object.fromEntries(
      CHECKOUT_FIELD_NAMES.map((fieldName) => [fieldName, String(formData.get(fieldName) ?? "")]),
    ) as Record<CheckoutFieldName, string>,
  )
}

function isCheckoutFieldName(value: string): value is CheckoutFieldName {
  return CHECKOUT_FIELD_NAMES.some((fieldName) => fieldName === value)
}

export function CheckoutContent() {
  const { lines, clearCart } = useCart()
  const [errors, setErrors] = React.useState<CheckoutErrors>({})
  const [status, setStatus] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [confirmedOrder, setConfirmedOrder] = React.useState<ConfirmedOrder | null>(null)
  const previouslyPopulated = React.useRef(lines.length > 0)
  const emptyHeadingRef = React.useRef<HTMLHeadingElement>(null)
  const errorSummaryRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!lines.length && previouslyPopulated.current && !confirmedOrder) {
      const activeModal = document.querySelector("[role='dialog']")
      if (!activeModal) emptyHeadingRef.current?.focus()
    }
    previouslyPopulated.current = lines.length > 0
  }, [lines.length, confirmedOrder])

  if (confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} />
  }

  if (!lines.length) return <CheckoutEmpty headingRef={emptyHeadingRef} />

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const details = detailsFrom(event.currentTarget)
    const nextErrors = reviewCheckoutDetails(details)
    setStatus("")
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    setIsSubmitting(true)
    try {
      const submissionLines = lines.map((line) => ({
        slug: line.slug,
        quantity: line.quantity,
        size: line.size,
        finish: line.finish,
      }))

      const result = await placeOrderAction(details, submissionLines)
      if (!result.success) {
        if (result.errors) {
          setErrors(result.errors)
          requestAnimationFrame(() => errorSummaryRef.current?.focus())
        } else if (result.message) {
          setStatus(result.message)
        }
        return
      }

      setConfirmedOrder({
        orderId: result.orderId,
        subtotalCents: result.subtotalCents,
        shippingCents: result.shippingCents,
        totalCents: result.totalCents,
        createdAt: result.createdAt,
        itemCount: result.itemCount,
        customerName: `${details.firstName.trim()} ${details.lastName.trim()}`,
        customerEmail: details.email.trim(),
        shippingAddress: {
          addressLine1: details.addressLine1.trim(),
          addressLine2: details.addressLine2?.trim() || undefined,
          city: details.city.trim(),
          state: details.state.trim(),
          zipCode: details.zipCode.trim(),
          countryRegion: details.countryRegion.trim() || "United States",
        },
      })

      clearCart()
    } catch {
      setStatus("An unexpected error occurred while placing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    setStatus("")
    const target = event.target
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return
    if (!isCheckoutFieldName(target.name) || !errors[target.name]) return
    const fieldName = target.name
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors[fieldName]
      return Object.freeze(nextErrors)
    })
  }

  return (
    <Container className="checkout-content">
      <form
        aria-label="Checkout details and order placement"
        className="checkout-layout"
        noValidate
        onSubmit={handleSubmit}
        onChange={handleChange}
      >
        <FieldSet className="checkout-billing">
          <FieldLegend className="type-heading-lg">Billing details</FieldLegend>
          {Object.keys(errors).length ? (
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              role="alert"
              className="checkout-error-summary"
            >
              <h2 className="font-semibold">Check the highlighted details</h2>
              <ul className="mt-2 list-disc pl-5">
                {CHECKOUT_FIELD_NAMES.flatMap((fieldName) =>
                  errors[fieldName]
                    ? [
                        <li key={fieldName}>
                          <a href={`#checkout-${fieldName}`}>
                            {FIELD_LABELS[fieldName]}: {errors[fieldName]}
                          </a>
                        </li>,
                      ]
                    : [],
                )}
              </ul>
            </div>
          ) : null}
          <FieldGroup className="checkout-field-group">
            <div className="checkout-name-fields">
              <CheckoutInputField
                name="firstName"
                error={errors.firstName}
                required
                maxLength={CHECKOUT_MAX_LENGTHS.firstName}
                autoComplete="given-name"
              />
              <CheckoutInputField
                name="lastName"
                error={errors.lastName}
                required
                maxLength={CHECKOUT_MAX_LENGTHS.lastName}
                autoComplete="family-name"
              />
            </div>
            <CheckoutInputField
              name="company"
              error={errors.company}
              maxLength={CHECKOUT_MAX_LENGTHS.company}
              autoComplete="organization"
            />
            <CheckoutInputField
              name="countryRegion"
              error={errors.countryRegion}
              readOnly
              defaultValue="United States"
              maxLength={CHECKOUT_MAX_LENGTHS.countryRegion}
              autoComplete="country-name"
            />
            <CheckoutInputField
              name="addressLine1"
              error={errors.addressLine1}
              required
              maxLength={CHECKOUT_MAX_LENGTHS.addressLine1}
              autoComplete="address-line1"
            />
            <CheckoutInputField
              name="addressLine2"
              error={errors.addressLine2}
              maxLength={CHECKOUT_MAX_LENGTHS.addressLine2}
              autoComplete="address-line2"
            />
            <CheckoutInputField
              name="city"
              error={errors.city}
              required
              maxLength={CHECKOUT_MAX_LENGTHS.city}
              autoComplete="address-level2"
            />
            <CheckoutInputField
              name="state"
              error={errors.state}
              required
              maxLength={CHECKOUT_MAX_LENGTHS.state}
              autoComplete="address-level1"
            />
            <CheckoutInputField
              name="zipCode"
              error={errors.zipCode}
              required
              maxLength={CHECKOUT_MAX_LENGTHS.zipCode}
              inputMode="numeric"
              autoComplete="postal-code"
            />
            <CheckoutInputField
              name="phone"
              error={errors.phone}
              required
              type="tel"
              maxLength={CHECKOUT_MAX_LENGTHS.phone}
              inputMode="tel"
              autoComplete="tel"
            />
            <CheckoutInputField
              name="email"
              error={errors.email}
              required
              type="email"
              maxLength={CHECKOUT_MAX_LENGTHS.email}
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
            />
            <Field data-invalid={errors.orderNotes ? "true" : undefined}>
              <FieldLabel htmlFor="checkout-orderNotes">{FIELD_LABELS.orderNotes}</FieldLabel>
              <Textarea
                id="checkout-orderNotes"
                name="orderNotes"
                maxLength={CHECKOUT_MAX_LENGTHS.orderNotes}
                autoComplete="off"
                placeholder="Notes about your delivery, room access, or instructions…"
                aria-invalid={Boolean(errors.orderNotes)}
                aria-describedby={
                  errors.orderNotes
                    ? "checkout-orderNotes-description checkout-orderNotes-error"
                    : "checkout-orderNotes-description"
                }
              />
              <FieldDescription id="checkout-orderNotes-description">
                Delivery notes are recorded with your order.
              </FieldDescription>
              {errors.orderNotes ? (
                <FieldError id="checkout-orderNotes-error">{errors.orderNotes}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="checkout-review">
          <CheckoutSummary />
          <section aria-labelledby="checkout-payment-heading" className="checkout-payment">
            <h2 id="checkout-payment-heading" className="type-heading-sm">
              Payment method
            </h2>
            <div className="mt-3 rounded-lg border border-compfi-border bg-compfi-wash/50 p-4">
              <p className="type-body font-medium text-compfi-ink">Free Direct Order</p>
              <p className="mt-1 type-body-sm text-muted-foreground">
                Your order will be confirmed and saved directly. No payment card required.
              </p>
            </div>
          </section>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="checkout-submit"
          >
            {isSubmitting ? "Placing order…" : "Place order"}
          </Button>
          <p aria-live="polite" aria-atomic="true" className="type-body-sm font-medium">
            {status}
          </p>
        </div>
      </form>
    </Container>
  )
}
