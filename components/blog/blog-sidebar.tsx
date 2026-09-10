import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogRecentPosts } from "@/components/blog/blog-recent-posts"
import type { BlogViewModel } from "@/lib/blog"

export interface BlogSidebarProps {
  view: BlogViewModel
}

// Categories and recent posts only. BlogSearch is a page-level grid sibling
// (not nested here) so DOM order — search, feed, widgets — matches the
// single-column visual order and keyboard focus never jumps past content.
export function BlogSidebar({ view }: BlogSidebarProps) {
  return (
    <aside
      className="blog-sidebar flex flex-col gap-12"
      data-slot="blog-sidebar"
      aria-label="Blog sidebar"
    >
      <BlogCategories
        categories={view.categories}
        activeCategory={view.activeCategory}
        searchQuery={view.searchQuery}
      />
      <BlogRecentPosts posts={view.recentPosts} />
    </aside>
  )
}
