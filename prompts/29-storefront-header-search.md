# Storefront Header Search and Search Dialog Integration (Shared Chrome Completion)

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-12 following the project's
ordered build sequence and visual reference affordances.

This is a planning artifact only. It authorizes no implementation, dependency
installation, staging, commit, or push until the user explicitly approves it
through the single-letter `y` workflow.

Planning-time repository state is a clean `main` at `7a7269f` (`git status --short`
empty at prompt-preparation time, 33 test files and 178 tests passing, 0 lint
warnings, Next.js build clean). Reconfirm `git status --short`,
`git branch --show-current`, recent history, and `HEAD` before execution. Stop if
the branch is not `main`. Preserve every unrelated path that appears after this
prompt is prepared.

## Goal and why this is the next dependency-safe unit

Deliver the remaining visual utility control from the reference header in
`design/1-Home.png` and `design/2-Shop.png`: the **Search trigger** and an
accessible, instant **Search Dialog** (`HeaderSearch` / `SearchDialog`).

Why this is the next dependency-safe unit:
- Phases 1–10 of the storefront build sequence are complete, verified, and
  review-closed:
  - Phase 1: Design system & tokens (`app/globals.css`, `docs/design-system.md`).
  - Phase 2: Core primitives and components (`components/ui/`, `docs/components.md`).
  - Phase 3: Shared chrome (`components/chrome/`, `docs/components.md`, `docs/pages.md`).
  - Phase 4: Commerce browsing (`/`, `/shop`, `/shop/[slug]`, `/comparison`).
  - Phase 5: Cart & checkout presentation (`/cart`, `/checkout`, `useCart`).
  - Phase 6: Content surfaces (`/contact`, `/blog`).
  - Phase 7: Interaction & motion polish (drawers, overlays, galleries, filters).
  - Phase 8: Accessibility, performance, and visual QA (0 axe violations site-wide).
  - Phase 9: Clerk authentication & protected `/account` route.
  - Phase 10: 100% free local SQLite persistence with authoritative Server Actions
    for orders, contact inquiries, and newsletter subscriptions.
- In `design/1-Home.png` and `design/2-Shop.png`, the desktop header utility cluster
  features four controls:
  1. User account (`UserIcon` -> Clerk authentication & profile, delivered in Phase 9).
  2. Search icon (magnifying glass -> deferred in Phase 3 prompt 06 line 19:
     *"without inventing checkout, authentication, account management, search, or a newsletter service"*).
  3. Wishlist / Heart icon (visual affordance only; backend wish-list is strictly
     forbidden by AGENTS.md line 51 without explicit requirement).
  4. Cart drawer (`CartDrawer` -> delivered in Phases 3 & 5).
- With checkout, authentication, and newsletter services complete, implementing
  the **Search Dialog** fulfills the deferred search affordance without requiring
  any unapproved third-party service, external search engine, or paid cloud APIs.
- The search operates client-side across the verified in-memory catalog
  (`lib/catalog.ts`) and editorial articles (`lib/blog.ts`), delivering fast,
  accessible discovery across both furniture products and editorial content.

## Relevant source files, design references, and measurements

- Design references:
  - `design/1-Home.png` (header utility section at top right, x=2080..2880, y=0..200).
  - `design/2-Shop.png` (header utility section matching reference 1).
  - Raster scale: 2:1 raster-to-CSS pixel ratio, 100 CSS px header height (`--chrome-header-height`).
- Measured reference values from `/tmp/compfi_header_icons.png` (800×200 native crop):
  - Search icon: magnifying glass stroke icon (Lucide `SearchIcon` / `Search`), 24×24 CSS px ink size (`size-6`), centered inside 44×44 CSS px minimum touch target.
  - Placed immediately between the User account control and the Cart drawer trigger.
  - Stroke color: `#000000` / `--color-compfi-ink`, hovering to `--color-compfi-brand-action` (`#B88E2F`).
- Key source files:
  - `components/chrome/header-controls.tsx`: client controls container owning header utilities and mobile menu.
  - `components/chrome/site-header.tsx`: server-safe header structure.
  - `components/ui/dialog.tsx`: audited Base UI dialog primitive (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogClose`).
  - `components/ui/icon-button.tsx`: accessible icon button with visible focus-visible ring.
  - `lib/catalog.ts`: immutable catalog products fixture with titles, descriptions, categories, prices, and media.
  - `lib/blog.ts`: editorial blog posts fixture with titles, excerpts, categories, dates, and media.
  - `docs/components.md`: component inventory and specifications.
  - `docs/pages.md`: route build records and reference deltas.

## Existing code and package behavior inspected

- `@base-ui/react/dialog`: installed and wrapped in `components/ui/dialog.tsx`.
  - Supports `DialogPrimitive.Root`, `Trigger`, `Portal`, `Backdrop`, `Popup`, `Close`, `Title`, `Description`.
  - Provides built-in modal behavior: traps focus, dismisses on Escape and outside click, restores focus to trigger on close, and applies `aria-modal="true"`.
- `components/ui/icon-button.tsx`: provides standard 44×44px touch target, accessible label, and visible focus ring.
- `lib/catalog.ts`: exports `catalogProducts: readonly CatalogProduct[]`.
  - Each item has `id`, `slug`, `name`, `category`, `description`, `priceCents`, `media`.
- `lib/blog.ts`: exports `blogPosts: readonly BlogPost[]`.
  - Each item has `id`, `slug`, `title`, `category`, `excerpt`, `date`, `dateTime`, `image`.
- `HeaderControls` in `components/chrome/header-controls.tsx`:
  - Currently contains `SignInButton` / `UserButton`, `CartDrawer`, and mobile `IconButton` (Menu/X).
  - Missing the Search control between User and Cart.
  - Mobile navigation panel (`#mobile-primary-navigation`) currently lists nav links and auth item, but lacks a search entry.

## Exact scope, expected files, and route impact

Expected files to create or modify:
- `components/chrome/header-search.tsx` (NEW): client component composing `Dialog`, search input, live search filtering, results preview, and keyboard navigation.
- `components/chrome/header-controls.tsx`: integrate `HeaderSearch` between User button and `CartDrawer` in desktop header, and add a Search action in the mobile navigation drawer.
- `lib/search.ts` (NEW): pure search helper function `searchStorefront(query: string)` that searches `catalogProducts` and `blogPosts`, returning structured, ranked matches.
- `test/search.test.ts` (NEW): unit tests for search query normalization, matching, ranking, and empty-state handling.
- `test/header-search.test.tsx` (NEW): component tests for `HeaderSearch` dialog opening, autofocus, live filtering, keyboard navigation, Escape dismissal, focus return, and axe accessibility.
- `docs/components.md`: document `HeaderSearch` / `SearchDialog` API, states, accessibility, and usage.
- `docs/pages.md`: record the search chrome integration and reference deltas.

Route impact:
- Global impact across all pages inheriting `SiteHeader` (`/`, `/shop`, `/shop/[slug]`, `/comparison`, `/cart`, `/checkout`, `/contact`, `/blog`, `/account`). Zero routing breakage or SSR hydration errors.

## Component boundaries and server/client ownership

- `SiteHeader`: remains Server Component.
- `HeaderControls`: Client Component (`"use client"`) composing client leaves.
- `HeaderSearch`: Client Component (`"use client"`) containing:
  - Trigger button: `<IconButton icon={SearchIcon} label="Search Compfi" variant="ghost" className="min-h-11 min-w-11" />`.
  - Dialog modal: Base UI `Dialog` with backdrop blur, centered on desktop, full-width with safe insets on mobile.
  - Search input: autofocus `<input type="search" ... />` with search icon, clear button (`XIcon`), and Enter submission.
  - Results container: organized into "Products" and "Editorial Articles" with item counts.
  - Live status region: polite `role="status"` live region announcing match counts.

## Responsive behavior at explicit widths

- **Desktop (1440px)**: Search icon sits between Account button and Cart drawer in the header utility group. Dialog opens as a centered modal (max-width ~640px) with generous padding, keyboard navigation hints (e.g. `ESC to close`, `↑↓ to navigate`), and smooth transition.
- **Small Desktop / Tablet (1024px, 768px)**: Dialog maintains centered layout with proportional padding (`max-w-lg`).
- **Mobile (390px, 320px)**:
  - On header: Search icon is visible alongside Cart and Menu buttons for instant access.
  - Mobile drawer: also includes a "Search" button with `SearchIcon` in the mobile nav list.
  - Dialog on mobile: opens as a top-anchored or full-viewport sheet/dialog (`w-[calc(100%-1.5rem)]`) with sticky input and scrollable results, ensuring keyboard visibility and zero horizontal overflow (`scrollWidth <= clientWidth`).

## States to handle

- **Default (Closed)**: Search icon button visible in header with clear tooltip / accessible label "Search Compfi".
- **Default (Open, Empty Input)**: Dialog displays search input with focus, plus "Suggested categories" (Dining, Living, Bedroom) and "Popular searches" chips so the customer has immediate clickable starting points.
- **Typing / Active**: Immediate search result updates with smooth transitions.
- **Results Populated**:
  - Products group: thumbnail, title, room/category badge, formatted price. Clicking navigates to `/shop/[slug]` and dismisses dialog.
  - Articles group: thumbnail, title, publication date, category badge. Clicking navigates to `/blog#[slug]` and dismisses dialog.
- **Empty Results**: When no matches exist for the query:
  - Renders accessible `<Empty>` state: "No results found for '{query}'".
  - Offers suggestions: "Try searching for another term like 'sofa', 'table', 'chair', or browse our shop."
  - Provides a direct Link button to `/shop`.
- **Keyboard Selection**: ArrowDown/ArrowUp highlights results; Enter activates the selected link; Escape closes and returns focus to the search trigger button.

## Accessibility and security requirements

- **WCAG 2.2 AA Compliance**:
  - Trigger button has accessible name: `aria-label="Search Compfi"`.
  - Dialog has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to `DialogTitle`.
  - Search input has `type="search"`, `aria-label="Search furniture and articles"`, `autocomplete="off"`, `spellcheck="false"`.
  - Result list has proper list semantics (`role="list"` / `role="listitem"` or `role="group"`).
  - Polite live region (`role="status"`, `aria-live="polite"`, `aria-atomic="true"`) announces: e.g. `"3 products and 1 article found for sofa"`.
  - Focus containment: Tab and Shift+Tab remain trapped within the dialog while open.
  - Escape key dismisses the dialog and returns focus to the triggering element.
  - Minimum 44×44 CSS px touch target for trigger and all interactive items.
  - Visible focus ring with `--color-compfi-brand-focus`.
  - Zero axe violations (`axe-core`).
- **Security**:
  - Pure client-side fixture search; zero SQL injection, zero arbitrary code execution, zero XSS vulnerability. Input is treated as text.

## Data shapes and edge cases

```typescript
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
```

Edge cases:
- Empty or whitespace query: returns empty result list, shows suggestions.
- Special regex characters in query (e.g. `(`, `[`, `*`, `+`): safely escaped; does not throw.
- Long query strings (>100 characters): safely trimmed.
- Highlighting/matching is case-insensitive.
- Rapid input typing: debounced / transition-deferred to avoid jank.
- Direct link clicks close the dialog and restore body scroll.

## Reference deltas and why each is necessary

1. **Search Dialog Modal**: In `design/1-Home.png`, the Search icon is present as a static visual affordance with no open-state comp. Implementing an accessible, centered modal dialog with live search across products and articles fulfills the affordance faithfully while respecting Compfi design-system tokens and WCAG 2.2 AA.
2. **Category & Article Inclusion**: Compfi features both a furniture catalog and an editorial blog; searching across both surfaces maximizes customer utility while avoiding duplicate search interfaces.

## Non-goals

- No external cloud search service (Algolia, Elasticsearch, etc.) or paid API.
- No server-side POST mutation; search is read-only and local.
- No wish-list backend (strictly prohibited without approved requirement).
- No alteration to existing catalog or blog data structures.

## Acceptance criteria

1. Header utility bar renders the `SearchIcon` button between Account and Cart controls on desktop and mobile.
2. Clicking the search trigger or activating via keyboard opens the Search Dialog modal.
3. Focus automatically moves to the search input on open.
4. Typing a query (e.g. "sofa", "chair", "wood", "interior") returns real-time matching products and articles with thumbnails, titles, prices/dates.
5. Clicking a result navigates to the item (`/shop/[slug]` or `/blog#[slug]`) and closes the dialog.
6. Empty search shows helpful suggestions; non-matching query displays an empty state with recovery link to `/shop`.
7. Pressing Escape closes the dialog and cleanly restores focus to the trigger button.
8. Mobile drawer menu includes an accessible search button for mobile navigation.
9. All automated checks pass (`npm run test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`).
10. `axe-core` reports 0 accessibility violations across search trigger, dialog, and results.
11. Responsive verification passes across 1440, 1024, 768, 390, and 320 px viewports with 0 horizontal overflow.

## Commands, automated checks, and verification

- Unit tests: `npx vitest run test/search.test.ts`
- Component & a11y tests: `npx vitest run test/header-search.test.tsx`
- Full test suite: `npm run test`
- Code quality: `npm run lint`
- Type checking: `npx tsc --noEmit`
- Production build: `npm run build`
- Browser verification via `agent-browser`:
  - Open home page, click search icon, verify dialog open and focus on input.
  - Search for "sofa", verify product results appear.
  - Search for "decorating", verify blog article appears.
  - Search for "xyznonexistent", verify empty state.
  - Press Escape, verify dialog closes and focus returns to search button.
  - Verify responsive layout at 1440, 1024, 768, 390, and 320 px.

## Documentation to create or update

- `docs/components.md`: add `HeaderSearch` and `SearchDialog` to certified component inventory.
- `docs/pages.md`: record search integration under Phase 3 / Shared Chrome.
- `AGENTS.md`: verify documentation table alignment.

## SKILLS USED

- `code-review`: mandatory two-stage review (Standards & Spec subagents) against `BASE_SHA...HEAD`.
- `caveman-commit`: concise conventional commits for implementation and review fixes.
- `frontend-design`: visual modal design, typography, spacing, and brand tokens.
- `building-components`: accessible component API, data attributes, and test suite.
- `vercel-composition-patterns`: compound dialog composition and clean leaf boundaries.
- `vercel-react-best-practices`: input debouncing, zero layout shifts, client leaf isolation.
- `web-design-guidelines`: keyboard focus trapping, Escape dismissal, ARIA attributes, touch targets.
- `agent-browser`: browser verification at 1440, 1024, 768, 390, and 320 px viewports.
