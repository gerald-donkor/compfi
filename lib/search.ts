import { blogPosts, type BlogPost } from "@/lib/blog"
import { catalogProducts } from "@/lib/catalog"
import { formatMoney } from "@/lib/money"
import type { CatalogProduct } from "@/types/commerce"

export interface SearchResultItem {
  type: "product" | "article"
  id: string
  title: string
  subtitle: string
  href: string
  imageSrc: string
  imageAlt: string
  badge?: string
  priceFormatted?: string
}

export interface SearchResults {
  products: SearchResultItem[]
  articles: SearchResultItem[]
  totalCount: number
}

function normalize(text: string): string {
  return text.toLowerCase().trim()
}

const categoryDisplayMap: Record<string, string> = {
  dining: "Dining Room",
  living: "Living Room",
  bedroom: "Bedroom",
}

function scoreProduct(product: CatalogProduct, query: string, terms: string[]): number {
  const name = normalize(product.name)
  const category = normalize(product.category)
  const categoryDisplay = normalize(categoryDisplayMap[product.category] || "")
  const description = normalize(product.description)
  const detail = normalize(product.detailDescription)

  if (name === query) return 100
  if (name.startsWith(query)) return 80
  if (name.includes(query)) return 60
  if (category.includes(query) || categoryDisplay.includes(query)) return 50

  let score = 0
  let matchedTerms = 0

  for (const term of terms) {
    if (name.includes(term)) {
      score += 25
      matchedTerms++
    } else if (category.includes(term) || categoryDisplay.includes(term)) {
      score += 20
      matchedTerms++
    } else if (description.includes(term)) {
      score += 10
      matchedTerms++
    } else if (detail.includes(term)) {
      score += 5
      matchedTerms++
    }
  }

  return matchedTerms > 0 ? score : 0
}

function scoreArticle(post: BlogPost, query: string, terms: string[]): number {
  const title = normalize(post.title)
  const category = normalize(post.category)
  const excerpt = normalize(post.excerpt)
  const author = normalize(post.author)

  if (title === query) return 100
  if (title.startsWith(query)) return 80
  if (title.includes(query)) return 60
  if (category.includes(query)) return 50

  let score = 0
  let matchedTerms = 0

  for (const term of terms) {
    if (title.includes(term)) {
      score += 25
      matchedTerms++
    } else if (category.includes(term)) {
      score += 20
      matchedTerms++
    } else if (excerpt.includes(term)) {
      score += 10
      matchedTerms++
    } else if (author.includes(term)) {
      score += 5
      matchedTerms++
    }
  }

  return matchedTerms > 0 ? score : 0
}

export function searchStorefront(rawQuery: string): SearchResults {
  const trimmed = rawQuery.trim().slice(0, 100)
  if (!trimmed) {
    return { products: [], articles: [], totalCount: 0 }
  }

  const query = normalize(trimmed)
  const terms = query
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)

  if (terms.length === 0) {
    return { products: [], articles: [], totalCount: 0 }
  }

  const scoredProducts: { product: CatalogProduct; score: number }[] = []
  for (const product of catalogProducts) {
    const score = scoreProduct(product, query, terms)
    if (score > 0) {
      scoredProducts.push({ product, score })
    }
  }
  scoredProducts.sort((a, b) => b.score - a.score)

  const productResults: SearchResultItem[] = scoredProducts.map(({ product }) => ({
    type: "product",
    id: product.id,
    title: product.name,
    subtitle: product.description,
    href: `/shop/${product.slug}`,
    imageSrc: product.media.path,
    imageAlt: product.media.alt,
    badge: categoryDisplayMap[product.category] || product.category,
    priceFormatted: formatMoney(product.priceCents),
  }))

  const scoredArticles: { post: BlogPost; score: number }[] = []
  for (const post of blogPosts) {
    const score = scoreArticle(post, query, terms)
    if (score > 0) {
      scoredArticles.push({ post, score })
    }
  }
  scoredArticles.sort((a, b) => b.score - a.score)

  const articleResults: SearchResultItem[] = scoredArticles.map(({ post }) => ({
    type: "article",
    id: post.id,
    title: post.title,
    subtitle: post.date,
    href: `/blog#${post.slug}`,
    imageSrc: post.thumbnail || post.image,
    imageAlt: post.imageAlt,
    badge: post.category,
  }))

  return {
    products: productResults,
    articles: articleResults,
    totalCount: productResults.length + articleResults.length,
  }
}
