import type { Metadata } from "next"

import { BlogFeed } from "@/components/blog/blog-feed"
import { BlogSearch } from "@/components/blog/blog-search"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { PageHero } from "@/components/chrome/page-hero"
import { Container } from "@/components/layout/container"
import { blogPosts, resolveBlogView } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description: "Explore interior design stories, craft insights, and decor ideas from Compfi.",
  alternates: {
    canonical: "/blog",
  },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const view = resolveBlogView(blogPosts, await searchParams)

  return (
    <main id="main-content">
      <PageHero
        title="Blog"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <Container className="blog-layout">
        <div className="blog-layout__grid">
          <BlogSearch
            defaultValue={view.searchQuery}
            activeCategory={view.activeCategory}
          />
          <BlogFeed view={view} />
          <BlogSidebar view={view} />
        </div>
      </Container>
      <BenefitsStrip />
    </main>
  )
}
