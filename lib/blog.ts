export const blogCategories = [
  "Crafts",
  "Design",
  "Handmade",
  "Interior",
  "Wood",
] as const

export type BlogCategory = (typeof blogCategories)[number]

export type BlogAuthor = string

export interface BlogPost {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly category: BlogCategory
  readonly author: BlogAuthor
  readonly date: string
  readonly dateTime: string
  readonly excerpt: string
  readonly image: string
  readonly thumbnail: string
  readonly imageAlt: string
}

export interface BlogCategoryCount {
  readonly name: BlogCategory
  readonly count: number
  readonly slug: string
}

export type BlogQuery = Record<string, string | string[] | undefined>

export interface BlogViewModel {
  readonly posts: readonly BlogPost[]
  readonly visiblePosts: readonly BlogPost[]
  readonly recentPosts: readonly BlogPost[]
  readonly categories: readonly BlogCategoryCount[]
  readonly activeCategory?: BlogCategory
  readonly searchQuery?: string
  readonly totalCount: number
  readonly totalPages: number
  readonly page: number
  readonly pageSize: number
  readonly visibleStart: number
  readonly visibleEnd: number
}

export const BLOG_PAGE_SIZE = 3

// All imagery below reuses honest Compfi editorial originals already shipped
// under public/images/home/editorial/. The reference mockup's photographic
// crops are unknown-provenance and are never shipped; card and thumbnail
// frames crop these originals with CSS object-cover at the measured
// 817x500 lead and 80x80 thumbnail geometry instead.
export const blogPosts: readonly BlogPost[] = Object.freeze([
  {
    id: "blog-1",
    slug: "going-all-in-with-millennial-design",
    title: "Going all-in with millennial design",
    category: "Wood",
    author: "Admin",
    date: "12 Sep 2026",
    dateTime: "2026-09-12",
    excerpt:
      "Exploring architectural warm wood tones, organic curves, and practical silhouettes that bridge mid-century craft with contemporary apartment living.",
    image: "/images/home/editorial/quiet-workspace.webp",
    thumbnail: "/images/home/editorial/quiet-workspace.webp",
    imageAlt: "Warm oak work desk with notebook, ceramic mug, and daylight",
  },
  {
    id: "blog-2",
    slug: "exploring-new-ways-of-decorating",
    title: "Exploring new ways of decorating",
    category: "Handmade",
    author: "Admin",
    date: "12 Sep 2026",
    dateTime: "2026-09-12",
    excerpt:
      "A guide to layered textiles, hand-thrown ceramics, and tactile surfaces that introduce quiet personality into open-plan living rooms.",
    image: "/images/home/editorial/softly-grounded.webp",
    thumbnail: "/images/home/editorial/softly-grounded.webp",
    imageAlt: "Layered linen throws and cushions arranged on an upholstered bench",
  },
  {
    id: "blog-3",
    slug: "handmade-pieces-that-took-time-to-make",
    title: "Handmade pieces that took time to make",
    category: "Wood",
    author: "Admin",
    date: "12 Sep 2026",
    dateTime: "2026-09-12",
    excerpt:
      "Appreciating slow joinery, hand-planed edges, and sustainable timber finishes designed to age with dignity across decades of daily use.",
    image: "/images/home/editorial/oak-tables.webp",
    thumbnail: "/images/home/editorial/oak-tables.webp",
    imageAlt: "Detailed wood joinery on an artisan oak table",
  },
  {
    id: "blog-4",
    slug: "modern-home-in-milan",
    title: "Modern home in Milan",
    category: "Design",
    author: "Admin",
    date: "03 Sep 2026",
    dateTime: "2026-09-03",
    excerpt:
      "Inside an understated Milanese apartment where minimalist walnut cabinetry meets Italian stone and bespoke linen furnishings.",
    image: "/images/home/editorial/room-to-gather.webp",
    thumbnail: "/images/home/editorial/room-to-gather.webp",
    imageAlt: "Minimalist living room with clean architectural lines and walnut furniture",
  },
  {
    id: "blog-5",
    slug: "colorful-office-redesign",
    title: "Colorful office redesign",
    category: "Design",
    author: "Admin",
    date: "03 Sep 2026",
    dateTime: "2026-09-03",
    excerpt:
      "Balancing energizing color accents with grounding solid oak desks for a focused, inspiring home work environment.",
    image: "/images/home/editorial/sunlit-dining-corner.webp",
    thumbnail: "/images/home/editorial/sunlit-dining-corner.webp",
    imageAlt: "Sunlit solid oak table styled as a daylight home work corner",
  },
  // Additional articles ensuring reference counts: Crafts: 2, Design: 8, Handmade: 7, Interior: 1, Wood: 6 (Total: 24)
  {
    id: "blog-6",
    slug: "ceramic-vessels-and-form",
    title: "Ceramic vessels and sculptural form",
    category: "Crafts",
    author: "Admin",
    date: "28 Aug 2026",
    dateTime: "2026-08-28",
    excerpt:
      "How artisan potters shape terracotta and stoneware vessels that double as standalone sculptures on dining consoles.",
    image: "/images/home/editorial/art-vase.webp",
    thumbnail: "/images/home/editorial/art-vase.webp",
    imageAlt: "Handmade ceramic vase on an oak tabletop",
  },
  {
    id: "blog-7",
    slug: "weaving-natural-fibers-at-home",
    title: "Weaving natural fibers into modern interiors",
    category: "Crafts",
    author: "Admin",
    date: "15 Aug 2026",
    dateTime: "2026-08-15",
    excerpt:
      "From jute runners to cane chair inserts, integrating woven fiber crafts creates tactile warmth in sunlit living spaces.",
    image: "/images/home/editorial/open-shelving.webp",
    thumbnail: "/images/home/editorial/open-shelving.webp",
    imageAlt: "Woven fiber accents displayed on open shelving",
  },
  {
    id: "blog-8",
    slug: "scandinavian-simplicity-in-the-bedroom",
    title: "Scandinavian simplicity in the bedroom",
    category: "Design",
    author: "Admin",
    date: "10 Aug 2026",
    dateTime: "2026-08-10",
    excerpt:
      "Principles of Nordic bedroom layouts: low-profile timber frames, breathable flax sheets, and uncluttered morning sightlines.",
    image: "/images/home/editorial/upholstered-bedroom.webp",
    thumbnail: "/images/home/editorial/upholstered-bedroom.webp",
    imageAlt: "Calm Scandinavian bedroom with natural light and linen bedding",
  },
  {
    id: "blog-9",
    slug: "architectural-lighting-for-dining-spaces",
    title: "Architectural lighting for dining spaces",
    category: "Design",
    author: "Admin",
    date: "02 Aug 2026",
    dateTime: "2026-08-02",
    excerpt:
      "Selecting pendants, dimmers, and diffused spotlights that highlight natural wood grain without harsh glare during dinner.",
    image: "/images/home/editorial/dining-nook.webp",
    thumbnail: "/images/home/editorial/dining-nook.webp",
    imageAlt: "Warm pendant light suspended above an oak dining table",
  },
  {
    id: "blog-10",
    slug: "curating-a-quiet-workspace",
    title: "Curating a quiet workspace",
    category: "Design",
    author: "Admin",
    date: "24 Jul 2026",
    dateTime: "2026-07-24",
    excerpt:
      "Organizing study spaces with concealed cord channels, tactile desk pads, and ergonomic solid wood seating for sustained deep focus.",
    image: "/images/home/editorial/quiet-workspace.webp",
    thumbnail: "/images/home/editorial/quiet-workspace.webp",
    imageAlt: "Minimal study corner with desk, plant, and wooden shelving",
  },
  {
    id: "blog-11",
    slug: "the-art-of-the-lounge-chair",
    title: "The art of the lounge chair",
    category: "Design",
    author: "Admin",
    date: "18 Jul 2026",
    dateTime: "2026-07-18",
    excerpt:
      "Why statement occasional chairs define the emotional center of a living room through balance, pitch, and upholstery choice.",
    image: "/images/home/editorial/vintage-lounge-chair.webp",
    thumbnail: "/images/home/editorial/vintage-lounge-chair.webp",
    imageAlt: "Upholstered accent lounge chair in an airy corner",
  },
  {
    id: "blog-12",
    slug: "kitchen-shelving-and-daily-rituals",
    title: "Kitchen shelving and daily rituals",
    category: "Design",
    author: "Admin",
    date: "09 Jul 2026",
    dateTime: "2026-07-09",
    excerpt:
      "Open timber shelves transform everyday glassware, oil cruets, and morning coffee tools into practical, intentional decor.",
    image: "/images/home/editorial/kitchen-shelf.webp",
    thumbnail: "/images/home/editorial/kitchen-shelf.webp",
    imageAlt: "Open kitchen shelving with ceramic mugs and wooden bowls",
  },
  {
    id: "blog-13",
    slug: "spatial-flow-in-compact-homes",
    title: "Spatial flow in compact urban homes",
    category: "Design",
    author: "Admin",
    date: "28 Jun 2026",
    dateTime: "2026-06-28",
    excerpt:
      "Designing multipurpose corners, sliding partitions, and modular furniture that maximize daylight in smaller city floor plans.",
    image: "/images/home/editorial/quiet-layers.webp",
    thumbnail: "/images/home/editorial/quiet-layers.webp",
    imageAlt: "Compact apartment living zone with multifunctional furniture",
  },
  {
    id: "blog-14",
    slug: "textile-layering-with-raw-linen",
    title: "Textile layering with raw linen",
    category: "Handmade",
    author: "Admin",
    date: "20 Jun 2026",
    dateTime: "2026-06-20",
    excerpt:
      "The enduring beauty of unbleached European flax linen: natural slubs, softened drape, and breathability through changing seasons.",
    image: "/images/home/editorial/softly-grounded.webp",
    thumbnail: "/images/home/editorial/softly-grounded.webp",
    imageAlt: "Layered linen throws and cushions arranged on an upholstered bench",
  },
  {
    id: "blog-15",
    slug: "traditional-joinery-techniques",
    title: "Traditional joinery techniques explained",
    category: "Wood",
    author: "Admin",
    date: "12 Jun 2026",
    dateTime: "2026-06-12",
    excerpt:
      "Mortise-and-tenon, dovetail, and bridal joints provide structural permanence without relying solely on mechanical fasteners.",
    image: "/images/home/editorial/oak-tables.webp",
    thumbnail: "/images/home/editorial/oak-tables.webp",
    imageAlt: "Detailed wood joinery on an artisan oak table",
  },
  {
    id: "blog-16",
    slug: "the-character-of-white-oak",
    title: "The character and grain of white oak",
    category: "Wood",
    author: "Admin",
    date: "04 Jun 2026",
    dateTime: "2026-06-04",
    excerpt:
      "Why American white oak remains the benchmark timber for durable dining tables, consoles, and architectural millwork.",
    image: "/images/home/editorial/sunlit-dining-corner.webp",
    thumbnail: "/images/home/editorial/sunlit-dining-corner.webp",
    imageAlt: "Sunlit solid white oak dining table with matching bench",
  },
  {
    id: "blog-17",
    slug: "living-with-natural-patina",
    title: "Living with natural patina",
    category: "Wood",
    author: "Admin",
    date: "26 May 2026",
    dateTime: "2026-05-26",
    excerpt:
      "Embracing gentle wear, sunlight deepening, and the organic life marks that transform furniture from objects into family heirlooms.",
    image: "/images/home/editorial/place-to-pause.webp",
    thumbnail: "/images/home/editorial/place-to-pause.webp",
    imageAlt: "Aged timber bench showcasing rich natural patina",
  },
  {
    id: "blog-18",
    slug: "hand-stitched-leather-details",
    title: "Hand-stitched leather in fine upholstery",
    category: "Handmade",
    author: "Admin",
    date: "18 May 2026",
    dateTime: "2026-05-18",
    excerpt:
      "Saddle-stitched seams and vegetable-tanned leather straps impart quiet structural refinement to minimalist dining chairs.",
    image: "/images/home/editorial/room-to-gather.webp",
    thumbnail: "/images/home/editorial/room-to-gather.webp",
    imageAlt: "Hand-stitched leather trim on a dining seat cushion",
  },
  {
    id: "blog-19",
    slug: "hand-carved-serving-boards",
    title: "Hand-carved serving boards and kitchen tools",
    category: "Handmade",
    author: "Admin",
    date: "11 May 2026",
    dateTime: "2026-05-11",
    excerpt:
      "Gouge marks, end-grain care, and food-safe mineral oils: how artisanal wooden kitchenware elevates daily cooking.",
    image: "/images/home/editorial/kitchen-shelf.webp",
    thumbnail: "/images/home/editorial/kitchen-shelf.webp",
    imageAlt: "Assorted hand-carved wooden kitchen boards resting against tile",
  },
  {
    id: "blog-20",
    slug: "hand-woven-wool-rugs",
    title: "Hand-woven wool rugs for open living spaces",
    category: "Handmade",
    author: "Admin",
    date: "03 May 2026",
    dateTime: "2026-05-03",
    excerpt:
      "Flatweaves versus plush high-pile rugs: anchoring seating areas, damping acoustics, and introducing organic warmth underfoot.",
    image: "/images/home/editorial/softly-grounded.webp",
    thumbnail: "/images/home/editorial/softly-grounded.webp",
    imageAlt: "Natural wool area rug under a contemporary sofa set",
  },
  {
    id: "blog-21",
    slug: "restoring-vintage-furniture-finds",
    title: "Restoring and caring for vintage furniture",
    category: "Handmade",
    author: "Admin",
    date: "25 Apr 2026",
    dateTime: "2026-04-25",
    excerpt:
      "Gentle cleaning, beeswax conditioning, and stabilizing loose tenons: practical maintenance tips for reclaimed pieces.",
    image: "/images/home/editorial/vintage-lounge-chair.webp",
    thumbnail: "/images/home/editorial/vintage-lounge-chair.webp",
    imageAlt: "Restored vintage armchair with restored walnut frame",
  },
  {
    id: "blog-22",
    slug: "clay-and-pigment-wall-finishes",
    title: "Clay and natural pigment wall finishes",
    category: "Handmade",
    author: "Admin",
    date: "17 Apr 2026",
    dateTime: "2026-04-17",
    excerpt:
      "Breathing lime plasters and mineral washes create soft light refraction and tactile depth that flat paint cannot replicate.",
    image: "/images/home/editorial/quiet-layers.webp",
    thumbnail: "/images/home/editorial/quiet-layers.webp",
    imageAlt: "Textured plaster wall catching soft afternoon sunlight",
  },
  {
    id: "blog-23",
    slug: "harmonious-proportions-for-open-living",
    title: "Harmonious proportions for open-concept living",
    category: "Interior",
    author: "Admin",
    date: "08 Apr 2026",
    dateTime: "2026-04-08",
    excerpt:
      "Zoning living and dining areas without bulky walls through rug placement, low credenzas, and consistent material palettes.",
    image: "/images/home/editorial/room-to-gather.webp",
    thumbnail: "/images/home/editorial/room-to-gather.webp",
    imageAlt: "Spacious open living room flowing into an adjoining dining area",
  },
  {
    id: "blog-24",
    slug: "solid-wood-care-through-the-seasons",
    title: "Solid wood care through seasonal humidity changes",
    category: "Wood",
    author: "Admin",
    date: "01 Apr 2026",
    dateTime: "2026-04-01",
    excerpt:
      "Protecting solid timber tables from winter dryness and summer humidity with proper indoor climate balance and nourishing wax.",
    image: "/images/home/editorial/oak-tables.webp",
    thumbnail: "/images/home/editorial/oak-tables.webp",
    imageAlt: "Polished oak table surface showing fine wood grain detail",
  },
])

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return typeof value === "string" ? value : undefined
}

function parsePage(value: string | undefined): number {
  if (!value || !/^[1-9]\d*$/.test(value)) return 1
  const page = Number(value)
  return Number.isSafeInteger(page) ? page : 1
}

export function resolveBlogView(
  posts: readonly BlogPost[] = blogPosts,
  query: BlogQuery = {}
): BlogViewModel {
  const rawQuery = firstValue(query.q)?.trim() || undefined
  const rawCategory = firstValue(query.category)?.trim() || undefined

  // Match category case-insensitively against valid categories
  const activeCategory = rawCategory
    ? blogCategories.find(
        (c) => c.toLowerCase() === rawCategory.toLowerCase()
      )
    : undefined

  const searchQuery = rawQuery ? rawQuery : undefined

  // Compute fixed category counts across ALL posts in fixture
  const categories: readonly BlogCategoryCount[] = Object.freeze(
    blogCategories.map((name) => ({
      name,
      slug: name.toLowerCase(),
      count: posts.filter((p) => p.category === name).length,
    }))
  )

  // Filter posts based on activeCategory and searchQuery (title, excerpt, category)
  const filtered = posts.filter((post) => {
    if (activeCategory && post.category !== activeCategory) {
      return false
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const inTitle = post.title.toLowerCase().includes(q)
      const inExcerpt = post.excerpt.toLowerCase().includes(q)
      const inCategory = post.category.toLowerCase().includes(q)
      if (!inTitle && !inExcerpt && !inCategory) {
        return false
      }
    }
    return true
  })

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / BLOG_PAGE_SIZE))
  const requestedPage = parsePage(firstValue(query.page))
  const page = Math.min(requestedPage, totalPages)

  const visibleStart = totalCount === 0 ? 0 : (page - 1) * BLOG_PAGE_SIZE + 1
  const visibleEnd = totalCount === 0 ? 0 : Math.min(page * BLOG_PAGE_SIZE, totalCount)

  const startIndex = (page - 1) * BLOG_PAGE_SIZE
  const visiblePosts = Object.freeze(
    filtered.slice(startIndex, startIndex + BLOG_PAGE_SIZE)
  )

  // Recent posts: top 5 posts from the full catalog (or reference list)
  const recentPosts = Object.freeze(posts.slice(0, 5))

  return {
    posts: filtered,
    visiblePosts,
    recentPosts,
    categories,
    activeCategory,
    searchQuery,
    totalCount,
    totalPages,
    page,
    pageSize: BLOG_PAGE_SIZE,
    visibleStart,
    visibleEnd,
  }
}

// Reference delta: the prompt sketches blogHref(query) with a single partial
// argument, but pagination, category, and search links must preserve the other
// active filters (acceptance criterion 7). This two-argument form threads the
// current view through every link so page links keep q/category and category
// links reset the page, mirroring the certified shopHref(view, next) pattern.
export function blogHref(
  current: { searchQuery?: string; activeCategory?: string; page?: number },
  next: {
    q?: string | null
    category?: string | null
    page?: number | null
  } = {}
): string {
  const params = new URLSearchParams()

  const q = next.q !== undefined ? next.q : current.searchQuery
  const category = next.category !== undefined ? next.category : current.activeCategory
  const page = next.page !== undefined ? next.page : current.page

  if (q && q.trim()) {
    params.set("q", q.trim())
  }
  if (category && category.trim()) {
    params.set("category", category.trim().toLowerCase())
  }
  if (page && page > 1) {
    params.set("page", String(page))
  }

  const queryString = params.toString()
  return queryString ? `/blog?${queryString}` : "/blog"
}
