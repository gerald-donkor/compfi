import { blogPosts } from "@/lib/blog"
import { catalogProducts } from "@/lib/catalog"
import { formatMoney } from "@/lib/money"

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

interface SearchableEntity {
  name: string
  category: string
  categoryAlt?: string
  description?: string
  detail?: string
}

function scoreEntity(
  entity: SearchableEntity,
  query: string,
  terms: string[]
): number {
  const name = normalize(entity.name)
  const category = normalize(entity.category)
  const categoryAlt = entity.categoryAlt ? normalize(entity.categoryAlt) : ""
  const description = entity.description ? normalize(entity.description) : ""
  const detail = entity.detail ? normalize(entity.detail) : ""

  if (name === query) return 100
  if (name.startsWith(query)) return 80
  if (name.includes(query)) return 60
  if (category.includes(query) || (categoryAlt && categoryAlt.includes(query))) return 50

  let score = 0
  let matchedTerms = 0

  for (const term of terms) {
    if (name.includes(term)) {
      score += 25
      matchedTerms++
    } else if (category.includes(term) || (categoryAlt && categoryAlt.includes(term))) {
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

function rankEntities<T>(
  items: readonly T[],
  toEntity: (item: T) => SearchableEntity,
  query: string,
  terms: string[]
): T[] {
  const scored: { item: T; score: number }[] = []
  for (const item of items) {
    const score = scoreEntity(toEntity(item), query, terms)
    if (score > 0) {
      scored.push({ item, score })
    }
  }
  scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.item)
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

  const rankedProducts = rankEntities(
    catalogProducts,
    (product) => ({
      name: product.name,
      category: product.category,
      categoryAlt: categoryDisplayMap[product.category],
      description: product.description,
      detail: product.detailDescription,
    }),
    query,
    terms
  )

  const productResults: SearchResultItem[] = rankedProducts.map((product) => ({
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

  const rankedArticles = rankEntities(
    blogPosts,
    (post) => ({
      name: post.title,
      category: post.category,
      description: post.excerpt,
      detail: post.author,
    }),
    query,
    terms
  )

  const articleResults: SearchResultItem[] = rankedArticles.map((post) => ({
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
