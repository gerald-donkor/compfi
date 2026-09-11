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
  clear: () => void
  clearCart: () => void
  productFor: (line: CartLine) => CatalogProduct | undefined
}

const CartContext = React.createContext<CartContextValue | null>(null)

const CART_STORAGE_KEY = "compfi_cart_v1"
const EMPTY_CART: CartState = []

const cartListeners = new Set<() => void>()
let memoryCart: CartState = EMPTY_CART
let isInitialized = false

function getCartSnapshot(): CartState {
  if (typeof window === "undefined") return EMPTY_CART
  if (!isInitialized) {
    isInitialized = true
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          memoryCart = parsed
        }
      }
    } catch {
      // ignore storage errors
    }
  }
  return memoryCart
}

function updateCartSnapshot(next: CartState) {
  memoryCart = next
  try {
    if (typeof window !== "undefined") {
      if (next.length === 0) {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      } else {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next))
      }
    }
  } catch {
    // ignore storage errors
  }
  cartListeners.forEach((listener) => listener())
}

function subscribeCart(listener: () => void) {
  cartListeners.add(listener)
  return () => {
    cartListeners.delete(listener)
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = React.useSyncExternalStore(subscribeCart, getCartSnapshot, () => EMPTY_CART)
  const [liveMessage, setLiveMessage] = React.useState("")

  const add = React.useCallback((product: CatalogProduct, selection: Omit<CartSelection, "slug">, quantity: number) => {
    const canonicalProduct = getCatalogProductBySlug(product.slug)
    if (!canonicalProduct) return
    const line = createCartLine(canonicalProduct, selection, quantity)
    if (!line) return
    const next = addCartLine(memoryCart, line)
    updateCartSnapshot(next)
    const resultingLine = next.find((candidate) => candidate.slug === line.slug && candidate.size === line.size && candidate.finish === line.finish)
    setLiveMessage(`${canonicalProduct.name} added to cart. Quantity ${resultingLine?.quantity ?? line.quantity}.`)
  }, [])

  const setQuantity = React.useCallback((selection: CartSelection, quantity: number) => {
    const product = getCatalogProductBySlug(selection.slug)
    setLiveMessage(`${product?.name ?? "Item"} quantity updated.`)
    const next = setCartLineQuantity(memoryCart, selection, quantity)
    updateCartSnapshot(next)
  }, [])

  const remove = React.useCallback((selection: CartSelection) => {
    const product = getCatalogProductBySlug(selection.slug)
    setLiveMessage(`${product?.name ?? "Item"} removed from cart.`)
    const next = removeCartLine(memoryCart, selection)
    updateCartSnapshot(next)
  }, [])

  const clear = React.useCallback(() => {
    updateCartSnapshot(EMPTY_CART)
    setLiveMessage("Cart cleared.")
  }, [])

  const value = React.useMemo<CartContextValue>(() => ({
    lines,
    itemCount: cartItemCount(lines),
    subtotalCents: cartSubtotalCents(lines, catalogProducts),
    liveMessage,
    add,
    setQuantity,
    remove,
    clear,
    clearCart: clear,
    productFor: (line) => getCatalogProductBySlug(line.slug),
  }), [add, clear, lines, liveMessage, remove, setQuantity])

  return (
    <CartContext.Provider value={value}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const cart = useOptionalCart()
  if (!cart) throw new Error("useCart must be used within CartProvider")
  return cart
}

export function useOptionalCart(): CartContextValue | null {
  return React.useContext(CartContext)
}
