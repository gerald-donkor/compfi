"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

export default function ProductError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main-content" className="compfi-container flex min-h-[50vh] flex-col items-start justify-center gap-5 py-16">
      <h1 className="type-heading-lg text-balance">Product details could not be loaded</h1>
      <p className="type-body text-muted-foreground">Try again, or return to the catalog.</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/shop" className="min-h-11 border border-foreground px-6 py-3">Return to Shop</Link>
      </div>
    </main>
  )
}
