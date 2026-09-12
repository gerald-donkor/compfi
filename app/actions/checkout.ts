"use server"

import { auth } from "@clerk/nextjs/server"
import { randomUUID } from "node:crypto"

import { createPendingOrder, markOrderPaymentState } from "@/db/orders"
import { type ShippingAddress } from "@/db/schema"
import { isLikelyAutomatedSubmission, type PublicSubmissionGuard } from "@/lib/abuse"
import { catalogProducts } from "@/lib/catalog"
import {
  calculateShippingCents,
  reviewCheckoutDetails,
  type CheckoutDetails,
  type CheckoutErrors,
} from "@/lib/checkout"
import { initializeFlutterwavePayment } from "@/lib/payments/flutterwave"
import { siteUrl } from "@/lib/site"

export type CartLineSubmission = {
  slug: string
  quantity: number
  size?: string
  finish?: string
}

export type PlaceOrderItem = {
  id: string
  productSlug: string
  productTitle: string
  size?: string
  finish?: string
  quantity: number
  unitPriceCents: number
  totalPriceCents: number
  imageSrc: string
}

export type PlaceOrderResult =
  | {
      success: true
      orderId: string
      authorizationUrl: string
    }
  | {
      success: false
      errors?: CheckoutErrors
      message?: string
    }

export async function placeOrderAction(
  details: CheckoutDetails,
  cartLines: readonly CartLineSubmission[],
  submissionGuard?: PublicSubmissionGuard
): Promise<PlaceOrderResult> {
  if (isLikelyAutomatedSubmission(submissionGuard)) {
    return { success: false, message: "We could not process this request. Please try again." }
  }
  // 1. Validate billing details
  const validationErrors = reviewCheckoutDetails(details)
  if (Object.keys(validationErrors).length > 0) {
    return {
      success: false,
      errors: validationErrors,
      message: "Please correct the errors in your billing details.",
    }
  }

  // 2. Validate cart items
  if (!cartLines || cartLines.length === 0) {
    return {
      success: false,
      message: "Your cart is empty. Add items to your cart before checking out.",
    }
  }

  // 3. Authoritative server pricing and items calculation
  let subtotalCents = 0
  const processedItems: PlaceOrderItem[] = []

  for (const line of cartLines) {
    const product = catalogProducts.find((p) => p.slug === line.slug)
    if (!product) {
      return {
        success: false,
        message: `Product "${line.slug}" is no longer available in the catalog.`,
      }
    }

    if (line.size && !product.sizes?.some((s) => s.value === line.size)) {
      return {
        success: false,
        message: `Option size "${line.size}" is not valid for ${product.name}.`,
      }
    }
    if (line.finish && !product.finishes?.some((f) => f.value === line.finish)) {
      return {
        success: false,
        message: `Option finish "${line.finish}" is not valid for ${product.name}.`,
      }
    }

    if (
      typeof line.quantity !== "number" ||
      !Number.isFinite(line.quantity) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 10
    ) {
      return {
        success: false,
        message: `Quantity for "${product.name}" must be an integer between 1 and 10.`,
      }
    }
    const quantity = line.quantity
    const unitPriceCents = product.priceCents
    const totalPriceCents = unitPriceCents * quantity
    subtotalCents += totalPriceCents

    const sizeLabel = line.size
      ? (product.sizes?.find((s) => s.value === line.size)?.label ?? line.size)
      : undefined
    const finishLabel = line.finish
      ? (product.finishes?.find((f) => f.value === line.finish)?.label ?? line.finish)
      : undefined

    processedItems.push({
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      productSlug: product.slug,
      productTitle: product.name,
      size: sizeLabel,
      finish: finishLabel,
      quantity,
      unitPriceCents,
      totalPriceCents,
      imageSrc: product.gallery[0]?.path ?? product.media.path,
    })
  }

  const shippingCents = calculateShippingCents(subtotalCents)
  const totalCents = subtotalCents + shippingCents

  // 4. Authenticate caller (optional Clerk user ID)
  let authUserId: string | null = null
  try {
    const authData = await auth()
    if (authData.isAuthenticated && authData.userId) {
      authUserId = authData.userId
    }
  } catch {
    // Guest checkout fallback
    authUserId = null
  }

  // 5. Persist an unpaid order before asking the provider for a hosted checkout.
  const orderId = `ORD-${randomUUID().toUpperCase()}`
  const createdAt = Date.now()

  const customerName = `${details.firstName.trim()} ${details.lastName.trim()}`
  const shippingAddressObj: ShippingAddress = {
    addressLine1: details.addressLine1.trim(),
    addressLine2: details.addressLine2?.trim() || undefined,
    city: details.city.trim(),
    state: details.state.trim(),
    zipCode: details.zipCode.trim(),
    countryRegion: details.countryRegion.trim() || "United States",
  }

  await createPendingOrder(
    {
      id: orderId,
      userId: authUserId,
      status: "pending_payment",
      customerName,
      customerEmail: details.email.trim(),
      customerPhone: details.phone.trim(),
      shippingAddress: JSON.stringify(shippingAddressObj),
      orderNotes: details.orderNotes?.trim() || null,
      subtotalCents,
      shippingCents,
      totalCents,
      paymentProvider: "flutterwave",
      paymentReference: orderId,
      paymentCurrency: "USD",
      createdAt,
    },
    processedItems.map((item) => ({
      id: item.id,
      orderId,
      productSlug: item.productSlug,
      productTitle: item.productTitle,
      size: item.size || null,
      finish: item.finish || null,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      totalPriceCents: item.totalPriceCents,
      imageSrc: item.imageSrc,
    }))
  )

  try {
    const payment = await initializeFlutterwavePayment({
      orderId,
      amountCents: totalCents,
      customer: {
        email: details.email.trim(),
        name: customerName,
        phone: details.phone.trim(),
      },
      callbackUrl: new URL("/checkout/complete", siteUrl).toString(),
    })
    return {
      success: true,
      orderId,
      authorizationUrl: payment.authorizationUrl,
    }
  } catch {
    await markOrderPaymentState(orderId, "payment_failed")
    return {
      success: false,
      message: "Secure payment is unavailable right now. Your cart is unchanged; please try again.",
    }
  }
}
