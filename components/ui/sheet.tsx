"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-compfi-scrim transition-opacity duration-[var(--duration-standard)] ease-[var(--ease-standard)] data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

export type SheetContentProps = SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-4 overscroll-contain bg-popover bg-clip-padding text-sm text-popover-foreground transition duration-[var(--duration-standard)] ease-[var(--ease-standard)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-(--chrome-sheet-entry-offset) data-[side=bottom]:data-starting-style:translate-y-(--chrome-sheet-entry-offset) data-[side=left]:inset-y-0 data-[side=left]:left-(--chrome-drawer-inline-inset) data-[side=left]:h-full data-[side=left]:w-[min(calc(100dvw-(2*var(--chrome-drawer-inline-inset))),var(--chrome-drawer-max-width))] data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[calc(var(--chrome-sheet-entry-offset)*-1)] data-[side=left]:data-starting-style:translate-x-[calc(var(--chrome-sheet-entry-offset)*-1)] data-[side=right]:inset-y-0 data-[side=right]:right-(--chrome-drawer-inline-inset) data-[side=right]:h-full data-[side=right]:w-[min(calc(100dvw-(2*var(--chrome-drawer-inline-inset))),var(--chrome-drawer-max-width))] data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-(--chrome-sheet-entry-offset) data-[side=right]:data-starting-style:translate-x-(--chrome-sheet-entry-offset) data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[calc(var(--chrome-sheet-entry-offset)*-1)] data-[side=top]:data-starting-style:translate-y-[calc(var(--chrome-sheet-entry-offset)*-1)]",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
