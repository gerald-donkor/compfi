import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogRecentPosts } from "@/components/blog/blog-recent-posts"
import { BlogSearch } from "@/components/blog/blog-search"
import type { BlogViewModel } from "@/lib/blog"

export interface BlogSidebarProps {
  view: BlogViewModel
}

export function BlogSidebar({ view }: BlogSidebarProps) {
  return (
    <aside
      className="blog-sidebar flex flex-col gap-12"
      data-slot="blog-sidebar"
      aria-label="Blog sidebar"
    >
      <BlogSearch
        defaultValue={view.searchQuery}
        activeCategory={view.activeCategory}
      />
      <BlogCategories
        categories={view.categories}
        activeCategory={view.activeCategory}
        searchQuery={view.searchQuery}
      />
      <BlogRecentPosts posts={view.recentPosts} />
    </aside>
  )
}
