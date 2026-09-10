import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import BlogPage from "@/app/blog/page"
import { blogHref, blogPosts, resolveBlogView } from "@/lib/blog"
import { checkA11y } from "./a11y"

describe("resolveBlogView", () => {
  it("returns the default first page with exact reference category counts", () => {
    const view = resolveBlogView(blogPosts, {})
    expect(view.totalCount).toBe(24)
    expect(view.totalPages).toBe(8)
    expect(view.page).toBe(1)
    expect(view.visiblePosts.map((post) => post.slug)).toEqual([
      "going-all-in-with-millennial-design",
      "exploring-new-ways-of-decorating",
      "handmade-pieces-that-took-time-to-make",
    ])
    expect(view.categories.map((category) => `${category.name}:${category.count}`)).toEqual([
      "Crafts:2",
      "Design:8",
      "Handmade:7",
      "Interior:1",
      "Wood:6",
    ])
    expect(view.recentPosts).toHaveLength(5)
    expect(view.visibleStart).toBe(1)
    expect(view.visibleEnd).toBe(3)
  })

  it("filters case-insensitively by category and clamps out-of-range pages", () => {
    const wood = resolveBlogView(blogPosts, { category: "Wood" })
    expect(wood.activeCategory).toBe("Wood")
    expect(wood.totalCount).toBe(6)
    expect(wood.totalPages).toBe(2)

    const clamped = resolveBlogView(blogPosts, { page: "999" })
    expect(clamped.page).toBe(clamped.totalPages)

    const negative = resolveBlogView(blogPosts, { page: "-1" })
    expect(negative.page).toBe(1)
  })

  it("searches titles, excerpts, and categories while ignoring invalid categories", () => {
    const milan = resolveBlogView(blogPosts, { q: "milan" })
    expect(milan.searchQuery).toBe("milan")
    expect(milan.totalCount).toBeGreaterThanOrEqual(1)
    expect(milan.posts.every((post) =>
      `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes("milan")
    )).toBe(true)

    const invalid = resolveBlogView(blogPosts, { category: "nonexistent" })
    expect(invalid.activeCategory).toBeUndefined()
    expect(invalid.totalCount).toBe(24)

    const empty = resolveBlogView(blogPosts, { q: "zzz-no-such-story" })
    expect(empty.totalCount).toBe(0)
    expect(empty.visibleStart).toBe(0)
    expect(empty.visibleEnd).toBe(0)
  })

  it("builds clean blog URLs that preserve active filters", () => {
    expect(blogHref({}, {})).toBe("/blog")
    expect(blogHref({ page: 1 }, { page: 2 })).toBe("/blog?page=2")
    expect(
      blogHref({ searchQuery: "linen", activeCategory: "Handmade", page: 3 }, { page: 2 })
    ).toBe("/blog?q=linen&category=handmade&page=2")
    expect(blogHref({ searchQuery: "linen" }, { q: null, page: 1 })).toBe("/blog")
  })
})

describe("BlogPage", () => {
  it("renders the editorial feed, sidebar widgets, and pagination in one main landmark", async () => {
    const { container } = render(await BlogPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
    expect(screen.getByRole("heading", { name: "Blog", level: 1 })).toBeInTheDocument()
    const main = screen.getByRole("main")
    expect(within(main).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")

    const articles = screen.getAllByRole("article")
    expect(articles).toHaveLength(3)
    expect(screen.getByRole("heading", { name: "Going all-in with millennial design", level: 2 })).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: /Read more about/ })).toHaveLength(3)

    const times = container.querySelectorAll("article time")
    expect(times.length).toBe(3)
    times.forEach((time) => {
      expect(time.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    expect(screen.getByRole("searchbox", { name: "Search blog posts" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Categories", level: 3 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Recent Posts", level: 3 })).toBeInTheDocument()
    const sidebar = screen.getByRole("complementary", { name: "Blog sidebar" })
    expect(within(sidebar).getByRole("link", { name: "Wood 6 articles" })).toHaveAttribute("href", "/blog?category=wood")

    const pagination = screen.getByRole("navigation", { name: "Blog pagination" })
    expect(within(pagination).getByRole("link", { name: "Page 1, current page" })).toHaveAttribute("aria-current", "page")
    expect(within(pagination).getByRole("link", { name: "Go to next page" })).toHaveAttribute("href", "/blog?page=2")
    expect(await checkA11y(container)).toEqual([])
  })

  it("announces active category filters and marks the category current", async () => {
    const { container } = render(await BlogPage({ searchParams: Promise.resolve({ category: "wood" }) }))
    const status = screen.getByRole("status")
    expect(status).toHaveTextContent(/Showing 6 articles in/)
    expect(within(status).getByText("Wood")).toBeInTheDocument()
    expect(within(status).getByRole("link", { name: "Clear filter" })).toHaveAttribute("href", "/blog")
    expect(screen.getByRole("link", { name: "Wood 6 articles" })).toHaveAttribute("aria-current", "page")
    expect(screen.getAllByRole("article")).toHaveLength(3)
    expect(await checkA11y(container)).toEqual([])
  })

  it("renders a recoverable empty state with no pagination for unmatched searches", async () => {
    const { container } = render(await BlogPage({ searchParams: Promise.resolve({ q: "zzz-no-such-story" }) }))
    expect(screen.getByText("No articles found")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "View all articles" })).toHaveAttribute("href", "/blog")
    expect(screen.queryByRole("navigation", { name: "Blog pagination" })).not.toBeInTheDocument()
    expect(await checkA11y(container)).toEqual([])
  })
})
