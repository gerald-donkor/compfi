import type { ComponentProps } from "react"
import { formatMoney } from "@/lib/money"
import { cn } from "cn"

export interface MoneyProps extends ComponentProps<"span"> {
  amountCents: number
}

export function Money({ amountCents, className, ...props }: MoneyProps) {
  return (
    <span
      data-slot="money"
      className={cn("font-medium tabular-nums text-foreground", className)}
      {...props}
    >
      {formatMoney(amountCents)}
    </span>
  )
}
