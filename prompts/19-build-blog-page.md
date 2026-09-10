# Build Compfi blog page, editorial feed, search, and category browsing

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-10. This is a planning
artifact only. It authorizes no implementation until the user explicitly
approves it through the single-letter `y` workflow.

Planning-time repository state is `main` at `299b3c5`, with a clean worktree
(`git status --short` empty at prompt-preparation time). Reconfirm
`git status --short`, `git branch --show-current`, recent history, and `HEAD`
before execution. Stop if the branch is not `main`. Preserve every unrelated
path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Build the second and final dependency-safe unit of Phase 6 (Content surfaces) by
adding the `/blog` route. This delivers the editorial article feed, search
filtering, category browsing, recent posts sidebar, and pagination defined in
`design/9-Blog.png` (reference 9).

Phases 1–5 are implemented and review-closed: design system, primitives and
components, shared chrome, commerce browsing (home, shop, product detail,
comparison), and cart/checkout presentation. Phase 6 depends only on phases 2–3.
Contact (`/contact`) was built and review-closed in prompts 17 and 18. Blog is
the sole remaining surface of Phase 6. Completing this unit will satisfy Phase 6
in full, leaving the codebase ready for Phase 7 (Interaction and motion polish).

The required lightweight architecture-signal check found no threshold-crossing
candidate. Blog is a read-only editorial surface built with standard Next.js App
Router Server Components, a pure query/view projection module, small client
leaves for search and filter inputs, and certified design-system components. No
external CMS, database, or multi-adapter seam is introduced. Do not run an
architecture audit during this single-letter workflow.

## Evidence to re-read before implementation

- `AGENTS.md`, especially sections 1.1–1.2, 2, 3.2–3.4, 4–10, and 12–13;
  `CONTEXT.md`; `docs/catalog.md`; `docs/design-system.md`; `docs/components.md`;
  `docs/pages.md`; `docs/automation.md`; and `docs/agent-browser.md`.
- Existing components and page implementations: `app/shop/page.tsx`,
  `components/shop/shop-results.tsx`, `components/shop/shop-controls.tsx`,
  `lib/catalog-view.ts`, `components/chrome/page-hero.tsx`,
  `components/chrome/benefits-strip.tsx`, `components/chrome/site-header.tsx`,
  `components/chrome/site-footer.tsx`, `components/ui/pagination.tsx`,
  `components/ui/input.tsx`, `components/ui/button.tsx`,
  `components/ui/empty.tsx`, `components/layout/container.tsx`.
- Open `design/9-Blog.png` at its native 2880 × 7962 resolution. Use
  `docs/automation.md` to create fresh task-specific crops under `/tmp`, keep
  measurement separate from implementation decisions, and retain the
  established 2 raster px : 1 CSS px working interpretation.

Planning-time native measurements to reproduce and verify during execution:

| evidence | native raster observation | CSS interpretation / decision |
| --- | --- | --- |
| page size & shell | 2880 × 7962; repeated 200px header | retain certified 100px header; use tokenized `PageHero` banner variant |
| hero banner | `2880×632+0+200` with centered "Blog" title and "Home > Blog" breadcrumbs | `PageHero` with `title="Blog"`, `breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}` |
| main content area | y=832 to y=6368 on pure white canvas (`#FFFFFF`) | main content block inside standard 1240px (`max-w-[77.5rem]`) `Container` |
| feed column | x=200 to 1833 (width 1634 px) | left column ~817 CSS px wide (~66% of container) |
| column gap | x=1833 to 1976 (width 143 px) | ~72 CSS px column gap (`gap-18` or `gap-16` / 4.5rem) |
| sidebar column | x=1976 to 2597 (width 622 px) | right column ~311 CSS px wide (~25% of container) |
| article lead image | 1634 × 1000 px at y=1044..2043 (article 1), y=2740..3739 (article 2), y=4436..5435 (article 3) | 817 × 500 CSS px (~1.634 ratio, 16:10 / 817:500), 10px rounded corners |
| article meta row | y=2102, text and icons in `#9F9F9F`, author Admin, date 14 Oct 2022, category tag | flex row with User, Calendar, Tag Lucide icons, 15px muted text |
| article title | 30px bold `#000000` / `--color-foreground`, e.g. "Going all-in with millennial design" | `h2` heading with link to post |
| article excerpt | 4 lines of `#9F9F9F` text, ~15px, line-height 1.5 | paragraph with muted color and balanced line length |
| read more link | `#000000` text with solid underline | accessible link with clear accessible name |
| article vertical rhythm | articles start at y=1044, 2740, 4436; ~252–260 px gap between cards | ~125–130 CSS px spacing between article cards |
| pagination | y=6132..6250, aligned under feed; active button 1 is 120×118 px in `#B88E2F`; buttons 2, 3, Next in `#F9F1E7` | 60×60 CSS px buttons with 10px radius, active in gold, inactive in wash |
| sidebar search | x=1976..2597, y=1044..1149 (622×106 px); outline `#9F9F9F`, search icon at x=556..596 inside box | 311 × 53 CSS px input with 10px radius, search icon button on right |
| sidebar categories | x=2049, y=1250..1650; "Categories" heading, list with counts: Crafts (2), Design (8), Handmade (7), Interior (1), Wood (6) | `h3` heading, category list with active link state and right-aligned `#9F9F9F` counts |
| sidebar recent posts | x=2046, y=2100..3000; "Recent Posts" heading, 5 post rows with 80×80 px thumbnails, titles, dates | `h3` heading, list of 5 recent posts with 40×40 or 80×80 CSS px thumbnails |
| benefit band | `2880×550+0+6368` holds `#FAF3EA` with ink `#242424` | retain certified 275px `BenefitsStrip` |
| footer | y=6908 to 7962 | root layout `SiteFooter` |

The reference establishes an elegant editorial layout with generous breathing
room, distinct typography, and structured navigation widgets. Compfi will
implement this faithfully on desktop while providing responsive adaptations
for tablet and mobile viewports.

## Installed framework and component sources

Before implementation, re-read the installed Next.js 16.3.4 documentation:

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- `node_modules/next/dist/docs/01-app/02-guides/forms.md`
- `node_modules/next/dist/docs/01-app/02-guides/images.md`

In Next.js 16+, `searchParams` in `app/blog/page.tsx` is an async Promise:
`{ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }`.
Always `await searchParams`.

Inspect installed shadcn components and Lucide icons:
`components/ui/pagination.tsx`, `components/ui/input.tsx`,
`components/ui/button.tsx`, `components/ui/empty.tsx`,
`components/layout/container.tsx`. Reuse existing primitives; do not duplicate
or overwrite them.

Before browser testing, re-read `docs/agent-browser.md` and set exactly one
named session scoped to this task (`compfi-blog-<uuid>`).

## Scope and component ownership

### 1. Pure blog domain model and query projection (`lib/blog.ts`)

Create `lib/blog.ts` owning:
- Types: `BlogPost`, `BlogCategory` (`'Crafts' | 'Design' | 'Handmade' | 'Interior' | 'Wood'`),
  `BlogAuthor`, `BlogQuery`, `BlogViewModel`.
- Static immutable fixtures:
  - Curated blog posts matching the reference content:
    1. `going-all-in-with-millennial-design` (category: `Wood`, date: `14 Oct 2022`, author: `Admin`)
    2. `exploring-new-ways-of-decorating` (category: `Handmade`, date: `14 Oct 2022`, author: `Admin`)
    3. `handmade-pieces-that-took-time-to-make` (category: `Wood`, date: `14 Oct 2022`, author: `Admin`)
    4. `modern-home-in-milan` (category: `Design`, date: `03 Aug 2022`, author: `Admin`)
    5. `colorful-office-redesign` (category: `Design`, date: `03 Aug 2022`, author: `Admin`)
  - Additional deterministic fixtures to satisfy the exact reference category counts:
    Crafts: 2, Design: 8, Handmade: 7, Interior: 1, Wood: 6 (total: 24 articles).
  - All fixture objects frozen via `Object.freeze` to prevent runtime mutation.
- Pure projection function:
  `resolveBlogView(posts: readonly BlogPost[], searchParams: Record<string, string | string[] | undefined>): BlogViewModel`
  - Normalizes search query `q` (case-insensitive search across title, excerpt, category).
  - Normalizes `category` filter (must match valid category slug/name; ignores unrecognized categories).
  - Calculates pagination: default 3 articles per page (matching reference desktop layout of 3 articles on page 1),
    clamps `page` to valid range `1..totalPages`.
  - Computes exact category counts for sidebar.
  - Returns top 5 recent posts for sidebar.
- Helper function `blogHref(query: Partial<BlogQuery>): string` for constructing clean, consistent query URLs.

### 2. Blog page route (`app/blog/page.tsx`)

- App Router Server Component.
- Metadata: `title: "Blog"`, `description: "Explore interior design stories, craft insights, and decor ideas from Compfi."`
- Resolves `searchParams` via `await searchParams`.
- Composes:
  - `PageHero` with title `"Blog"` and breadcrumbs `[{ label: "Home", href: "/" }, { label: "Blog" }]`.
  - Main container (`<Container>`) containing two-column layout:
    - `<BlogFeed view={view} />`
    - `<BlogSidebar view={view} />`
  - `BenefitsStrip` (certified chrome component).
- Clean semantic landmarks (`<main id="main-content">`, `<section aria-labelledby="...">`, `<aside aria-label="Blog sidebar">`).

### 3. Blog feed block (`components/blog/blog-feed.tsx`)

- Server Component rendering:
  - Accessible section heading (`<h2 className="sr-only">Blog articles</h2>`).
  - Active search/category announcement when filtering is active (e.g. `Showing 3 of 8 articles in "Design"`, with a "Clear filter" action).
  - List of `<BlogCard />` articles.
  - `<BlogPagination />` when `totalPages > 1`:
    - Accessible `<Pagination>` with page number links and Next/Previous buttons.
    - Preserves active search `q` and `category` in page links.
    - Active page styled with Compfi gold (`#B88E2F`), inactive in wash (`#F9F1E7`).
  - Empty state when no articles match:
    - Uses `<Empty>`, `<EmptyHeader>`, `<EmptyTitle>No articles found</EmptyTitle>`,
      `<EmptyDescription>`, and a link to view all articles.

### 4. Blog card component (`components/blog/blog-card.tsx`)

- Server Component for each article item:
  - `<article>` wrapper with `data-slot="blog-card"`.
  - Lead image using `next/image`:
    - Responsive sizes: `(min-width: 1280px) 817px, (min-width: 768px) 66vw, 100vw`.
    - Local WebP media with descriptive alt text.
    - 10px rounded corners (`rounded-[0.625rem]`).
  - Metadata list (`<ul>` or flex row) with Lucide icons:
    - Author: `<User className="size-4" aria-hidden="true" /> {post.author}`
    - Date: `<Calendar className="size-4" aria-hidden="true" /> {post.date}`
    - Category: `<Tag className="size-4" aria-hidden="true" /> {post.category}`
  - Title: `<h2 className="type-heading-lg"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>`.
  - Excerpt: `<p className="text-muted-foreground">{post.excerpt}</p>`.
  - Action link: `<Link href={`/blog/${post.slug}`} className="blog-card__read-more">Read more<span className="sr-only"> about {post.title}</span></Link>`.

### 5. Blog sidebar block (`components/blog/blog-sidebar.tsx`)

- `<aside>` element with `aria-label="Blog sidebar"`.
- Composes:
  - `<BlogSearch defaultValue={view.searchQuery} />`:
    - Client leaf component (`"use client"`).
    - Native GET form submitting `?q=...` to `/blog`.
    - Input styled with 53px height, 10px radius, border token.
    - Magnifying glass search icon button on the right with accessible label.
    - Clear button when search text is present.
  - `<BlogCategories categories={view.categories} activeCategory={view.activeCategory} />`:
    - `<h3>` heading "Categories".
    - Unordered list of category links with item counts.
    - Selected category marked with `aria-current="page"` and bold/accent styling.
    - Clicking active category toggles back to all articles.
  - `<BlogRecentPosts posts={view.recentPosts} />`:
    - `<h3>` heading "Recent Posts".
    - List of 5 items with thumbnail image (80×80 px, rounded 6-8px), post title, and publication date in muted text.

### 6. Design tokens and styles (`app/globals.css`)

- Add scoped blog layout and geometry tokens under `--blog-*`:
  - `--blog-gap`: gap between feed and sidebar (`4.5rem` / `72px` desktop).
  - `--blog-feed-width`: flex/grid ratio (~`68%` desktop).
  - `--blog-sidebar-width`: `19.5rem` (`312px` desktop).
  - `--blog-card-radius`: `0.625rem` (`10px`).
  - `--blog-search-height`: `3.3125rem` (`53px`).
  - `--blog-pagination-size`: `3.75rem` (`60px`).
  - `--blog-pagination-radius`: `0.625rem` (`10px`).
- Style `.blog-card__read-more` with distinct underline offset and hover transition.
- Responsive breakpoints:
  - Desktop (>1024px): 2 columns (feed + sidebar).
  - Tablet (768px–1024px): flexible 2 columns with reduced gap.
  - Mobile (<768px): single column with search at top, feed in middle, categories and recent posts below.

### 7. Local media assets

- Provide local WebP imagery for blog lead images and thumbnails under `public/images/blog/`.
- Reuse existing high-resolution interior/furniture editorial assets from `public/images/home/editorial/`
  where appropriate, or add optimized WebP images conforming to Compfi's established media rules:
  warm daylight, honest materials, no people/logos/watermarks, correct aspect ratios.

## Responsive behavior

| breakpoint | width | layout behavior |
| --- | --- | --- |
| desktop | 1440 px | two-column layout in 1240px container; feed ~817px, sidebar ~311px, gap ~72px; 3 article cards; sidebar search + categories + 5 recent posts |
| small desktop / tablet landscape | 1024 px | two-column layout with fluid feed; sidebar fixed or proportional; generous spacing maintained |
| tablet portrait | 768 px | single-column flow; search bar at top; feed articles full width; categories and recent posts stacked below feed; pagination centered |
| mobile | 390 px | single-column; touch targets >= 44×44 px; article cards stack vertically; image full width; pagination wraps cleanly; zero horizontal overflow |
| small mobile | 320 px | single-column; compact padding; meta items wrap cleanly; zero horizontal scroll (`scrollWidth === clientWidth`) |

## States and edge cases

| state | behavior |
| --- | --- |
| default | page 1, all categories; 3 article cards; pagination showing 1 (active), 2, 3, Next; 5 categories with counts; 5 recent posts |
| category filter | `/blog?category=wood`: filters feed to Wood posts; shows category banner/announcement; category item marked active; pagination reflects category total |
| search query | `/blog?q=decorating`: filters feed by title/excerpt; search input displays current query; shows result count; clear search button active |
| combined filter | `/blog?category=design&q=milan`: filters by both category and query string |
| empty results | search or filter yields 0 articles: renders `<Empty>` state with clear guidance and button to reset filters |
| page out of bounds | `/blog?page=999`: clamped to `totalPages`; `/blog?page=-1`: clamped to page 1 |
| invalid category | `/blog?category=nonexistent`: gracefully handled without error; renders all articles or clear message |
| hover & focus-visible | visible focus outlines on all links, buttons, and inputs; smooth hover state on read more and post cards |
| reduced motion | all hover transitions disabled or instantaneous under `prefers-reduced-motion: reduce` |

## Accessibility and security

- One `main#main-content` landmark on the page.
- Clear heading hierarchy: `PageHero` owns `h1`, article titles own `h2`, sidebar sections own `h3`, empty state uses `h2`/`h3` appropriately.
- Search form has an accessible label (`aria-label="Search blog posts"` or visually hidden `<label>`).
- Search input has `type="search"`, `autocomplete="off"`, `enterKeyHint="search"`.
- Pagination nav has `role="navigation"`, `aria-label="Blog pagination"`, and active page has `aria-current="page"`.
- "Read more" links have accessible descriptive context (e.g. `<span className="sr-only"> about {title}</span>`) to avoid bare "Read more" links failing WCAG SC 2.4.4.
- High color contrast: ensure all text meets WCAG AA 4.5:1 contrast ratio against white/wash backgrounds.
- Zero server actions or untrusted POST routes; search is a safe GET request.
- No HTML injection or raw `dangerouslySetInnerHTML`. All query parameters and fixture strings rendered as escaped text.
- No third-party tracking scripts, cookies, or external CDN dependencies.

## Reference deltas and why each is necessary

1. **Brand Name**: The reference displays the legacy brand name "Furniro" in the header and footer. Per AGENTS.md § 1.1, Compfi is used everywhere.
2. **CMS and Backend**: The reference is a static mockup. Real Compfi architecture uses pure static fixtures and Next.js App Router query parameters (`?q=...&category=...&page=...`), avoiding undeclared headless CMS or search service dependencies before Phase 10.
3. **Responsive Stacking**: The reference provides only a 2880px desktop comp. Responsive single-column layouts for 1024px, 768px, 390px, and 320px are designed from the established Compfi visual hierarchy.
4. **Blog Post Detail Route**: Reference 9 defines the `/blog` index surface. Detailed single-post views (`/blog/[slug]`) are not part of the Phase 6 deliverable; "Read more" and post title links link to `/blog#` or provide placeholder destination handling with clear accessible names.
5. **Reduced Motion & Focus**: Desktop comps show static pixels; visible focus indicators, skip-link handling, and reduced-motion overrides are added per WCAG 2.2 requirements.

## Non-goals

- Do not integrate an external CMS (Sanity, Contentful, Strapi, etc.).
- Do not build a full `/blog/[slug]` article reader in this unit.
- Do not create a comment system, like button, or view counter.
- Do not add social media sharing SDKs or third-party tracking pixels.
- Do not modify pre-existing catalog, cart, checkout, or contact logic.

## Acceptance criteria

1. `/blog` renders as an App Router Server Component with `PageHero` ("Blog"), two-column desktop layout, benefits strip, and root footer.
2. Page title is `Blog | Compfi`.
3. Feed renders 3 articles on page 1 with correct imagery, metadata (author, date, category), title, excerpt, and "Read more" action.
4. Sidebar renders search input, categories with exact counts (Crafts: 2, Design: 8, Handmade: 7, Interior: 1, Wood: 6), and 5 recent posts.
5. Search filtering via `?q=...` filters articles accurately and provides an empty state when no results match.
6. Category filtering via `?category=...` filters articles by category and highlights the active category.
7. Pagination works correctly with active gold styling and links preserving active filter parameters.
8. Responsive behavior verified at 1440px, 1024px, 768px, 390px, and 320px with zero horizontal overflow.
9. Accessibility: automated axe audit reports 0 violations; keyboard navigation and screen-reader announcements verified.
10. All automated checks pass: `npm run test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.

## Verification commands

Run these checks during execution:

```bash
# Focused blog tests
npm run test -- test/blog.test.tsx

# Full project static checks
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

Browser automation verification with `agent-browser` in a named session `compfi-blog-<uuid>`:
- Direct navigation to `http://localhost:3000/blog`
- Verify PageHero title and breadcrumbs
- Verify article feed count, card elements, metadata, and "Read more" links
- Test search: enter query, submit, verify filtered results, clear search
- Test category filter: click "Wood", verify URL `?category=wood` and filtered feed
- Test pagination: click page 2, verify URL `?page=2` and articles change
- Test empty state: search for non-matching string, verify empty message and reset link
- Responsive audit: capture screenshots at 1440, 1024, 768, 390, 320 viewports; verify `scrollWidth === clientWidth`
- Accessibility: run axe audit on `/blog` (0 violations expected)
- Verify keyboard navigation through skip link, search input, article links, and pagination

## Documentation to update

- `docs/pages.md`: record `/blog` implementation, measurements, responsive decisions, verification results, and Phase 6 completion status.
- `docs/components.md`: record new blog components (`BlogFeed`, `BlogCard`, `BlogSidebar`, `BlogSearch`, `BlogCategories`, `BlogRecentPosts`).
- `docs/design-system.md`: record blog layout tokens and geometry.
- `CONTEXT.md`: record any blog-specific domain terms (Article, Blog Category, Excerpt) if applicable.

## SKILLS USED

- `building-components`: component architecture, props, accessible names, slots, data attributes.
- `frontend-design`: layout fidelity, typography hierarchy, vertical rhythm, and avoiding AI-generated visual clichés.
- `vercel-composition-patterns`: compound component structures, clean component boundaries.
- `vercel-react-best-practices`: Server Component route default, small client leaves for search/filter inputs, no waterfalls, Next.js image optimization.
- `domain-modeling`: domain glossary and vocabulary alignment in `CONTEXT.md`.
- `react-testing`: unit and integration tests with React Testing Library and axe-core.
- `web-design-guidelines`: Web Interface Guidelines review for forms, links, contrast, and layout.
- `agent-browser`: browser automation, multi-viewport verification (1440, 1024, 768, 390, 320), contrast, keyboard navigation, reduced motion.
- `code-review`: mandatory dual-axis review (Standards and Spec subagents) on implementation.
- `caveman-commit`: conventional commit messages for implementation and review-fix commits.
