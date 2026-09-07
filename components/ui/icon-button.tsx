import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "cn"

export interface IconButtonProps extends Omit<ButtonProps, "size" | "children"> {
  label: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
  size?: "icon" | "icon-xs" | "icon-sm" | "icon-lg"
}

function IconButton({
  label,
  size = "icon",
  icon: Icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      data-slot="icon-button"
      size={size}
      aria-label={label}
      className={cn(className)}
      {...props}
    >
      <Icon aria-hidden="true" />
    </Button>
  )
}

export { IconButton }
