"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"
import type { ColorOption } from "@/types/commerce"
import {
  validateNoDuplicateOptions,
  toSelectedArray,
  handleSingleValueChange,
} from "./selector-utils"

export type { ColorOption }

export interface ColorSwatchProps {
  option: ColorOption
  ref?: React.Ref<HTMLButtonElement>
  className?: string
  disabled?: boolean
}

export interface ColorSelectorProps {
  options: readonly ColorOption[]
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

export function ColorSelector({
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  "aria-label": ariaLabel = "Choose color",
  "aria-labelledby": ariaLabelledBy,
  ref,
  ...props
}: ColorSelectorProps) {
  validateNoDuplicateOptions(options, "ColorSelector")

  if (!options || options.length === 0) {
    return (
      <div
        ref={ref}
        data-slot="color-selector"
        data-empty="true"
        className="text-sm text-muted-foreground"
        {...props}
      >
        No colors available
      </div>
    )
  }

  const selectedArray = toSelectedArray(value)
  const defaultArray = toSelectedArray(defaultValue)

  return (
    <ToggleGroupPrimitive
      ref={ref}
      data-slot="color-selector"
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
        <ColorSwatch key={option.value} option={option} />
      ))}
    </ToggleGroupPrimitive>
  )
}

export function ColorSwatch({ option, ref, className, ...props }: ColorSwatchProps) {
  return (
    <TogglePrimitive
      data-slot="color-swatch"
      value={option.value}
      disabled={option.disabled}
      aria-label={option.label}
      title={option.label}
      {...props}
      render={(renderProps, state) => (
        <button
          ref={ref}
          type="button"
          {...renderProps}
          className={cn(
            "group relative flex size-11 items-center justify-center rounded-full transition-all outline-none",
            "focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-40",
            className
          )}
        >
          <span
            className={cn(
              "relative flex size-8 items-center justify-center rounded-full border border-compfi-ink/15 transition-all",
              state.pressed && "ring-2 ring-primary ring-offset-2 scale-105"
            )}
            style={{ backgroundColor: option.color }}
          >
            {state.pressed && (
              <CheckIcon
                className="size-4 text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                aria-hidden="true"
              />
            )}
          </span>
        </button>
      )}
    />
  )
}
