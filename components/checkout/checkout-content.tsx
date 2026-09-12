"use client"

import * as React from "react"
import { ShoppingCartIcon } from "lucide-react"

import { placeOrderAction } from "@/app/actions/checkout"
import { useCart } from "@/components/cart/cart-provider"
import { Money } from "@/components/commerce/money"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
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
  calculateShippingCents,
  reviewCheckoutDetails,
  type CheckoutDetails,
  type CheckoutErrors,
  type CheckoutFieldName,
} from "@/lib/checkout"
import { formatMoney } from "@/lib/money"
import { assignHostedCheckout } from "@/lib/payments/checkout-navigation"
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
  return (
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel htmlFor={id}>{FIELD_LABELS[name]}</FieldLabel>
      <Input
        {...props}
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="checkout-field-control"
      />
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
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
  const shippingCents = calculateShippingCents(subtotalCents)
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
          return (
            <li key={cartLineKey(line)} className="checkout-summary-line">
              <div className="min-w-0 break-words">
                <span className="font-medium">{product.name}</span>
                <span className="ml-2 whitespace-nowrap">× {line.quantity}</span>
                {details ? <p className="type-body-sm text-muted-foreground">{details}</p> : null}
              </div>
              <Money
                amountCents={product.priceCents * line.quantity}
                className="text-right tabular-nums font-medium"
              />
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
          {shippingCents === 0 ? "Free" : formatMoney(shippingCents)}
        </span>
      </div>
      <Separator className="checkout-summary-separator" />
      <div className="checkout-summary-total">
        <span className="type-heading-sm">Total</span>
        <Money
          amountCents={subtotalCents + shippingCents}
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
          <h2 ref={headingRef} tabIndex={-1} className="type-heading-lg focus-visible:outline-none">
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

function detailsFrom(form: HTMLFormElement): CheckoutDetails {
  const formData = new FormData(form)
  return Object.freeze(
    Object.fromEntries(
      CHECKOUT_FIELD_NAMES.map((name) => [name, String(formData.get(name) ?? "")])
    ) as Record<CheckoutFieldName, string>
  )
}

function isCheckoutFieldName(value: string): value is CheckoutFieldName {
  return CHECKOUT_FIELD_NAMES.some((name) => name === value)
}

export function CheckoutContent() {
  const { lines } = useCart()
  const [errors, setErrors] = React.useState<CheckoutErrors>({})
  const [status, setStatus] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const previouslyPopulated = React.useRef(lines.length > 0)
  const emptyHeadingRef = React.useRef<HTMLHeadingElement>(null)
  const errorSummaryRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!lines.length && previouslyPopulated.current && !document.querySelector("[role='dialog']"))
      emptyHeadingRef.current?.focus()
    previouslyPopulated.current = lines.length > 0
  }, [lines.length])

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
      const result = await placeOrderAction(
        details,
        lines.map(({ slug, quantity, size, finish }) => ({
          slug,
          quantity,
          size,
          finish,
        }))
      )
      if (!result.success) {
        if (result.errors) {
          setErrors(result.errors)
          requestAnimationFrame(() => errorSummaryRef.current?.focus())
        } else setStatus(result.message ?? "Secure payment is unavailable. Please try again.")
        return
      }
      assignHostedCheckout(result.authorizationUrl)
    } catch {
      setStatus("Secure payment could not be opened. Your cart is unchanged; please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    setStatus("")
    const target = event.target
    if (
      !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) ||
      !isCheckoutFieldName(target.name) ||
      !errors[target.name]
    )
      return
    const name = target.name
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return Object.freeze(next)
    })
  }

  const field = (
    name: CheckoutFieldName,
    props: Omit<CheckoutInputFieldProps, "name" | "error"> = {}
  ) => (
    <CheckoutInputField
      name={name}
      error={errors[name]}
      maxLength={CHECKOUT_MAX_LENGTHS[name]}
      {...props}
    />
  )

  return (
    <Container className="checkout-content">
      <form
        aria-label="Checkout details and payment"
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
                {CHECKOUT_FIELD_NAMES.flatMap((name) =>
                  errors[name]
                    ? [
                        <li key={name}>
                          <a href={`#checkout-${name}`}>
                            {FIELD_LABELS[name]}: {errors[name]}
                          </a>
                        </li>,
                      ]
                    : []
                )}
              </ul>
            </div>
          ) : null}
          <FieldGroup className="checkout-field-group">
            <div className="checkout-name-fields">
              {field("firstName", {
                required: true,
                autoComplete: "given-name",
              })}
              {field("lastName", {
                required: true,
                autoComplete: "family-name",
              })}
            </div>
            {field("company", { autoComplete: "organization" })}
            {field("countryRegion", {
              readOnly: true,
              defaultValue: "United States",
              autoComplete: "country-name",
            })}
            {field("addressLine1", {
              required: true,
              autoComplete: "address-line1",
            })}
            {field("addressLine2", { autoComplete: "address-line2" })}
            {field("city", { required: true, autoComplete: "address-level2" })}
            {field("state", { required: true, autoComplete: "address-level1" })}
            {field("zipCode", {
              required: true,
              inputMode: "numeric",
              autoComplete: "postal-code",
            })}
            {field("phone", {
              required: true,
              type: "tel",
              inputMode: "tel",
              autoComplete: "tel",
            })}
            {field("email", {
              required: true,
              type: "email",
              inputMode: "email",
              autoComplete: "email",
              spellCheck: false,
            })}
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
              <p className="type-body font-medium text-compfi-ink">Secure online payment</p>
              <p className="mt-1 type-body-sm text-muted-foreground">
                Continue to <span translate="no">Flutterwave</span>’s hosted checkout. Your card
                details are entered there and are never handled or stored by{" "}
                <span translate="no">Compfi</span>.
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
            {isSubmitting ? "Opening secure payment…" : "Continue to secure payment"}
          </Button>
          <p aria-live="polite" aria-atomic="true" className="type-body-sm font-medium">
            {status}
          </p>
        </div>
      </form>
    </Container>
  )
}
