import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"
export default function ComparisonLoading() { return <main id="main-content" aria-label="Loading product comparison" aria-busy="true"><section className="surface-wash min-h-(--chrome-page-hero-banner-height)" /><Container className="py-16"><div className="grid gap-8 md:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-72" />)}</div><Skeleton className="mt-12 h-96 w-full" /></Container></main> }
