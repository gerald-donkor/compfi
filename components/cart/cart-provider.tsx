"use client"

import * as React from "react"

import { addCartLine, cartItemCount, cartSubtotalCents, createCartLine, removeCartLine, setCartLineQuantity, type CartLine, type CartSelection, type CartState } from "@/lib/cart"
import { catalogProducts, getCatalogProductBySlug } from "@/lib/catalog"
import type { CatalogProduct } from "@/types/commerce"

type CartContextValue = {
  readonly lines: CartState
  readonly itemCount: number
  readonly subtotalCents: number
  readonly liveMessage: string
  add: (product: CatalogProduct, selection: Omit<CartSelection, "slug">, quantity: number) => void
  setQuantity: (selection: CartSelection, quantity: number) => void
  remove: (selection: CartSelection) => void
  productFor: (line: CartLine) => CatalogProduct | undefined
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartState>([])
  const [liveMessage, setLiveMessage] = React.useState("")

  const add = React.useCallback((product: CatalogProduct, selection: Omit<CartSelection, "slug">, quantity: number) => {
    const canonicalProduct = getCatalogProductBySlug(product.slug)
    if (!canonicalProduct) return
    const line = createCartLine(canonicalProduct, selection, quantity)
    if (!line) return
    setLiveMessage(`${canonicalProduct.name} added to cart.`)
    setLines((current) => {
      return addCartLine(current, line)
    })
  }, [])

  const setQuantity = React.useCallback((selection: CartSelection, quantity: number) => {
    const product = getCatalogProductBySlug(selection.slug)
    setLiveMessage(`${product?.name ?? "Item"} quantity updated.`)
    setLines((current) => {
      return setCartLineQuantity(current, selection, quantity)
    })
  }, [])

  const remove = React.useCallback((selection: CartSelection) => {
    const product = getCatalogProductBySlug(selection.slug)
    setLiveMessage(`${product?.name ?? "Item"} removed from cart.`)
    setLines((current) => {
      return removeCartLine(current, selection)
    })
  }, [])

  const value = React.useMemo<CartContextValue>(() => ({
    lines,
    itemCount: cartItemCount(lines),
    subtotalCents: cartSubtotalCents(lines, catalogProducts),
    liveMessage,
    add,
    setQuantity,
    remove,
    productFor: (line) => getCatalogProductBySlug(line.slug),
  }), [add, lines, liveMessage, remove, setQuantity])

  return <CartContext.Provider value={value}>{children}<p className="sr-only" aria-live="polite">{liveMessage}</p></CartContext.Provider>
}

export function useCart(): CartContextValue {
  const cart = useOptionalCart()
  if (!cart) throw new Error("useCart must be used within CartProvider")
  return cart
}

export function useOptionalCart(): CartContextValue | null {
  return React.useContext(CartContext)
}
