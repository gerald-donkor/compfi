import type { CatalogProduct, ProductCategory } from "@/types/commerce"

const productCategories = new Set<ProductCategory>(["dining", "living", "bedroom"])

export function assertCatalogProduct(product: CatalogProduct): void {
  if (
    !product.id ||
    !product.slug ||
    !product.name ||
    !product.description ||
    !product.detailDescription.trim()
  ) {
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

  if (product.gallery.length !== 3) {
    throw new Error(`Catalog product ${product.id} requires exactly three gallery views`)
  }

  const mediaPaths = new Set<string>()
  const mediaAlts = new Set<string>()
  for (const media of product.gallery) {
    const alt = media.alt.trim()
    if (
      !media.path.startsWith("/images/") ||
      !media.path.endsWith(".webp") ||
      !alt ||
      /^image of\b/i.test(alt) ||
      !Number.isSafeInteger(media.width) ||
      !Number.isSafeInteger(media.height) ||
      media.width <= 0 ||
      media.height <= 0 ||
      mediaPaths.has(media.path) ||
      mediaAlts.has(alt.toLocaleLowerCase("en-US"))
    ) {
      throw new Error(`Catalog product ${product.id} has invalid gallery metadata`)
    }
    mediaPaths.add(media.path)
    mediaAlts.add(alt.toLocaleLowerCase("en-US"))
  }

  if (
    product.gallery[0].path !== product.media.path ||
    product.gallery[0].alt !== product.media.alt ||
    product.gallery[0].width !== product.media.width ||
    product.gallery[0].height !== product.media.height ||
    product.gallery[0].focalPosition !== product.media.focalPosition
  ) {
    throw new Error(`Catalog product ${product.id} lead media must match its first gallery view`)
  }

  for (const [options, defaultValue, label] of [
    [product.sizes, product.defaultSize, "size"],
    [product.finishes, product.defaultFinish, "finish"],
  ] as const) {
    if (!options) {
      if (defaultValue !== undefined) {
        throw new Error(`Catalog product ${product.id} has a default ${label} without options`)
      }
      continue
    }
    if (options.length === 0) {
      throw new Error(`Catalog product ${product.id} has an empty ${label} option set`)
    }
    const values = new Set<string>()
    for (const option of options) {
      if (!option.value.trim() || !option.label.trim() || values.has(option.value)) {
        throw new Error(`Catalog product ${product.id} has invalid ${label} options`)
      }
      values.add(option.value)
    }
    if (!defaultValue || !values.has(defaultValue)) {
      throw new Error(`Catalog product ${product.id} needs a valid default ${label}`)
    }
  }
}

function createCatalogProduct(product: CatalogProduct): CatalogProduct {
  assertCatalogProduct(product)
  const [lead, alternate, detail] = product.gallery

  return Object.freeze({
    ...product,
    media: Object.freeze({ ...product.media }),
    gallery: Object.freeze([
      Object.freeze({ ...lead }),
      Object.freeze({ ...alternate }),
      Object.freeze({ ...detail }),
    ] as const),
    sizes: product.sizes
      ? Object.freeze(product.sizes.map((option) => Object.freeze({ ...option })))
      : undefined,
    finishes: product.finishes
      ? Object.freeze(product.finishes.map((option) => Object.freeze({ ...option })))
      : undefined,
  })
}

const detailMedia = (
  lead: CatalogProduct["media"],
  slug: string,
  name: string
): CatalogProduct["gallery"] => [
  lead,
  {
    path: `/images/catalog/detail/${slug}-three-quarter.webp`,
    alt: `${name} from a front three-quarter view`,
    width: 1536,
    height: 1024,
  },
  {
    path: `/images/catalog/detail/${slug}-detail.webp`,
    alt: `${name} material and form detail`,
    width: 1536,
    height: 1024,
  },
]

const oakFinishes = Object.freeze([
  { value: "natural-oak", label: "Natural oak", color: "#cba777" },
  { value: "warm-oak", label: "Warm oak", color: "#9b7046" },
])

const upholsteryFinishes = Object.freeze([
  { value: "oatmeal", label: "Oatmeal", color: "#c9bba8" },
  { value: "warm-sand", label: "Warm sand", color: "#ad9275" },
])

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
    detailDescription: "A gently curved oak back frames the woven seat, while rounded rails keep the chair's profile quiet and open.",
    gallery: detailMedia({ path: "/images/catalog/alder-dining-chair.webp", alt: "Pale oak dining chair with a woven natural-fiber seat", width: 1120, height: 1400 }, "alder-dining-chair", "Alder Dining Chair"),
    finishes: oakFinishes,
    defaultFinish: "natural-oak",
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
    detailDescription: "A round oak top meets a tapered pedestal base in a compact silhouette designed around simple, uninterrupted lines.",
    gallery: detailMedia({ path: "/images/catalog/morrow-dining-table.webp", alt: "Round pale oak pedestal dining table", width: 1120, height: 1400 }, "morrow-dining-table", "Morrow Dining Table"),
    finishes: oakFinishes,
    defaultFinish: "natural-oak",
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
    detailDescription: "The Sora's rounded back and arms wrap around one broad seat, set above a low circular oak base.",
    gallery: detailMedia({ path: "/images/catalog/sora-lounge-chair.webp", alt: "Rounded oatmeal linen lounge chair with a pale oak base", width: 1120, height: 1400 }, "sora-lounge-chair", "Sora Lounge Chair"),
    finishes: upholsteryFinishes,
    defaultFinish: "oatmeal",
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
    detailDescription: "Three relaxed back cushions and a left chaise define this warm-sand linen sectional's low, generous shape.",
    gallery: detailMedia({ path: "/images/catalog/haven-sectional.webp", alt: "Warm-sand linen sectional sofa with a left chaise", width: 1120, height: 1400 }, "haven-sectional", "Haven Sectional"),
    finishes: upholsteryFinishes,
    defaultFinish: "warm-sand",
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
    detailDescription: "A broad rounded headboard and softly upholstered frame give the Atlas Bed a continuous, calm outline.",
    gallery: detailMedia({ path: "/images/catalog/atlas-bed.webp", alt: "Warm-ivory upholstered bed with a rounded headboard", width: 1120, height: 1400 }, "atlas-bed", "Atlas Bed"),
    sizes: Object.freeze([
      { value: "full", label: "Full" },
      { value: "queen", label: "Queen" },
      { value: "king", label: "King" },
    ]),
    defaultSize: "queen",
    finishes: upholsteryFinishes,
    defaultFinish: "oatmeal",
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
    detailDescription: "Rounded oak uprights frame a flush drawer and open lower shelf in this compact bedside form.",
    gallery: detailMedia({ path: "/images/catalog/rowan-nightstand.webp", alt: "Pale oak bedside table with a drawer and open lower shelf", width: 1120, height: 1400 }, "rowan-nightstand", "Rowan Nightstand"),
    finishes: oakFinishes,
    defaultFinish: "natural-oak",
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
    detailDescription: "A slim upholstered box sits on a pale oak base, with a fine seam tracing the discreet lift-up seat.",
    gallery: detailMedia({ path: "/images/catalog/fenn-storage-bench.webp", alt: "Oatmeal upholstered bench with a pale oak base", width: 1120, height: 1400 }, "fenn-storage-bench", "Fenn Storage Bench"),
    finishes: upholsteryFinishes,
    defaultFinish: "oatmeal",
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
    detailDescription: "Fine vertical slats run across the low oak case, softened by rounded ends and slender legs.",
    gallery: detailMedia({ path: "/images/catalog/cove-media-console.webp", alt: "Low pale oak media console with rounded slatted doors", width: 1120, height: 1400 }, "cove-media-console", "Cove Media Console"),
    finishes: oakFinishes,
    defaultFinish: "natural-oak",
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

export function getRelatedCatalogProducts(
  product: CatalogProduct,
  limit = 4
): readonly CatalogProduct[] {
  const safeLimit = Number.isSafeInteger(limit) ? Math.max(0, limit) : 0
  const related = [
    ...catalogProducts.filter(
      (candidate) => candidate.id !== product.id && candidate.category === product.category
    ),
    ...catalogProducts.filter(
      (candidate) => candidate.id !== product.id && candidate.category !== product.category
    ),
  ].slice(0, safeLimit)

  return Object.freeze(related)
}
