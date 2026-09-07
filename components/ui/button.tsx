import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-3 focus-visible:outline-none active:not-aria-[haspopup]:translate-y-[var(--active-offset)] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-compfi-brand-focus",
        outline:
          "border-compfi-ink bg-transparent text-foreground hover:border-primary hover:text-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-muted",
        ghost:
          "hover:bg-secondary hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30",
        link:
          "text-primary underline-offset-4 hover:underline min-h-0 min-w-0 p-0 rounded-none",
      },
      size: {
        default: "min-h-11 min-w-11 px-6 py-3 text-sm gap-2",
        xs: "min-h-11 min-w-11 px-3 py-1 text-xs gap-1",
        sm: "min-h-11 min-w-11 px-4 py-2 text-xs gap-1.5",
        lg: "min-h-12 min-w-12 px-8 py-3.5 text-base gap-2.5",
        icon: "size-11 p-0",
        "icon-xs": "size-11 p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-11 p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 p-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
