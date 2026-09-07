"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cn } from "cn"
import type { SizeOption } from "@/types/commerce"
import {
  validateNoDuplicateOptions,
  toSelectedArray,
  handleSingleValueChange,
} from "./selector-utils"

export type { SizeOption }

export interface SizeSelectorProps {
  options: readonly SizeOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  ref?: React.Ref<HTMLDivElement>
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
  ref,
  ...props
}: SizeSelectorProps) {
  validateNoDuplicateOptions(options, "SizeSelector")

  if (!options || options.length === 0) {
    return (
      <div
        ref={ref}
        data-slot="size-selector"
        data-empty="true"
        className="text-sm text-muted-foreground"
        {...props}
      >
        No sizes available
      </div>
    )
  }

  const selectedArray = toSelectedArray(value)
  const defaultArray = toSelectedArray(defaultValue)

  return (
    <ToggleGroupPrimitive
      ref={ref}
      data-slot="size-selector"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      value={selectedArray}
      defaultValue={defaultArray}
      onValueChange={(val: string[]) => handleSingleValueChange(val, onValueChange)}
      className={cn("inline-flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {options.map((option) => (
        <TogglePrimitive
          key={option.value}
          data-slot="size-option"
          value={option.value}
          disabled={option.disabled}
          aria-label={option.label}
          render={(renderProps, state) => (
            <button
              type="button"
              {...renderProps}
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border px-4 py-2 text-sm font-medium transition-colors outline-none",
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
