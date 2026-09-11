import * as React from "react"
import Image from "next/image"
import { PackageIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { Link } from "@/components/ui/link"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { OrderWithItems } from "@/db/orders"
import { formatMoney } from "@/lib/money"

export type OrderHistoryProps = React.HTMLAttributes<HTMLElement> & {
  orders: readonly OrderWithItems[]
}

export function OrderHistory({ orders, className, ...props }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <section
        aria-labelledby="order-history-heading"
        data-slot="order-history"
        className={cn("w-full", className)}
        {...props}
      >
        <h2 id="order-history-heading" className="type-heading-md mb-6">
          Order History
        </h2>
        <Empty className="border border-compfi-border rounded-xl p-8 bg-card">
          <EmptyMedia variant="icon">
            <PackageIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <h3 className="type-heading-md">No orders yet</h3>
            <EmptyDescription>
              When you place an order, your items, delivery details, and status will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/shop" variant="primary">
              Browse furniture
            </Link>
          </EmptyContent>
        </Empty>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="order-history-heading"
      data-slot="order-history"
      className={cn("w-full", className)}
      {...props}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 id="order-history-heading" className="type-heading-md">
          Order History
        </h2>
        <span className="text-sm font-medium text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"} placed
        </span>
      </div>

      <ul className="space-y-6" aria-label="Past orders">
        {orders.map((order) => {
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(order.createdAt))

          return (
            <li
              key={order.id}
              className="rounded-xl border border-compfi-border bg-card p-5 md:p-6 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-compfi-border pb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Order
                    </span>
                    <span className="font-semibold text-compfi-ink">{order.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Placed on {formattedDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize text-xs px-2.5 py-0.5">
                    {order.status}
                  </Badge>
                </div>
              </div>

              <ul className="divide-y divide-compfi-border py-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-compfi-wash border border-compfi-border">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.productTitle}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <PackageIcon className="h-6 w-6" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-compfi-ink truncate text-sm">
                        {item.productTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size ? `Size: ${item.size}` : null}
                        {item.size && item.finish ? " • " : null}
                        {item.finish ? `Finish: ${item.finish}` : null}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} × {formatMoney(item.unitPriceCents)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-medium text-compfi-ink text-sm">
                        {formatMoney(item.totalPriceCents)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <Separator className="my-2" />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-sm">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-compfi-ink">Shipping address:</span>{" "}
                  {order.parsedShippingAddress.addressLine1}, {order.parsedShippingAddress.city},{" "}
                  {order.parsedShippingAddress.state} {order.parsedShippingAddress.zipCode}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">
                      Shipping:{" "}
                      {order.shippingCents === 0 ? "Free" : formatMoney(order.shippingCents)}
                    </span>
                    <span className="font-semibold text-compfi-brand text-base">
                      Total: {formatMoney(order.totalCents)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
