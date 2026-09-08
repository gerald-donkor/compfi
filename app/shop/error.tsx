"use client"
import { Container } from "@/components/layout/container"
import { Link } from "@/components/ui/link"
import { Button } from "@/components/ui/button"

export default function ShopError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main id="main-content"><Container className="py-24 text-center"><h1 className="type-heading-lg">The shop could not load</h1><p className="mt-3 text-muted">Please try again or return to the collection.</p><div className="mt-6 flex justify-center gap-4"><Button onClick={reset}>Try again</Button><Link href="/shop">Return to Shop</Link></div></Container></main> }
