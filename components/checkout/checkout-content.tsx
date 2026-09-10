"use client"

import * as React from "react"
import { ShoppingCartIcon } from "lucide-react"

import { useCart } from "@/components/cart/cart-provider"
import { Money } from "@/components/commerce/money"
import { Container } from "@/components/layout/container"
import { Button, buttonVariants } from "@/components/ui/button"
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
import type { CatalogProduct } from "@/types/commerce"

const SUCCESS_MESSAGE = "Details checked. No order was placed and no payment was processed."

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
        <h2 id="checkout-summary-heading" className="type-heading-md">Product</h2>
        <span className="type-heading-md">Subtotal</span>
      </div>
      <ul className="checkout-summary-lines">
        {lines.map((line) => {
          const product = productFor(line)
          if (!product) return null
          const configuredSelection = selectionLabel(line, product)

          return (
            <li key={cartLineKey(line)} className="checkout-summary-line">
              <div className="min-w-0 break-words">
                <span className="font-medium">{product.name}</span>
                <span className="ml-2 whitespace-nowrap">× {line.quantity}</span>
                {configuredSelection ? (
                  <p className="type-body-sm text-muted-foreground">{configuredSelection}</p>
                ) : null}
              </div>
              <Money amountCents={product.priceCents * line.quantity} className="text-right tabular-nums" />
            </li>
          )
        })}
      </ul>
      <Separator />
      <div className="checkout-summary-subtotal">
        <span className="font-medium">Subtotal</span>
        <Money amountCents={subtotalCents} className="type-heading-sm text-primary tabular-nums" />
      </div>
      <p className="type-body-sm text-muted-foreground">
        This display subtotal is for review only. No order or payment is submitted in this preview.
      </p>
    </section>
  )
}

function CheckoutEmpty({ headingRef }: { headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <Container className="py-16 sm:py-24">
      <Empty className="border-compfi-border bg-background py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon"><ShoppingCartIcon aria-hidden="true" /></EmptyMedia>
          <h2 ref={headingRef} id="checkout-empty-heading" tabIndex={-1} className="type-heading-sm">
            Your cart is empty
          </h2>
          <EmptyDescription>Add furniture to your cart before reviewing checkout details.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/shop" className={`${buttonVariants({ variant: "default", size: "default" })} checkout-empty-action`}>
            Browse furniture
          </Link>
        </EmptyContent>
      </Empty>
    </Container>
  )
}

function detailsFrom(form: HTMLFormElement): CheckoutDetails {
  const formData = new FormData(form)
  return Object.freeze(Object.fromEntries(
    CHECKOUT_FIELD_NAMES.map((fieldName) => [fieldName, String(formData.get(fieldName) ?? "")])
  ) as Record<CheckoutFieldName, string>)
}

function isCheckoutFieldName(value: string): value is CheckoutFieldName {
  return CHECKOUT_FIELD_NAMES.some((fieldName) => fieldName === value)
}

export function CheckoutContent() {
  const { lines } = useCart()
  const [errors, setErrors] = React.useState<CheckoutErrors>({})
  const [status, setStatus] = React.useState("")
  const errorSummaryRef = React.useRef<HTMLDivElement>(null)
  const emptyHeadingRef = React.useRef<HTMLHeadingElement>(null)
  const previouslyPopulated = React.useRef(false)

  React.useEffect(() => {
    if (!lines.length && previouslyPopulated.current) {
      const activeModal = document.querySelector("[role='dialog']")
      if (!activeModal) emptyHeadingRef.current?.focus()
    }
    previouslyPopulated.current = lines.length > 0
  }, [lines.length])

  if (!lines.length) return <CheckoutEmpty headingRef={emptyHeadingRef} />

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = reviewCheckoutDetails(detailsFrom(event.currentTarget))
    setStatus("")
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    setStatus(SUCCESS_MESSAGE)
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
        aria-label="Checkout details review"
        className="checkout-layout"
        noValidate
        onSubmit={handleSubmit}
        onChange={handleChange}
      >
        <FieldSet className="checkout-billing">
          <FieldLegend className="type-heading-lg">Billing details</FieldLegend>
          {Object.keys(errors).length ? (
            <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="checkout-error-summary">
              <h2 className="font-semibold">Check the highlighted details</h2>
              <ul className="mt-2 list-disc pl-5">
                {CHECKOUT_FIELD_NAMES.flatMap((fieldName) => errors[fieldName] ? [
                  <li key={fieldName}>
                    <a href={`#checkout-${fieldName}`}>{FIELD_LABELS[fieldName]}: {errors[fieldName]}</a>
                  </li>,
                ] : [])}
              </ul>
            </div>
          ) : null}
          <FieldGroup className="checkout-field-group">
            <div className="checkout-name-fields">
              <CheckoutInputField name="firstName" error={errors.firstName} required maxLength={CHECKOUT_MAX_LENGTHS.firstName} autoComplete="given-name" />
              <CheckoutInputField name="lastName" error={errors.lastName} required maxLength={CHECKOUT_MAX_LENGTHS.lastName} autoComplete="family-name" />
            </div>
            <CheckoutInputField name="company" error={errors.company} maxLength={CHECKOUT_MAX_LENGTHS.company} autoComplete="organization" />
            <CheckoutInputField name="countryRegion" error={errors.countryRegion} readOnly defaultValue="United States" maxLength={CHECKOUT_MAX_LENGTHS.countryRegion} autoComplete="country-name" />
            <CheckoutInputField name="addressLine1" error={errors.addressLine1} required maxLength={CHECKOUT_MAX_LENGTHS.addressLine1} autoComplete="address-line1" />
            <CheckoutInputField name="addressLine2" error={errors.addressLine2} maxLength={CHECKOUT_MAX_LENGTHS.addressLine2} autoComplete="address-line2" />
            <CheckoutInputField name="city" error={errors.city} required maxLength={CHECKOUT_MAX_LENGTHS.city} autoComplete="address-level2" />
            <CheckoutInputField name="state" error={errors.state} required maxLength={CHECKOUT_MAX_LENGTHS.state} autoComplete="address-level1" />
            <CheckoutInputField name="zipCode" error={errors.zipCode} required maxLength={CHECKOUT_MAX_LENGTHS.zipCode} inputMode="numeric" autoComplete="postal-code" />
            <CheckoutInputField name="phone" error={errors.phone} required type="tel" maxLength={CHECKOUT_MAX_LENGTHS.phone} inputMode="tel" autoComplete="tel" />
            <CheckoutInputField name="email" error={errors.email} required type="email" maxLength={CHECKOUT_MAX_LENGTHS.email} inputMode="email" autoComplete="email" spellCheck={false} />
            <Field data-invalid={errors.orderNotes ? "true" : undefined}>
              <FieldLabel htmlFor="checkout-orderNotes">{FIELD_LABELS.orderNotes}</FieldLabel>
              <Textarea
                id="checkout-orderNotes"
                name="orderNotes"
                maxLength={CHECKOUT_MAX_LENGTHS.orderNotes}
                autoComplete="off"
                placeholder="Share context for this review…"
                aria-invalid={Boolean(errors.orderNotes)}
                aria-describedby={errors.orderNotes ? "checkout-orderNotes-description checkout-orderNotes-error" : "checkout-orderNotes-description"}
              />
              <FieldDescription id="checkout-orderNotes-description">Notes are reviewed locally and are not sent or saved.</FieldDescription>
              {errors.orderNotes ? <FieldError id="checkout-orderNotes-error">{errors.orderNotes}</FieldError> : null}
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="checkout-review">
          <CheckoutSummary />
          <section aria-labelledby="checkout-payment-heading" className="checkout-payment">
            <h2 id="checkout-payment-heading" className="type-heading-sm">Payment method</h2>
            <p className="mt-3 type-body text-muted-foreground">
              Payment options are not available in this preview. No payment will be submitted.
            </p>
          </section>
          <Button type="submit" variant="outline" size="lg" className="checkout-submit">
            Check details
          </Button>
          <p aria-live="polite" aria-atomic="true" className="type-body-sm font-medium">
            {status}
          </p>
        </div>
      </form>
    </Container>
  )
}
