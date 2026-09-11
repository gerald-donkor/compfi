import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import NotFound from "@/app/not-found"
import { metadata as layoutMetadata } from "@/app/layout"
import { metadata as homeMetadata } from "@/app/page"
import { metadata as shopMetadata } from "@/app/shop/page"
import { metadata as cartMetadata } from "@/app/cart/page"
import { metadata as checkoutMetadata } from "@/app/checkout/page"
import { metadata as comparisonMetadata } from "@/app/comparison/page"
import { metadata as contactMetadata } from "@/app/contact/page"
import { metadata as blogMetadata } from "@/app/blog/page"
import { generateMetadata as generateProductMetadata } from "@/app/shop/[slug]/page"
import { SiteHeader } from "@/components/chrome/site-header"
import { SiteFooter } from "@/components/chrome/site-footer"
import { CartProvider } from "@/components/cart/cart-provider"
import { catalogProducts } from "@/lib/catalog"
import { checkA11y } from "./a11y"

vi.mock("next/font/local", () => ({
  default: () => ({
    variable: "--font-poppins",
    style: { fontFamily: "Poppins" },
  }),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  notFound: vi.fn(),
}))

describe("Phase 8 - SEO, Metadata, and A11y Audit", () => {
  describe("Robots configuration (app/robots.ts)", () => {
    it("exports valid robots exclusion rules with sitemap link", () => {
      const result = robots()
      expect(result).toBeDefined()
      expect(result.rules).toBeDefined()
      
      const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules
      expect(rules.userAgent).toBe("*")
      expect(rules.allow).toBe("/")
      expect(rules.disallow).toBe("/account")
      expect(result.sitemap).toMatch(/https:\/\/.*\/sitemap\.xml/)
    })
  })

  describe("Sitemap generation (app/sitemap.ts)", () => {
    it("generates sitemap entries for all static routes and catalog products", () => {
      const result = sitemap()
      expect(Array.isArray(result)).toBe(true)

      const urls = result.map((entry) => entry.url)

      // Static routes
      expect(urls.some((u) => u.endsWith("compfi.com") || u.endsWith("compfi.com/"))).toBe(true)
      expect(urls.some((u) => u.endsWith("/shop"))).toBe(true)
      expect(urls.some((u) => u.endsWith("/cart"))).toBe(true)
      expect(urls.some((u) => u.endsWith("/checkout"))).toBe(true)
      expect(urls.some((u) => u.endsWith("/contact"))).toBe(true)
      expect(urls.some((u) => u.endsWith("/blog"))).toBe(true)
      expect(urls.some((u) => u.endsWith("/comparison"))).toBe(true)

      // Dynamic catalog product routes
      for (const product of catalogProducts) {
        expect(urls.some((u) => u.endsWith(`/shop/${product.slug}`))).toBe(true)
      }

      // Check entry properties
      for (const entry of result) {
        expect(entry.url).toBeDefined()
        expect(entry.lastModified).toBeInstanceOf(Date)
        expect((entry.lastModified as Date).toISOString()).toBe("2026-09-11T00:00:00.000Z")
        expect(["daily", "weekly", "monthly", "yearly"]).toContain(entry.changeFrequency)
        expect(entry.priority).toBeGreaterThanOrEqual(0)
        expect(entry.priority).toBeLessThanOrEqual(1)
      }
    })
  })

  describe("Branded 404 page (app/not-found.tsx)", () => {
    it("renders branded PageHero, recovery message, and navigation links", async () => {
      const { container } = render(<NotFound />)

      expect(screen.getByRole("heading", { name: /404/i })).toBeInTheDocument()
      expect(screen.getByText(/We couldn't find the page you're looking for/i)).toBeInTheDocument()

      const browseLink = screen.getByRole("link", { name: "Browse furniture" })
      expect(browseLink).toHaveAttribute("href", "/shop")

      const homeLink = screen.getByRole("link", { name: "Return home" })
      expect(homeLink).toHaveAttribute("href", "/")

      const violations = await checkA11y(container)
      expect(violations).toEqual([])
    })
  })

  describe("Metadata consistency across routes", () => {
    it("defines root layout metadata with siteName, Open Graph, and Twitter cards", () => {
      expect(layoutMetadata.title).toEqual({
        default: "Compfi",
        template: "%s | Compfi",
      })
      expect(layoutMetadata.description).toBe("Furniture and home furnishings, thoughtfully presented.")
      expect(layoutMetadata.openGraph).toMatchObject({
        title: "Compfi",
        siteName: "Compfi",
        locale: "en_US",
      })
      expect(layoutMetadata.twitter).toMatchObject({
        card: "summary_large_image",
        title: "Compfi",
      })
    })

    it("exports consistent titles, descriptions, and canonical URLs for all static routes", () => {
      expect(homeMetadata.title).toBe("Home")
      expect(homeMetadata.alternates?.canonical).toBe("/")

      expect(shopMetadata.title).toBe("Shop")
      expect(shopMetadata.alternates?.canonical).toBe("/shop")

      expect(cartMetadata.title).toBe("Cart")
      expect(cartMetadata.alternates?.canonical).toBe("/cart")

      expect(checkoutMetadata.title).toBe("Checkout")
      expect(checkoutMetadata.alternates?.canonical).toBe("/checkout")

      expect(comparisonMetadata.title).toBe("Product comparison")
      expect(comparisonMetadata.alternates?.canonical).toBe("/comparison")

      expect(contactMetadata.title).toBe("Contact")
      expect(contactMetadata.alternates?.canonical).toBe("/contact")

      expect(blogMetadata.title).toBe("Blog")
      expect(blogMetadata.alternates?.canonical).toBe("/blog")
    })

    it("generates dynamic product metadata for valid and invalid slugs", async () => {
      const validMeta = await generateProductMetadata({
        params: Promise.resolve({ slug: "alder-dining-chair" }),
      })
      expect(validMeta.title).toBe("Alder Dining Chair")
      expect(validMeta.description).toBeDefined()
      expect(validMeta.alternates?.canonical).toBe("/shop/alder-dining-chair")
      expect(validMeta.openGraph).toBeDefined()

      const invalidMeta = await generateProductMetadata({
        params: Promise.resolve({ slug: "non-existent-furniture" }),
      })
      expect(invalidMeta.title).toBe("Product not found")
      expect(invalidMeta.robots).toEqual({ index: false, follow: false })
    })
  })

  describe("Chrome shell accessibility (SiteHeader and SiteFooter)", () => {
    it("renders SiteHeader with 0 axe violations", async () => {
      const { container } = render(
        <CartProvider>
          <SiteHeader />
        </CartProvider>
      )
      const violations = await checkA11y(container)
      expect(violations).toEqual([])
    })

    it("renders SiteFooter with 0 axe violations", async () => {
      const { container } = render(<SiteFooter />)
      const violations = await checkA11y(container)
      expect(violations).toEqual([])
    })
  })
})
