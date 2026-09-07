import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors select-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground",
        outline:
          "border-border bg-transparent text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground",
        discount:
          "bg-compfi-discount text-white",
        new:
          "bg-compfi-new text-compfi-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
