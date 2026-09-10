import { cn } from "cn"

import { Link } from "@/components/ui/link"
import { blogHref, type BlogCategory, type BlogCategoryCount } from "@/lib/blog"

export interface BlogCategoriesProps {
  categories: readonly BlogCategoryCount[]
  activeCategory?: BlogCategory
  searchQuery?: string
}

export function BlogCategories({
  categories,
  activeCategory,
  searchQuery,
}: BlogCategoriesProps) {
  return (
    <section
      className="blog-categories"
      data-slot="blog-categories"
      aria-labelledby="blog-categories-heading"
    >
      <h3
        id="blog-categories-heading"
        className="blog-sidebar__heading text-2xl font-medium text-foreground"
      >
        Categories
      </h3>

      <ul className="blog-categories__list mt-6 flex flex-col gap-5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name
          // If already active, clicking toggles off back to all categories
          const href = blogHref(
            { searchQuery, activeCategory },
            { category: isActive ? null : cat.slug, page: 1 }
          )

          return (
            <li key={cat.name}>
              <Link
                href={href}
                className={cn(
                  "blog-categories__link flex items-center justify-between text-base text-muted transition-colors hover:text-foreground",
                  isActive && "font-semibold text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{cat.name}</span>{" "}
                <span className="blog-categories__count text-muted" aria-label={`${cat.count} articles`}>
                  {cat.count}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
