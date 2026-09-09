import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading product">
      <div className="surface-wash min-h-(--product-detail-breadcrumb-height)" />
      <Container className="grid gap-12 py-12 lg:grid-cols-2">
        <Skeleton className="aspect-4/5 min-h-96" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </Container>
      <div className="border-y border-border py-16">
        <Container className="flex flex-col gap-8">
          <Skeleton className="mx-auto h-11 w-72" />
          <Skeleton className="h-24 w-full" />
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="aspect-3/2" />
            <Skeleton className="aspect-3/2" />
          </div>
        </Container>
      </div>
      <Container className="py-16">
        <Skeleton className="mx-auto mb-10 h-10 w-64" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="aspect-3/4" />)}
        </div>
      </Container>
    </main>
  )
}
