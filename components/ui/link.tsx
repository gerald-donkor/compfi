import * as React from "react"
import NextLink, { type LinkProps as NextLinkProps } from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const linkVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-primary underline-offset-4 hover:underline",
        muted: "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline",
        primary: "text-primary hover:text-primary/80 underline-offset-4 hover:underline",
        underline: "text-foreground underline underline-offset-4 hover:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type LinkProps = Omit<React.ComponentProps<"a">, keyof NextLinkProps> &
  NextLinkProps &
  VariantProps<typeof linkVariants>

function Link({
  className,
  variant = "default",
  ...props
}: LinkProps) {
  return (
    <NextLink
      data-slot="link"
      className={cn(linkVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Link, linkVariants }
