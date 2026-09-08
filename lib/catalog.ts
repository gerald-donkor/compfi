import type { CatalogProduct, ProductCategory } from "@/types/commerce"

const productCategories = new Set<ProductCategory>(["dining", "living", "bedroom"])

function assertCatalogProduct(product: CatalogProduct): void {
  if (!product.id || !product.slug || !product.name || !product.description) {
    throw new Error(`Catalog product ${product.id || "(missing id)"} requires display copy`)
  }

  if (!productCategories.has(product.category)) {
    throw new Error(`Catalog product ${product.id} has an unsupported category`)
  }

  for (const amount of [product.priceCents, product.compareAtPriceCents]) {
    if (amount !== undefined && (!Number.isSafeInteger(amount) || amount < 0)) {
      throw new Error(`Catalog product ${product.id} has an invalid USD-cent price`)
    }
  }

  if (
    product.compareAtPriceCents !== undefined &&
    product.compareAtPriceCents <= product.priceCents
  ) {
    throw new Error(`Catalog product ${product.id} needs a higher compare-at price`)
  }

  const alt = product.media.alt.trim()

  if (
    !product.media.path.startsWith("/images/") ||
    !alt ||
    /^image of\b/i.test(alt) ||
    alt.toLocaleLowerCase("en-US") === product.name.trim().toLocaleLowerCase("en-US") ||
    !Number.isSafeInteger(product.media.width) ||
    !Number.isSafeInteger(product.media.height) ||
    product.media.width <= 0 ||
    product.media.height <= 0
  ) {
    throw new Error(`Catalog product ${product.id} has invalid media metadata`)
  }
}

function createCatalogProduct(product: CatalogProduct): CatalogProduct {
  assertCatalogProduct(product)
  return Object.freeze({ ...product, media: Object.freeze({ ...product.media }) })
}

const catalogFixtureRecords: readonly CatalogProduct[] = [
  {
    id: "alder-dining-chair",
    slug: "alder-dining-chair",
    name: "Alder Dining Chair",
    category: "dining",
    description: "A curved oak dining chair with a woven natural-fiber seat.",
    priceCents: 32900,
    media: {
      path: "/images/catalog/alder-dining-chair.webp",
      alt: "Pale oak dining chair with a woven natural-fiber seat",
      width: 1120,
      height: 1400,
    },
  },
  {
    id: "morrow-dining-table",
    slug: "morrow-dining-table",
    name: "Morrow Dining Table",
    category: "dining",
    description: "A compact round oak pedestal table for easy gatherings.",
    priceCents: 84900,
    compareAtPriceCents: 99900,
    badge: "sale",
    media: {
      path: "/images/catalog/morrow-dining-table.webp",
      alt: "Round pale oak pedestal dining table",
      width: 1120,
      height: 1400,
    },
  },
  {
    id: "sora-lounge-chair",
    slug: "sora-lounge-chair",
    name: "Sora Lounge Chair",
    category: "living",
    description: "An enveloping linen lounge chair grounded by an oak base.",
    priceCents: 72900,
    media: {
      path: "/images/catalog/sora-lounge-chair.webp",
      alt: "Rounded oatmeal linen lounge chair with a pale oak base",
      width: 1120,
      height: 1400,
    },
  },
  {
    id: "haven-sectional",
    slug: "haven-sectional",
    name: "Haven Sectional",
    category: "living",
    description: "A warm-sand linen sectional with a relaxed left chaise.",
    priceCents: 189900,
    badge: "new",
    media: {
      path: "/images/catalog/haven-sectional.webp",
      alt: "Warm-sand linen sectional sofa with a left chaise",
      width: 1120,
      height: 1400,
    },
  },
  {
    id: "atlas-bed",
    slug: "atlas-bed",
    name: "Atlas Bed",
    category: "bedroom",
    description: "A softly upholstered bed with a broad rounded headboard.",
    priceCents: 159900,
    media: {
      path: "/images/catalog/atlas-bed.webp",
      alt: "Warm-ivory upholstered bed with a rounded headboard",
      width: 1120,
      height: 1400,
    },
  },
  {
    id: "rowan-nightstand",
    slug: "rowan-nightstand",
    name: "Rowan Nightstand",
    category: "bedroom",
    description: "A rounded oak nightstand with a drawer and open shelf.",
    priceCents: 44900,
    media: {
      path: "/images/catalog/rowan-nightstand.webp",
      alt: "Pale oak bedside table with a drawer and open lower shelf",
      width: 1120,
      height: 1400,
    },
  },
  {
    id: "fenn-storage-bench",
    slug: "fenn-storage-bench",
    name: "Fenn Storage Bench",
    category: "bedroom",
    description: "A slim upholstered bench with discreet under-seat storage.",
    priceCents: 59900,
    badge: "new",
    media: {
      path: "/images/catalog/fenn-storage-bench.webp",
      alt: "Oatmeal upholstered bench with a pale oak base",
      width: 1120,
      height: 1400,
    },
  },
  {
    id: "cove-media-console",
    slug: "cove-media-console",
    name: "Cove Media Console",
    category: "living",
    description: "A low oak console with softly rounded slatted doors.",
    priceCents: 97900,
    compareAtPriceCents: 114900,
    badge: "sale",
    media: {
      path: "/images/catalog/cove-media-console.webp",
      alt: "Low pale oak media console with rounded slatted doors",
      width: 1120,
      height: 1400,
    },
  },
]

const uniqueIds = new Set<string>()
const uniqueSlugs = new Set<string>()

for (const product of catalogFixtureRecords) {
  assertCatalogProduct(product)
  if (uniqueIds.has(product.id) || uniqueSlugs.has(product.slug)) {
    throw new Error(`Catalog product ${product.id} has a duplicate id or slug`)
  }
  uniqueIds.add(product.id)
  uniqueSlugs.add(product.slug)
}

export const catalogProducts: readonly CatalogProduct[] = Object.freeze(
  catalogFixtureRecords.map(createCatalogProduct)
)

export function getCatalogProductBySlug(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug)
}

export function getCatalogProductsByCategory(
  category: ProductCategory
): readonly CatalogProduct[] {
  return Object.freeze(
    catalogProducts.filter((product) => product.category === category)
  )
}
