"use client"

import * as React from "react"
import Image from "next/image"
import { ShoppingCartIcon, Trash2Icon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"
import { Money } from "@/components/commerce/money"
import { useCart } from "@/components/cart/cart-provider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function CartDrawer() {
  const [open, setOpen] = React.useState(false)
  const { lines, itemCount, subtotalCents, productFor, remove } = useCart()
  const emptyRecoveryRef = React.useRef<HTMLAnchorElement>(null)
  const prevLineCountRef = React.useRef(lines.length)

  React.useEffect(() => {
    const previous = prevLineCountRef.current
    prevLineCountRef.current = lines.length
    if (open && previous > 0 && lines.length === 0) {
      emptyRecoveryRef.current?.focus()
    }
  }, [lines.length, open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<IconButton icon={ShoppingCartIcon} label={itemCount ? `Open cart, ${itemCount} items` : "Open cart"} variant="ghost" />}
      />
      <SheetContent side="right" className="gap-0 p-0" showCloseButton>
        <SheetHeader className="border-b border-compfi-border px-8 py-7 pr-16">
          <SheetTitle className="type-heading-md">Your cart</SheetTitle>
          <SheetDescription className="sr-only">
            {lines.length ? `${itemCount} items in your cart.` : "Your cart is empty. Browse furniture to add an item."}
          </SheetDescription>
        </SheetHeader>
        {!lines.length ? <Empty className="border-0 px-8 py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingCartIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle className="type-heading-sm">Your cart is empty</EmptyTitle>
            <EmptyDescription>
              Browse furniture to find pieces for your space.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              ref={emptyRecoveryRef}
              href="/shop"
              className={buttonVariants({ variant: "default", size: "default" })}
            >
              <span className="text-primary-foreground">Browse furniture</span>
            </Link>
          </EmptyContent>
        </Empty> : <>
          <ul className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
            {lines.map((line) => {
              const product = productFor(line)
              if (!product) return null
              return <li key={`${line.slug}-${line.size}-${line.finish}`} className="flex gap-4 border-b border-compfi-border py-4 first:pt-0">
                <Image src={product.media.path} alt={product.media.alt} width={product.media.width} height={product.media.height} sizes="112px" className="size-24 shrink-0 rounded-control object-cover" />
                <div className="min-w-0 flex-1">
                  <Link href={`/shop/${product.slug}`} className="no-underline" onClick={() => setOpen(false)}>{product.name}</Link>
                  {line.size || line.finish ? <p className="type-body-sm text-muted-foreground">{[line.size, line.finish].filter(Boolean).join(" · ")}</p> : null}
                  <p className="mt-2 flex items-center gap-2 type-body-sm"><span className="text-foreground">{line.quantity} ×</span><Money amountCents={product.priceCents} /></p>
                </div>
                <IconButton icon={Trash2Icon} label={`Remove ${product.name}`} variant="ghost" onClick={() => remove(line)} />
              </li>
            })}
          </ul>
          <div className="border-t border-compfi-border px-8 py-6">
            <div className="flex items-baseline justify-between gap-4"><span className="type-body">Subtotal</span><Money amountCents={subtotalCents} className="type-heading-sm text-primary" /></div>
            <div className="mt-6 flex flex-col gap-3"><Link href="/cart" className={buttonVariants({ variant: "outline", size: "default" })} onClick={() => setOpen(false)}>View cart</Link><Link href="/checkout" className={buttonVariants({ variant: "outline", size: "default" })} onClick={() => setOpen(false)}>Checkout</Link></div>
          </div>
        </>}
      </SheetContent>
    </Sheet>
  )
}
