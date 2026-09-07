"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select"
import { QuantityInput } from "@/components/commerce/quantity-input"
import { ColorSelector, type ColorOption } from "@/components/commerce/color-swatch"
import { SizeSelector, type SizeOption } from "@/components/commerce/size-selector"
import { HeartIcon, Share2Icon } from "lucide-react"
import { Cluster } from "@/components/layout/cluster"
import { Stack } from "@/components/layout/stack"

const colorOptions: ColorOption[] = [
  { value: "walnut", label: "Walnut", color: "#5C4033" },
  { value: "sand", label: "Sand linen", color: "#D2B48C" },
  { value: "ochre", label: "Warm ochre", color: "#B88E2F" },
  { value: "charcoal", label: "Charcoal weave", color: "#36454F", disabled: true },
]

const sizeOptions: SizeOption[] = [
  { value: "compact", label: "Compact · 68\"" },
  { value: "standard", label: "Standard · 84\"" },
  { value: "generous", label: "Generous · 96\"" },
  { value: "custom", label: "Custom made", disabled: true },
]

export function InteractiveSpecimens() {
  const [log, setLog] = React.useState<string>("Specimen initialized. Select or adjust values below.")
  const [loading, setLoading] = React.useState<boolean>(false)
  const [controlledQty, setControlledQty] = React.useState<number>(2)
  const [selectedColor, setSelectedColor] = React.useState<string>("sand")
  const [selectedSize, setSelectedSize] = React.useState<string>("standard")
  const [sortOrder, setSortOrder] = React.useState<string>("featured")

  const handleSimulateAdd = () => {
    setLoading(true)
    setLog("Action pending: Adding item to cart...")
    setTimeout(() => {
      setLoading(false)
      setLog(`Specimen state: Simulated addition of ${controlledQty} × ${selectedSize} in ${selectedColor}.`)
    }, 1200)
  }

  return (
    <Stack gap="loose" className="w-full">
      <div
        aria-live="polite"
        aria-atomic="true"
        className="rounded-control border border-border bg-muted/40 p-4 text-sm font-medium text-foreground"
      >
        <span className="text-muted-foreground font-normal">Specimen log: </span>
        {log}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Stack gap="compact">
          <h3 className="type-heading-sm">Composed action & icon buttons</h3>
          <Cluster gap="compact">
            <Button
              disabled={loading}
              onClick={handleSimulateAdd}
            >
              {loading ? (
                <>
                  <Spinner className="size-4 animate-spin" aria-hidden="true" />
                  Adding…
                </>
              ) : (
                "Simulate add to cart"
              )}
            </Button>
            <IconButton
              label="Save to favorites"
              icon={HeartIcon}
              variant="outline"
              onClick={() => setLog("IconButton activated: Saved to favorites")}
            />
            <IconButton
              label="Share item"
              icon={Share2Icon}
              variant="ghost"
              onClick={() => setLog("IconButton activated: Shared item")}
            />
          </Cluster>
        </Stack>

        <Stack gap="compact">
          <h3 className="type-heading-sm">Select with grouped options</h3>
          <Select
            value={sortOrder}
            onValueChange={(val) => {
              const strVal = String(val)
              setSortOrder(strVal)
              setLog(`Select changed: Sort by "${strVal}"`)
            }}
          >
            <SelectTrigger aria-label="Catalog sorting" className="w-full sm:w-64">
              <SelectValue placeholder="Sort catalog" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Relevance</SelectLabel>
                <SelectItem value="featured">Featured collection</SelectItem>
                <SelectItem value="newest">New arrivals</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Price</SelectLabel>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Stack>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Stack gap="compact">
          <h3 className="type-heading-sm">Quantity controls</h3>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div>
              <span className="block text-xs text-muted-foreground mb-1">Controlled (1–10)</span>
              <QuantityInput
                min={1}
                max={10}
                value={controlledQty}
                onValueChange={(val) => {
                  setControlledQty(val)
                  setLog(`QuantityInput changed: Quantity set to ${val}`)
                }}
              />
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">Uncontrolled (default 1)</span>
              <QuantityInput
                min={1}
                max={5}
                defaultValue={1}
                onValueChange={(val) => {
                  setLog(`Uncontrolled QuantityInput changed to ${val}`)
                }}
              />
            </div>
          </div>
        </Stack>

        <Stack gap="compact">
          <h3 className="type-heading-sm">Color swatches</h3>
          <span className="block text-xs text-muted-foreground">Selected: {selectedColor}</span>
          <ColorSelector
            options={colorOptions}
            value={selectedColor}
            onValueChange={(val) => {
              if (val) {
                setSelectedColor(val)
                setLog(`ColorSelector changed: Selected "${val}"`)
              }
            }}
          />
          <span className="block text-xs text-muted-foreground mt-2">Empty state treatment:</span>
          <ColorSelector options={[]} />
        </Stack>
      </div>

      <Stack gap="compact">
        <h3 className="type-heading-sm">Size selector</h3>
        <span className="block text-xs text-muted-foreground">Selected: {selectedSize}</span>
        <SizeSelector
          options={sizeOptions}
          value={selectedSize}
          onValueChange={(val) => {
            if (val) {
              setSelectedSize(val)
              setLog(`SizeSelector changed: Selected "${val}"`)
            }
          }}
        />
        <span className="block text-xs text-muted-foreground mt-2">Empty state treatment:</span>
        <SizeSelector options={[]} />
      </Stack>
    </Stack>
  )
}
