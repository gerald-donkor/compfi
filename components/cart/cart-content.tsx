"use client"

import Image from "next/image"
import { Trash2Icon } from "lucide-react"

import { Money } from "@/components/commerce/money"
import { QuantityInput } from "@/components/commerce/quantity-input"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Link } from "@/components/ui/link"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { useCart } from "@/components/cart/cart-provider"
import type { CartLine } from "@/lib/cart"

function lineDescription(line: CartLine) {
  return [line.size, line.finish].filter(Boolean).join(" · ")
}

function CartEmpty() {
  return <Empty className="border-compfi-border bg-background py-16"><EmptyHeader><EmptyMedia variant="icon"><Trash2Icon aria-hidden="true" /></EmptyMedia><EmptyTitle className="type-heading-sm">Your cart is empty</EmptyTitle><EmptyDescription>Browse furniture to find pieces for your space.</EmptyDescription></EmptyHeader><EmptyContent><Link href="/shop" className="min-h-11 min-w-11 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground no-underline hover:bg-compfi-brand-focus">Browse furniture</Link></EmptyContent></Empty>
}

export function CartContent() {
  const { lines, subtotalCents, remove } = useCart()
  if (!lines.length) return <Container className="py-16 sm:py-24"><CartEmpty /></Container>

  const removeAndFocus = (line: CartLine) => {
    remove(line)
    requestAnimationFrame(() => document.getElementById("cart-content-heading")?.focus())
  }
  return <Container className="grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:items-start sm:py-24">
    <div><h2 id="cart-content-heading" tabIndex={-1} className="sr-only">Cart items</h2>
      <Table className="hidden md:table"><TableHeader className="bg-secondary"><TableRow><TableHead className="px-6">Product</TableHead><TableHead>Price</TableHead><TableHead>Quantity</TableHead><TableHead>Subtotal</TableHead><TableHead><span className="sr-only">Remove</span></TableHead></TableRow></TableHeader><TableBody>{lines.map((line) => <DesktopLine key={`${line.slug}-${line.size}-${line.finish}`} line={line} onRemove={removeAndFocus} />)}</TableBody></Table>
      <div className="flex flex-col gap-5 md:hidden">{lines.map((line) => <MobileLine key={`${line.slug}-${line.size}-${line.finish}`} line={line} onRemove={removeAndFocus} />)}</div>
    </div>
    <aside aria-labelledby="cart-subtotal" className="surface-wash p-8 sm:p-12"><h2 id="cart-subtotal" className="type-heading-lg">Cart subtotal</h2><div className="mt-10 flex items-baseline justify-between gap-4"><span className="type-body">Subtotal</span><Money amountCents={subtotalCents} className="type-heading-md text-primary" /></div><p className="mt-8 type-body-sm text-muted-foreground">Checkout will be available soon.</p><Button disabled className="mt-6 w-full">Proceed to checkout</Button></aside>
  </Container>
}

function DesktopLine({ line, onRemove }: { line: CartLine; onRemove: (line: CartLine) => void }) {
  const { productFor, setQuantity } = useCart(); const product = productFor(line); if (!product) return null
  return <TableRow><TableCell className="px-2 py-6"><div className="flex min-w-64 items-center gap-4"><Image src={product.media.path} alt={product.media.alt} width={product.media.width} height={product.media.height} sizes="112px" className="size-24 rounded-control object-cover" /><div><Link href={`/shop/${product.slug}`} className="no-underline">{product.name}</Link>{lineDescription(line) ? <p className="type-body-sm text-muted-foreground">{lineDescription(line)}</p> : null}</div></div></TableCell><TableCell><Money amountCents={product.priceCents} /></TableCell><TableCell><QuantityInput value={line.quantity} onValueChange={(quantity) => setQuantity(line, quantity)} min={1} max={10} aria-label={`Quantity for ${product.name}`} /></TableCell><TableCell><Money amountCents={product.priceCents * line.quantity} /></TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => onRemove(line)} aria-label={`Remove ${product.name}`}><Trash2Icon aria-hidden="true" /></Button></TableCell></TableRow>
}

function MobileLine({ line, onRemove }: { line: CartLine; onRemove: (line: CartLine) => void }) {
  const { productFor, setQuantity } = useCart(); const product = productFor(line); if (!product) return null
  return <article className="border border-compfi-border p-5" aria-label={product.name}><div className="flex gap-4"><Image src={product.media.path} alt={product.media.alt} width={product.media.width} height={product.media.height} sizes="96px" className="size-24 rounded-control object-cover" /><div className="min-w-0 flex-1"><Link href={`/shop/${product.slug}`} className="no-underline">{product.name}</Link>{lineDescription(line) ? <p className="type-body-sm text-muted-foreground">{lineDescription(line)}</p> : null}<Money amountCents={product.priceCents} className="mt-2 block" /></div><Button variant="ghost" size="icon" onClick={() => onRemove(line)} aria-label={`Remove ${product.name}`}><Trash2Icon aria-hidden="true" /></Button></div><div className="mt-5 flex items-center justify-between gap-4"><QuantityInput value={line.quantity} onValueChange={(quantity) => setQuantity(line, quantity)} min={1} max={10} aria-label={`Quantity for ${product.name}`} /><div className="text-right"><p className="type-body-sm text-muted-foreground">Subtotal</p><Money amountCents={product.priceCents * line.quantity} /></div></div></article>
}
