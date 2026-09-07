import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      compact: "gap-2",
      default: "gap-4",
      loose: "gap-6",
      spacious: "gap-8",
    },
  },
  defaultVariants: {
    gap: "default",
  },
})

export type StackProps = React.ComponentProps<"div"> &
  VariantProps<typeof stackVariants>

function Stack({
  className,
  gap = "default",
  ...props
}: StackProps) {
  return (
    <div
      data-slot="stack"
      data-gap={gap}
      className={cn(stackVariants({ gap }), className)}
      {...props}
    />
  )
}

export { Stack, stackVariants }
