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
  const linesRef = React.useRef<CartState>([])
  const [liveMessage, setLiveMessage] = React.useState("")

  const add = React.useCallback((product: CatalogProduct, selection: Omit<CartSelection, "slug">, quantity: number) => {
    const canonicalProduct = getCatalogProductBySlug(product.slug)
    if (!canonicalProduct) return
    const line = createCartLine(canonicalProduct, selection, quantity)
    if (!line) return
    const next = addCartLine(linesRef.current, line)
    linesRef.current = next
    setLines(next)
    const resultingLine = next.find((candidate) => candidate.slug === line.slug && candidate.size === line.size && candidate.finish === line.finish)
    setLiveMessage(`${canonicalProduct.name} added to cart. Quantity ${resultingLine?.quantity ?? line.quantity}.`)
  }, [])

  const setQuantity = React.useCallback((selection: CartSelection, quantity: number) => {
    const product = getCatalogProductBySlug(selection.slug)
    setLiveMessage(`${product?.name ?? "Item"} quantity updated.`)
    const next = setCartLineQuantity(linesRef.current, selection, quantity)
    linesRef.current = next
    setLines(next)
  }, [])

  const remove = React.useCallback((selection: CartSelection) => {
    const product = getCatalogProductBySlug(selection.slug)
    setLiveMessage(`${product?.name ?? "Item"} removed from cart.`)
    const next = removeCartLine(linesRef.current, selection)
    linesRef.current = next
    setLines(next)
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
