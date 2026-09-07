"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { cn } from "cn"

export interface QuantityInputProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  name?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
}

export function QuantityInput({
  value: controlledValue,
  defaultValue = 1,
  onValueChange,
  min = 1,
  max,
  step = 1,
  name,
  disabled = false,
  readOnly = false,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: QuantityInputProps) {
  const isControlled = controlledValue !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<number>(defaultValue)
  const currentValue = isControlled ? controlledValue : uncontrolledValue

  const [draft, setDraft] = React.useState<string | null>(null)
  const displayValue = draft !== null ? draft : String(currentValue)

  const commitValue = React.useCallback(
    (rawVal: number) => {
      let clamped = Math.floor(rawVal)
      if (clamped < min) clamped = min
      if (max !== undefined && clamped > max) clamped = max

      setDraft(null)

      if (!isControlled) {
        setUncontrolledValue(clamped)
      }

      if (clamped !== currentValue) {
        onValueChange?.(clamped)
      }
    },
    [min, max, isControlled, currentValue, onValueChange]
  )

  const handleDecrement = React.useCallback(() => {
    if (disabled || readOnly) return
    const next = Math.max(min, currentValue - step)
    commitValue(next)
  }, [disabled, readOnly, min, currentValue, step, commitValue])

  const handleIncrement = React.useCallback(() => {
    if (disabled || readOnly) return
    const next = max !== undefined ? Math.min(max, currentValue + step) : currentValue + step
    commitValue(next)
  }, [disabled, readOnly, max, currentValue, step, commitValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value)
  }

  const handleBlur = () => {
    if (draft === null) return
    const parsed = parseInt(draft, 10)
    if (Number.isNaN(parsed)) {
      setDraft(null)
      commitValue(currentValue)
    } else {
      commitValue(parsed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (draft === null) return
      const parsed = parseInt(draft, 10)
      if (Number.isNaN(parsed)) {
        setDraft(null)
        commitValue(currentValue)
      } else {
        commitValue(parsed)
      }
    }
  }

  const canDecrement = !disabled && !readOnly && currentValue > min
  const canIncrement = !disabled && !readOnly && (max === undefined || currentValue < max)

  return (
    <div
      data-slot="quantity-input"
      className={cn(
        "inline-flex h-11 items-center rounded-[10px] border border-input bg-transparent transition-colors",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrement}
        onClick={handleDecrement}
        className="flex size-11 items-center justify-center text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        <MinusIcon className="size-4" aria-hidden="true" />
      </button>

      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        role="spinbutton"
        aria-valuenow={currentValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel ?? "Quantity"}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        readOnly={readOnly}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-11 w-12 text-center text-sm font-medium tabular-nums text-foreground bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={!canIncrement}
        onClick={handleIncrement}
        className="flex size-11 items-center justify-center text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlusIcon className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
