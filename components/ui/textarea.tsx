import * as React from "react"
import { cn } from "cn"

export type TextareaProps = React.ComponentProps<"textarea">

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-control border border-input bg-transparent px-3.5 py-2.5 text-base transition-colors outline-none resize-y placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/30 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
