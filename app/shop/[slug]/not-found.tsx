import { Link } from "@/components/ui/link"

export default function ProductNotFound() {
  return (
    <main id="main-content" className="compfi-container flex min-h-[50vh] flex-col items-start justify-center gap-5 py-16">
      <h1 className="type-heading-lg text-balance">Product not found</h1>
      <p className="type-body text-muted-foreground">This product is not part of the current Compfi catalog.</p>
      <Link href="/shop" variant="primary" className="min-h-11 border border-primary px-6 py-3">Browse products</Link>
    </main>
  )
}
