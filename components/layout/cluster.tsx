import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const clusterVariants = cva("flex flex-wrap", {
  variants: {
    gap: {
      none: "gap-0",
      compact: "gap-2",
      default: "gap-4",
      loose: "gap-6",
      spacious: "gap-8",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    gap: "default",
    align: "center",
  },
})

export type ClusterProps = React.ComponentProps<"div"> &
  VariantProps<typeof clusterVariants>

function Cluster({
  className,
  gap = "default",
  align = "center",
  ...props
}: ClusterProps) {
  return (
    <div
      data-slot="cluster"
      data-gap={gap}
      data-align={align}
      className={cn(clusterVariants({ gap, align }), className)}
      {...props}
    />
  )
}

export { Cluster, clusterVariants }
