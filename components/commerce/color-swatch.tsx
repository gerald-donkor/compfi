"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"

export interface ColorOption {
  value: string
  label: string
  color: string
  disabled?: boolean
}

export interface ColorSelectorProps {
  options: ColorOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}

export function ColorSelector({
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  "aria-label": ariaLabel = "Choose color",
  "aria-labelledby": ariaLabelledBy,
}: ColorSelectorProps) {
  // Catch duplicate option values in development
  if (process.env.NODE_ENV !== "production") {
    const seen = new Set<string>()
    for (const opt of options) {
      if (seen.has(opt.value)) {
        throw new Error(`Duplicate value in ColorSelector options: "${opt.value}"`)
      }
      seen.add(opt.value)
    }
  }

  if (!options || options.length === 0) {
    return (
      <div
        data-slot="color-selector"
        data-empty="true"
        className="text-sm text-muted-foreground"
      >
        No colors available
      </div>
    )
  }

  const selectedArray = value !== undefined ? (value ? [value] : []) : undefined
  const defaultArray = defaultValue !== undefined ? (defaultValue ? [defaultValue] : []) : undefined

  return (
    <ToggleGroupPrimitive
      data-slot="color-selector"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      value={selectedArray}
      defaultValue={defaultArray}
      onValueChange={(val: string[]) => {
        const next = val && val.length > 0 ? String(val[val.length - 1]) : ""
        onValueChange?.(next)
      }}
      className={cn("inline-flex flex-wrap items-center gap-2", className)}
    >
      {options.map((option) => (
        <ColorSwatchItem key={option.value} option={option} />
      ))}
    </ToggleGroupPrimitive>
  )
}

function ColorSwatchItem({ option }: { option: ColorOption }) {
  return (
    <TogglePrimitive
      data-slot="color-swatch"
      value={option.value}
      disabled={option.disabled}
      aria-label={option.label}
      title={option.label}
      render={(props, state) => (
        <button
          type="button"
          {...props}
          className={cn(
            "group relative flex size-11 items-center justify-center rounded-full transition-all outline-none",
            "focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          <span
            className={cn(
              "relative flex size-8 items-center justify-center rounded-full border border-black/15 transition-all",
              state.pressed && "ring-2 ring-primary ring-offset-2 scale-105"
            )}
            style={{ backgroundColor: option.color }}
          >
            {state.pressed && (
              <CheckIcon
                className="size-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                aria-hidden="true"
              />
            )}
          </span>
        </button>
      )}
    />
  )
}

export { ColorSwatchItem as ColorSwatch }
