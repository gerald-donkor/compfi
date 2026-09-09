"use client"

import * as React from "react"
import { cn } from "cn"

import { ColorSelector } from "@/components/commerce/color-swatch"
import { QuantityInput } from "@/components/commerce/quantity-input"
import { SizeSelector } from "@/components/commerce/size-selector"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import type { ColorOption, SizeOption } from "@/types/commerce"

export interface ProductOptionsProps extends React.ComponentProps<"section"> {
  sizes?: readonly SizeOption[]
  defaultSize?: string
  finishes?: readonly ColorOption[]
  defaultFinish?: string
  comparisonHref?: string
}

export function ProductOptions({
  sizes,
  defaultSize,
  finishes,
  defaultFinish,
  comparisonHref,
  className,
  "aria-label": ariaLabel = "Product options",
  ...props
}: ProductOptionsProps) {
  const sizeLabelId = React.useId()
  const finishLabelId = React.useId()
  const quantityId = React.useId()
  const actionsNoteId = React.useId()

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
            aria-labelledby={finishLabelId}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2" data-slot="product-option-group">
        <label className="type-label" htmlFor={quantityId}>Quantity</label>
        <QuantityInput id={quantityId} defaultValue={1} min={1} max={10} />
        <p className="type-body-sm text-muted-foreground">Quantity is limited to 10 in this preview.</p>
      </div>

      <div className="flex flex-col gap-3" data-slot="product-actions">
        <p className="type-body-sm text-muted-foreground" id={actionsNoteId}>
          Online ordering is not available in this preview.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button disabled aria-describedby={actionsNoteId} className="max-sm:w-full">
            Add to cart
          </Button>
          {comparisonHref ? <Link href={comparisonHref} className="min-h-11 min-w-11 border border-compfi-ink px-6 py-3 text-sm hover:border-primary hover:text-primary max-sm:w-full">Compare</Link> : null}
        </div>
      </div>
    </section>
  )
}
