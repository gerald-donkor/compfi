import type { CatalogProduct } from "@/types/commerce"
import { getCatalogProductBySlug } from "@/lib/catalog"

export const CART_QUANTITY_LIMIT = 10

export type CartSelection = {
  readonly slug: string
  readonly size?: string
  readonly finish?: string
}

export type CartLine = CartSelection & {
  readonly quantity: number
}

export type CartState = readonly CartLine[]

function optionIsAvailable(
  options: readonly { value: string; disabled?: boolean }[] | undefined,
  value: string | undefined,
  defaultValue: string | undefined,
): boolean {
  if (!options) return value === undefined
  const selected = value ?? defaultValue
  return Boolean(selected && options.some((option) => option.value === selected && !option.disabled))
}

function normalizedQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1
  return Math.min(CART_QUANTITY_LIMIT, Math.max(1, Math.floor(quantity)))
}

export function createCartLine(
  product: CatalogProduct,
  selection: Omit<CartSelection, "slug"> = {},
  quantity = 1,
): CartLine | undefined {
  if (getCatalogProductBySlug(product.slug) !== product) return undefined
  const size = selection.size ?? product.defaultSize
  const finish = selection.finish ?? product.defaultFinish

  if (
    !optionIsAvailable(product.sizes, size, product.defaultSize) ||
    !optionIsAvailable(product.finishes, finish, product.defaultFinish)
  ) {
    return undefined
  }

  return { slug: product.slug, ...(size ? { size } : {}), ...(finish ? { finish } : {}), quantity: normalizedQuantity(quantity) }
}

export function cartLineKey(line: CartSelection): string {
  return [line.slug, line.size ?? "", line.finish ?? ""].join("::")
}

export function addCartLine(state: CartState, line: CartLine): CartState {
  const key = cartLineKey(line)
  const existing = state.find((candidate) => cartLineKey(candidate) === key)
  if (!existing) return [...state, line]
  return state.map((candidate) =>
    cartLineKey(candidate) === key
      ? { ...candidate, quantity: Math.min(CART_QUANTITY_LIMIT, candidate.quantity + line.quantity) }
      : candidate,
  )
}

export function setCartLineQuantity(state: CartState, selection: CartSelection, quantity: number): CartState {
  const key = cartLineKey(selection)
  if (!state.some((line) => cartLineKey(line) === key)) return state
  if (!Number.isFinite(quantity) || Math.floor(quantity) < 1) return state.filter((line) => cartLineKey(line) !== key)
  const normalized = normalizedQuantity(quantity)
  return state.map((line) => (cartLineKey(line) === key ? { ...line, quantity: normalized } : line))
}

export function removeCartLine(state: CartState, selection: CartSelection): CartState {
  const key = cartLineKey(selection)
  return state.filter((line) => cartLineKey(line) !== key)
}

export function cartItemCount(state: CartState): number {
  return state.reduce((count, line) => count + line.quantity, 0)
}

export function cartSubtotalCents(state: CartState, products: readonly CatalogProduct[]): number {
  const prices = new Map(products.map((product) => [product.slug, product.priceCents]))
  return state.reduce((total, line) => total + (prices.get(line.slug) ?? 0) * line.quantity, 0)
}
