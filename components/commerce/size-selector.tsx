"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cn } from "cn"

export interface SizeOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SizeSelectorProps {
  options: SizeOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}

export function SizeSelector({
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  "aria-label": ariaLabel = "Choose size",
  "aria-labelledby": ariaLabelledBy,
}: SizeSelectorProps) {
  // Catch duplicate option values in development
  if (process.env.NODE_ENV !== "production") {
    const seen = new Set<string>()
    for (const opt of options) {
      if (seen.has(opt.value)) {
        throw new Error(`Duplicate value in SizeSelector options: "${opt.value}"`)
      }
      seen.add(opt.value)
    }
  }

  if (!options || options.length === 0) {
    return (
      <div
        data-slot="size-selector"
        data-empty="true"
        className="text-sm text-muted-foreground"
      >
        No sizes available
      </div>
    )
  }

  const selectedArray = value !== undefined ? (value ? [value] : []) : undefined
  const defaultArray = defaultValue !== undefined ? (defaultValue ? [defaultValue] : []) : undefined

  return (
    <ToggleGroupPrimitive
      data-slot="size-selector"
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
        <TogglePrimitive
          key={option.value}
          data-slot="size-option"
          value={option.value}
          disabled={option.disabled}
          aria-label={option.label}
          render={(props, state) => (
            <button
              type="button"
              {...props}
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border px-4 py-2 text-sm font-medium transition-colors outline-none",
                state.pressed
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-input bg-transparent text-foreground hover:bg-muted",
                "focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              {option.label}
            </button>
          )}
        />
      ))}
    </ToggleGroupPrimitive>
  )
}
