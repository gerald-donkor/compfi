import { ProductGrid } from "@/components/commerce/product-grid"
import { Container } from "@/components/layout/container"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Link } from "@/components/ui/link"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import type { CatalogViewModel } from "@/lib/catalog-view"
import { shopHref } from "@/lib/catalog-view"

export interface ShopResultsProps { view: CatalogViewModel }

export function ShopResults({ view }: ShopResultsProps) {
  if (view.totalCount === 0) return <Container className="shop-results"><Empty><EmptyHeader><EmptyTitle>No products match this room</EmptyTitle><EmptyDescription>Try another room to see the full Compfi collection.</EmptyDescription></EmptyHeader><EmptyContent><Link href="/shop">View all products</Link></EmptyContent></Empty></Container>
  return <section className="shop-results" data-slot="shop-results" data-view={view.view} aria-labelledby="shop-results-heading"><Container>
    <h2 id="shop-results-heading" className="sr-only">Shop results</h2>
    <p className="shop-results__summary">Showing {view.visibleStart}–{view.visibleEnd} of {view.totalCount} products</p>
    <ProductGrid products={view.visibleProducts} />
    {view.totalPages > 1 && <Pagination className="shop-results__pagination"><PaginationContent>
      {view.page > 1 && <PaginationItem><PaginationPrevious href={shopHref(view, { page: view.page - 1 })} /></PaginationItem>}
      {Array.from({ length: view.totalPages }, (_, index) => index + 1).map((page) => <PaginationItem key={page}><PaginationLink href={shopHref(view, { page })} isActive={page === view.page}>{page}</PaginationLink></PaginationItem>)}
      {view.page < view.totalPages && <PaginationItem><PaginationNext href={shopHref(view, { page: view.page + 1 })} /></PaginationItem>}
    </PaginationContent></Pagination>}
  </Container></section>
}
