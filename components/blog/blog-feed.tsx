import { cn } from "cn"

import { BlogCard } from "@/components/blog/blog-card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Link } from "@/components/ui/link"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { blogHref, type BlogViewModel } from "@/lib/blog"

export interface BlogFeedProps {
  view: BlogViewModel
}

export function BlogFeed({ view }: BlogFeedProps) {
  const hasFilter = Boolean(view.activeCategory || view.searchQuery)

  if (view.totalCount === 0) {
    return (
      <section
        className="blog-feed blog-feed--empty"
        data-slot="blog-feed"
        aria-labelledby="blog-feed-heading"
      >
        <h2 id="blog-feed-heading" className="sr-only">
          Blog articles
        </h2>
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyTitle>No articles found</EmptyTitle>
            <EmptyDescription>
              {view.searchQuery
                ? `No stories matched "${view.searchQuery}". Try searching for another topic or browsing by category.`
                : "No stories found in this category. Explore our other interior design articles."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/blog"
              className="blog-feed__empty-action inline-flex h-11 items-center justify-center bg-brand-action px-6 font-medium text-white transition-colors hover:bg-brand-action/90"
            >
              View all articles
            </Link>
          </EmptyContent>
        </Empty>
      </section>
    )
  }

  return (
    <section
      className="blog-feed"
      data-slot="blog-feed"
      aria-labelledby="blog-feed-heading"
    >
      <h2 id="blog-feed-heading" className="sr-only">
        Blog articles
      </h2>

      {hasFilter && (
        <div
          className="blog-feed__filter-status mb-8 flex flex-wrap items-center justify-between gap-4 bg-wash px-5 py-3 text-sm text-foreground"
          role="status"
        >
          <p>
            Showing {view.totalCount} {view.totalCount === 1 ? "article" : "articles"}
            {view.activeCategory ? (
              <>
                {" "}
                in <strong className="font-semibold">{view.activeCategory}</strong>
              </>
            ) : null}
            {view.searchQuery ? (
              <>
                {" "}
                for &ldquo;<strong className="font-semibold">{view.searchQuery}</strong>&rdquo;
              </>
            ) : null}
          </p>
          <Link
            href="/blog"
            className="text-sm font-medium text-brand-action underline underline-offset-4 hover:text-foreground"
          >
            Clear filter
          </Link>
        </div>
      )}

      <div className="blog-feed__articles flex flex-col">
        {view.visiblePosts.map((post, index) => (
          <BlogCard key={post.id} post={post} priority={index === 0} />
        ))}
      </div>

      {view.totalPages > 1 && (
        <Pagination
          className="blog-pagination mt-16"
          aria-label="Blog pagination"
        >
          <PaginationContent className="blog-pagination__list gap-3 sm:gap-7">
            {view.page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={blogHref(view, { page: view.page - 1 })}
                  text="Prev"
                  className="blog-pagination__btn blog-pagination__btn--nav"
                />
              </PaginationItem>
            )}

            {Array.from({ length: view.totalPages }, (_, index) => index + 1).map(
              (pageNum) => {
                const isActive = pageNum === view.page
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={blogHref(view, { page: pageNum })}
                      isActive={isActive}
                      className={cn(
                        "blog-pagination__btn blog-pagination__btn--number",
                        isActive && "blog-pagination__btn--active"
                      )}
                      aria-label={
                        isActive
                          ? `Page ${pageNum}, current page`
                          : `Go to page ${pageNum}`
                      }
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
            )}

            {view.page < view.totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={blogHref(view, { page: view.page + 1 })}
                  text="Next"
                  className="blog-pagination__btn blog-pagination__btn--nav"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </section>
  )
}
