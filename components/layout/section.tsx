import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      compact: "py-8 md:py-12",
      default: "py-12 md:py-16",
      spacious: "py-16 md:py-24",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
})

export type SectionProps = React.ComponentProps<"section"> &
  VariantProps<typeof sectionVariants>

function Section({
  className,
  spacing = "default",
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      data-spacing={spacing}
      className={cn(sectionVariants({ spacing }), className)}
      {...props}
    />
  )
}

export { Section, sectionVariants }
