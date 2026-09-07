"use client"

import * as React from "react"
import { ShoppingCartIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function CartDrawer() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<IconButton icon={ShoppingCartIcon} label="Open cart" variant="ghost" />}
      />
      <SheetContent side="right" className="gap-0 p-0" showCloseButton>
        <SheetHeader className="border-b border-compfi-border px-8 py-7 pr-16">
          <SheetTitle className="type-heading-md">Your cart</SheetTitle>
          <SheetDescription className="sr-only">
            Your cart is empty. Browse furniture to add an item.
          </SheetDescription>
        </SheetHeader>
        <Empty className="border-0 px-8 py-12">
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
            <Link href="/shop" className={buttonVariants({ variant: "default", size: "default" })}>
              Browse furniture
            </Link>
          </EmptyContent>
        </Empty>
      </SheetContent>
    </Sheet>
  )
}
