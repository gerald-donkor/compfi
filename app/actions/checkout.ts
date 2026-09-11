"use server"

import { auth } from "@clerk/nextjs/server"
import { db, ensureDbSchema } from "@/db"
import { orders, orderItems, type ShippingAddress } from "@/db/schema"
import { catalogProducts } from "@/lib/catalog"
import {
  reviewCheckoutDetails,
  type CheckoutDetails,
  type CheckoutErrors,
} from "@/lib/checkout"

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
      subtotalCents: number
      shippingCents: number
      totalCents: number
      createdAt: number
      itemCount: number
      customerName: string
      customerEmail: string
      shippingAddress: ShippingAddress
      items: PlaceOrderItem[]
    }
  | {
      success: false
      errors?: CheckoutErrors
      message?: string
    }

const FREE_SHIPPING_THRESHOLD_CENTS = 50000 // $500
const STANDARD_SHIPPING_CENTS = 2500 // $25

export async function placeOrderAction(
  details: CheckoutDetails,
  cartLines: readonly CartLineSubmission[]
): Promise<PlaceOrderResult> {
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

    const quantity = Math.max(1, Math.min(10, Math.floor(line.quantity || 1)))
    const unitPriceCents = product.priceCents
    const totalPriceCents = unitPriceCents * quantity
    subtotalCents += totalPriceCents

    const sizeLabel = line.size
      ? product.sizes?.find((s) => s.value === line.size)?.label ?? line.size
      : undefined
    const finishLabel = line.finish
      ? product.finishes?.find((f) => f.value === line.finish)?.label ?? line.finish
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

  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : STANDARD_SHIPPING_CENTS
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

  // 5. Database persistence
  await ensureDbSchema()

  const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random()
    .toString(36)
    .toUpperCase()
    .slice(2, 6)}`
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

  await db.transaction(async (tx) => {
    await tx.insert(orders).values({
      id: orderId,
      userId: authUserId,
      status: "confirmed",
      customerName,
      customerEmail: details.email.trim(),
      customerPhone: details.phone.trim(),
      shippingAddress: JSON.stringify(shippingAddressObj),
      orderNotes: details.orderNotes?.trim() || null,
      subtotalCents,
      shippingCents,
      totalCents,
      createdAt,
    })

    for (const item of processedItems) {
      await tx.insert(orderItems).values({
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
      })
    }
  })

  return {
    success: true,
    orderId,
    subtotalCents,
    shippingCents,
    totalCents,
    createdAt,
    itemCount: processedItems.reduce((acc, i) => acc + i.quantity, 0),
    customerName,
    customerEmail: details.email.trim(),
    shippingAddress: shippingAddressObj,
    items: processedItems,
  }
}
