"use client"

import * as React from "react"
import { cn } from "cn"

import { ColorSelector } from "@/components/commerce/color-swatch"
import { QuantityInput } from "@/components/commerce/quantity-input"
import { SizeSelector } from "@/components/commerce/size-selector"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { useOptionalCart } from "@/components/cart/cart-provider"
import type { CatalogProduct, ColorOption, SizeOption } from "@/types/commerce"

export interface ProductOptionsProps extends React.ComponentProps<"section"> {
  product?: CatalogProduct
  sizes?: readonly SizeOption[]
  defaultSize?: string
  finishes?: readonly ColorOption[]
  defaultFinish?: string
  comparisonHref?: string
}

export function ProductOptions({
  product,
  sizes,
  defaultSize,
  finishes,
  defaultFinish,
  comparisonHref,
  className,
  "aria-label": ariaLabel = "Product options",
  ...props
}: ProductOptionsProps) {
  const cart = useOptionalCart()
  const sizeLabelId = React.useId()
  const finishLabelId = React.useId()
  const quantityId = React.useId()
  const actionsNoteId = React.useId()
  const [size, setSize] = React.useState(defaultSize)
  const [finish, setFinish] = React.useState(defaultFinish)
  const [quantity, setQuantity] = React.useState(1)
  const [announcement, setAnnouncement] = React.useState("")
  const [isBusy, setIsBusy] = React.useState(false)
  const busyTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (busyTimerRef.current !== null) {
        window.clearTimeout(busyTimerRef.current)
      }
    }
  }, [])

  const handleOptionChange = (
    kind: "size" | "finish",
    nextVal: string,
    options: readonly { value: string; label: string }[] | undefined
  ) => {
    if (kind === "size") {
      setSize(nextVal)
    } else {
      setFinish(nextVal)
    }
    const opt = options?.find((item) => item.value === nextVal)
    if (opt) {
      setAnnouncement(`Selected ${kind} ${opt.label}`)
    }
  }

  const handleQuantityChange = (nextQuantity: number) => {
    setQuantity(nextQuantity)
    setAnnouncement(`Quantity set to ${nextQuantity}`)
  }

  const handleAddToCart = () => {
    if (!product || !cart || isBusy) return
    setIsBusy(true)
    cart.add(product, { size, finish }, quantity)
    busyTimerRef.current = window.setTimeout(() => {
      setIsBusy(false)
      busyTimerRef.current = null
    }, 300)
  }

  return (
    <section
      {...props}
      className={cn("flex flex-col gap-6", className)}
      aria-label={ariaLabel}
      data-slot="product-options"
    >
      {sizes?.length ? (
        <div className="flex flex-col gap-2" data-slot="product-option-group">
          <p className="type-label" id={sizeLabelId}>Size</p>
          <SizeSelector
            options={sizes}
            defaultValue={defaultSize}
            value={size}
            onValueChange={(val) => handleOptionChange("size", val, sizes)}
            aria-labelledby={sizeLabelId}
          />
        </div>
      ) : null}

      {finishes?.length ? (
        <div className="flex flex-col gap-2" data-slot="product-option-group">
          <p className="type-label" id={finishLabelId}>Finish</p>
          <ColorSelector
            options={finishes}
            defaultValue={defaultFinish}
            value={finish}
            onValueChange={(val) => handleOptionChange("finish", val, finishes)}
            aria-labelledby={finishLabelId}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2" data-slot="product-option-group">
        <label className="type-label" htmlFor={quantityId}>Quantity</label>
        <QuantityInput id={quantityId} value={quantity} onValueChange={handleQuantityChange} min={1} max={10} />
        <p className="type-body-sm text-muted-foreground">Quantity is limited to 10 in this preview.</p>
      </div>

      <div className="flex flex-col gap-3" data-slot="product-actions">
        <p className="type-body-sm text-muted-foreground" id={actionsNoteId}>Quantity is limited to 10 per selection.</p>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={!product || !cart}
            aria-busy={isBusy ? "true" : undefined}
            aria-describedby={actionsNoteId}
            className="max-sm:w-full"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
          {comparisonHref ? <Link href={comparisonHref} className="min-h-11 min-w-11 border border-compfi-ink px-6 py-3 text-sm hover:border-primary hover:text-primary max-sm:w-full">Compare</Link> : null}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  )
}
