export function validateNoDuplicateOptions<T extends { value: string }>(
  options: readonly T[],
  componentName: string
): void {
  if (process.env.NODE_ENV !== "production") {
    const seen = new Set<string>()
    for (const opt of options) {
      if (seen.has(opt.value)) {
        throw new Error(
          `Duplicate value in ${componentName} options: "${opt.value}"`
        )
      }
      seen.add(opt.value)
    }
  }
}

export function toSelectedArray(value: string | undefined): string[] | undefined {
  return value !== undefined ? (value ? [value] : []) : undefined
}

export function handleSingleValueChange(
  val: string[],
  onChange?: (value: string) => void
): void {
  const next = val && val.length > 0 ? String(val[val.length - 1]) : ""
  onChange?.(next)
}
