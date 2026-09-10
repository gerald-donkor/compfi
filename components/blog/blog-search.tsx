import { Search } from "lucide-react"

import { Link } from "@/components/ui/link"
import { blogHref } from "@/lib/blog"

export interface BlogSearchProps {
  defaultValue?: string
  activeCategory?: string
}

// Stateless server-safe form leaf: the browser owns the input value and
// submits a native GET to /blog with zero client state, so typing never
// rerenders the form and no "use client" boundary is needed.
export function BlogSearch({ defaultValue = "", activeCategory }: BlogSearchProps) {
  const clearHref = blogHref({ activeCategory }, { page: null })

  return (
    <form
      action="/blog"
      method="GET"
      role="search"
      aria-label="Search blog posts"
      className="blog-search"
      data-slot="blog-search"
    >
      {activeCategory && (
        <input type="hidden" name="category" value={activeCategory.toLowerCase()} />
      )}
      <div className="blog-search__wrapper relative flex items-center">
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search…"
          autoComplete="off"
          enterKeyHint="search"
          aria-label="Search blog posts"
          className="blog-search__input w-full border border-(--color-control-border) bg-canvas px-4 pr-24 text-base text-foreground placeholder:text-muted focus:border-brand-focus focus:outline-none focus:ring-2 focus:ring-brand-focus/20"
        />
        <div className="blog-search__actions absolute right-2 flex items-center gap-1">
          {defaultValue && (
            <Link
              href={clearHref}
              aria-label="Clear search and show all articles"
              className="blog-search__clear"
            >
              Clear
            </Link>
          )}
          <button
            type="submit"
            className="flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:text-brand-action"
            aria-label="Submit search"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  )
}
