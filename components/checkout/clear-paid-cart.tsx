"use client"

import * as React from "react"

import { useCart } from "@/components/cart/cart-provider"

export function ClearPaidCart() {
  const { clearCart } = useCart()
  React.useEffect(() => clearCart(), [clearCart])
  return null
}
