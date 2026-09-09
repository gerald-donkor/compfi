"use client"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Link } from "@/components/ui/link"
export default function ComparisonError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main id="main-content"><Container className="py-24 text-center"><h1 className="type-heading-lg">The comparison could not load</h1><p className="mt-3 text-muted">Please try again or return to the collection.</p><div className="mt-6 flex justify-center gap-4"><Button onClick={reset}>Try again</Button><Link href="/shop">Return to Shop</Link></div></Container></main> }
