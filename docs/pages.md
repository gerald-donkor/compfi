# Compfi page build record

Status: Phase 10 complete and verified (100% free stack, local SQLite persistence via Drizzle ORM and @libsql/client, Server Actions for checkout and contact, order confirmation receipt view, and customer order history on /account).

## Phase 8 — Accessibility, performance, and visual QA certification

Implemented 2026-09-11 as the Phase 8 site-wide certification gate. All nine storefront surfaces (`/`, `/shop`, `/shop/[slug]`, cart drawer modal, `/comparison`, `/cart`, `/checkout`, `/contact`, `/blog`), the design system specimen (`/design-system`), and the custom branded recovery route (`app/not-found.tsx`) were audited for WCAG 2.2 AA accessibility, Next.js 16 Turbopack build optimization, Core Web Vitals, responsive bounds, and visual fidelity against native 2880px desktop references.

### Scope delivered:
- **Metadata and SEO foundations**:
  - `lib/site.ts`: Centralized `siteUrl` fallback (`process.env.NEXT_PUBLIC_SITE_URL || "https://compfi.com"`).
  - `app/robots.ts`: Next.js Route Handler generating crawler exclusion rules (`User-Agent: *`, `Allow: /`) and dynamic sitemap reference (omitted speculative `/api/` rule).
  - `app/sitemap.ts`: Dynamic sitemap generator providing entries for all static storefront paths (`/`, `/shop`, `/cart`, `/checkout`, `/contact`, `/blog`, `/comparison`) and dynamic catalog products (`/shop/[slug]`), with deterministic `lastModified` timestamp, accurate `changeFrequency`, and `priority`.
  - `app/not-found.tsx`: Custom branded 404 recovery route rendering `PageHero` with breadcrumbs, accessible recovery guidance, and primary/outline actions to browse furniture or return home.
  - `app/layout.tsx`: Standardized `metadataBase`, Open Graph defaults (`siteName: "Compfi"`, locale `"en_US"`), and Twitter card metadata without root canonical forcing, allowing accurate per-route canonical inheritance.
  - Page routes (`/`, `/shop`, `/cart`, `/checkout`, `/contact`, `/blog`, `/comparison`, and dynamic `/shop/[slug]`): Each exports explicit `alternates: { canonical: ... }` matching its route path.
- **Accessibility fixes**:
  - `components/home/inspiration-carousel.tsx`: Removed redundant `aria-label="Choose a room"` from plain `.home-inspiration__dots` `<div>`, resolving `aria-prohibited-attr` and preserving slide `group` semantics without extraneous landmark wrappers.
  - `components/chrome/cart-drawer.tsx`: Verified contrast on empty-state recovery action and modal focus trapping.
  - Automated `axe-core 4.12.1` site-wide audit: reports **0 violations** across all 10 routes (`/`, `/shop`, `/shop/[slug]`, cart drawer modal, `/comparison`, `/cart`, `/checkout`, `/contact`, `/blog`, `/design-system`, and 404).
- **Responsive reflow & 200% text zoom**:
  - `components/chrome/site-header.tsx`: Updated grid columns from rigid `minmax(12rem, 1fr) auto minmax(12rem, 1fr)` to flexible `1fr auto 1fr`, maintaining centered navigation while allowing graceful reflow at 200% text zoom.
  - `app/globals.css`: Capped `.product-detail-summary__layout` gallery column using tokenized `--product-detail-gallery-max-share: 52%` (`min(var(--product-detail-gallery-max-share), calc(...))`); constrained `.comparison-picker__select` using `--comparison-picker-width: 15.125rem` (`min-width: min(var(--comparison-picker-width), 100%)`).
  - Responsive audit across 1440, 1024, 768, 390, and 320 px viewports confirmed `document.documentElement.scrollWidth === window.innerWidth` (0 overflow errors across all routes).
  - 200% root text zoom reflow confirmed across all storefront surfaces with zero horizontal overflow.
- **Motion & Assistive Technology**:
  - Verified `prefers-reduced-motion: reduce` collapse of transitions and animations (0.01ms duration) via `agent-browser set media light reduced-motion`.
  - Verified keyboard skip link focus as first Tab stop, header navigation, Escape key modal drawer dismissal with focus restoration to "Open cart" trigger, and comparison table keyboard scrolling.
- **Core Web Vitals**:
  - Home: TTFB 104.7ms, FCP 212ms, LCP 212ms, CLS 0, Hydration 65.9ms.
  - Shop: TTFB 128.3ms, FCP 204ms, LCP 496ms, CLS 0, Hydration 31.8ms.
  - Product: TTFB 247.3ms, FCP 408ms, LCP 408ms, CLS 0, Hydration 37.4ms.
- **Automated test suite**:
  - `test/phase8-audit.test.tsx`: 8 automated integration tests covering robots, sitemap, 404 rendering/a11y, layout metadata, route metadata and canonical URL consistency across all static and dynamic routes, and `SiteHeader`/`SiteFooter` axe checks.
  - Full suite: 27 test files, 139 tests passing cleanly.

### Verification (2026-09-11, named `compfi-phase8-8dbc2e39d5ed` session):
| check | result |
| --- | --- |
| `npm run test` | passed: 27 files, 139 tests |
| `npm run lint` | passed: 0 warnings, 0 errors |
| `npx tsc --noEmit` | passed: 0 errors |
| `npm run build` | passed: Turbopack prerendered 21/21 routes (including /robots.txt and /sitemap.xml) in 1.4s |
| axe-core audits | 0 violations across all 10 routes (`/`, `/shop`, `/shop/alder-dining-chair`, `/comparison`, `/cart`, `/checkout`, `/contact`, `/blog`, `/design-system`, 404, open cart drawer) |
| responsive audit | 0 overflow errors across all routes at 1440, 1024, 768, 390, and 320 CSS px |
| 200% text zoom | all routes verified with `scrollWidth === 1440, innerWidth === 1440` (true) |
| reduced motion | `window.matchMedia('(prefers-reduced-motion: reduce)').matches === true`; transition duration 0.01ms |
| desktop screenshots | 11 captures saved under `/tmp/compfi-phase8-qa/*.png`, confirming 2:1 raster scale and 1240px centered container |
| Web Interface Guidelines | confirmed compliant: visible focus, 44px targets, semantic landmarks, no horizontal scroll, explicit image sizing |

Implementation commit `774540b` received the required independent review on 2026-09-11. Standards reported 2 tokenization violations and 3 baseline smells (duplicated site URL, speculative `/api/` disallow, and volatile date). Spec reported missing canonical URL metadata, unbranded 404 title, and omitted chrome a11y tests. All findings were accepted and resolved: CSS tokens `--product-detail-gallery-max-share` and `--comparison-picker-width` declared; `siteUrl` centralized; speculative rule removed; sitemap date stabilized; canonical URLs configured explicitly per route; test suite expanded to 139 tests. Re-review confirmed 0 hard Standards violations and complete Spec alignment. All 27 test files, lint, TypeScript, and Turbopack build pass. Phase 8 is complete and certified.

## Phase 7 unit 2 — interaction polish (galleries, controls, variants, pagination)

Implemented 2026-09-10 as the second and final Phase 7 unit, completing all
Phase 7 interaction and motion polish deliverables. No route was added or
removed; `/`, `/shop`, `/shop/[slug]`, and `/comparison` inherit the polished
interaction contracts with no data-contract, pricing, or catalog projection change.

Scope delivered:
- `ProductGallery`: Standardized 3px focus ring on thumbnails (`outline: var(--focus-ring-width) solid var(--color-brand-focus)`
  with `outline-offset: var(--focus-ring-offset)`), single polite live region
  announcing image swaps, and graceful single-image resilience.
- `ProductOptions`: Add-to-cart `aria-busy` guard with double-click protection
  (timer cleanup on unmount); dedicated variant selection live region announcing
  size, finish, and quantity changes politely, conditionally mounted only when
  an announcement is present to avoid DOM collision with `CartProvider`'s live region.
- `SizeSelector`: Standardized 3px focus ring offset (`focus-visible:ring-offset-3`),
  discrete motion tokens (`transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]`).
- `ColorSwatch`: Removed forbidden `transition-all`; discrete `transition-colors`
  on button and `transition-[transform,box-shadow]` on inner swatch with
  `--duration-fast` and `--ease-standard`, 3px focus ring offset.
- `QuantityInput`: Standardized 3px focus ring offset, discrete motion tokens.
- `ShopControls`: Consolidated single atomic polite live region (`<p role="status" aria-live="polite" class="sr-only">`),
  eliminating competing live regions between pending and settled states; 44px
  minimum touch targets on view toggles (`.shop-controls [data-slot="toggle-group-item"]`),
  filter `<summary>` styling with smooth disclosure chevron transition.
- `ShopResults` & `Pagination`: 60px wash pagination geometry (`--blog-pagination-size: 3.75rem`,
  `--blog-pagination-radius: 0.625rem`) matching `design/2-Shop.png`, explicit
  `text="Prev"` and `text="Next"` navigation buttons, default accessible name `"pagination"`.
- `app/globals.css`: Exposed `--duration-fast` (140ms), `--duration-standard` (220ms),
  and `--ease-standard` in `@theme inline`; moved `a { color: inherit; text-decoration: inherit; }`
  into `@layer base` resolving a critical cascade defect where anchor buttons lost
  white text contrast against brand gold; updated `@media (prefers-reduced-motion: reduce)`
  with `animation-duration: 0.01ms !important;` and `animation-iteration-count: 1 !important;`.

Decisions & Reference deltas:
- Preserved measured 60px wash pagination geometry from `design/2-Shop.png` across
  both Shop and Blog pagination.
- Enforced 44px minimum target size on ShopControls view toggles for WCAG 2.5.8
  compliance even though visual reference icons are compact.
- Variant selection polite announcements and Add to Cart busy guards are
  established accessibility additions extending the static PNGs.

### Verification

Self-verification on 2026-09-10 (named `compfi-phase7u2-9a8b7c6d` session, dev server on :3000):

| check | result |
| --- | --- |
| focused interaction tests | passed: `test/gallery-controls-variants-interaction.test.tsx` (6 tests: keyboard gallery selection & polite status, single-image gallery, variant announcements & bounds, Add to Cart busy guard, ShopControls single polite region, ShopResults pagination Prev/Next) |
| `npm run test` | passed: 26 files, 129 tests |
| `npm run lint` | passed: 0 errors |
| `npx tsc --noEmit` | passed: 0 errors |
| `npm run build` | passed: 19/19 routes prerendered cleanly |
| responsive | `/`, `/shop`, `/shop/alder-dining-chair`, and `/comparison` showed `scrollWidth === clientWidth` at 1440, 1024, 768, 390, and 320px (zero page overflow) |
| interactive flows | gallery lead swap and status, variant size/color/quantity selection and boundary clamping, tabs switching, filter disclosure, pagination navigation, comparison remove, and carousel navigation with boundary stops verified |
| reduced motion | emulated `prefers-reduced-motion: reduce` verified instant jump path on carousel and collapsed transition/animation durations (0.01ms) |
| axe | 0 violations across all four production routes (`/`, `/shop`, `/shop/alder-dining-chair`, `/comparison`) |
| console | 0 console errors across all verified routes |
| screenshots | `/tmp/compfi-phase7u2-{1440,1024,768,390,320}.png` and `/tmp/compfi-phase7u2-gallery-{1440,390}.png` |

### Independent review (2026-09-10)

Review base `01705cccd04a968a39535b84b21e88c7d62c9a1e...HEAD` covered
`7eb39c0` against `prompts/22-polish-gallery-controls-variants-pagination.md`
plus `AGENTS.md` §§1.1, 1.2, 2.1–2.4, 3.1–3.4, 6–7, 9, 10, 12–13 and owning docs.

- Standards: 2 violations + 3 baseline code smells reported.
  - Violation 1 (hard): Conditionally mounting `{announcement ? <p role="status">...</p> : null}`
    in `ProductOptions` injected container simultaneously with text, causing screen
    readers to drop announcements (WCAG 2.2 AA / WAI-ARIA 4.1.3). Accepted and fixed:
    persisted container `<p role="status" aria-live="polite" aria-atomic="true">` permanently.
    Placed `CartProvider`'s persistent live region before children so it remains the
    primary provider-level status.
  - Violation 2 (hard): `ShopControls` exposed identical count text in both visible
    and screen-reader paragraphs when not pending, creating duplicate announcements
    in virtual reading mode. Accepted and fixed: live region clears when settled
    (`{isPending ? "Updating products…" : ""}`).
  - Smell 1 (Duplicated Code): Option find-by-value and announcement template logic
    duplicated across size and finish handlers. Accepted and refactored into `handleOptionChange`.
  - Smell 2 (Duplicated Code): Count string interpolation duplicated in `ShopControls`.
    Resolved via Violation 2 fix.
  - Smell 3 (Speculative Generality): Exposing `--duration-*` without Tailwind 4's
    `--transition-duration-*` theme mapping. Accepted and mapped `--transition-duration-fast`,
    `--transition-duration-standard`, and `--transition-timing-function-standard` in `@theme inline`.
- Spec: 4 findings reported.
  - Finding 1 (c, hard): Setting `disabled` on Add to Cart button during the 300ms
    busy window resets browser focus to `document.body`, disorienting keyboard users.
    Accepted and fixed: button remains enabled with `aria-busy="true"` and an early-return
    guard in `handleAddToCart`, retaining keyboard focus completely.
  - Finding 2 (a, hard): Interaction test suite lacked tests for tabs keyboard operation
    and carousel controls/boundaries. Accepted and fixed: added focused tests in
    `test/gallery-controls-variants-interaction.test.tsx`.
  - Finding 3 (a, minor): `ProductComparison` live region lacked `role="status"` and
    `aria-atomic="true"`. Accepted and standardized in `components/comparison/product-comparison.tsx`.
  - Finding 4 (b, scope creep): Global reset layer migration of `a { ... }` into `@layer base`.
    Rejected with evidence: unlayered CSS reset in Tailwind 4 beat `@layer utilities`
    classes like `.text-primary-foreground` on link buttons, causing axe color contrast
    violations on brand gold backgrounds. Fixing the cascade was mandatory to meet
    WCAG 2.2 AA floor and prompt's 0-violation acceptance criterion.
- Fix verification: All 26 test files passed (131 tests), 0 lint errors, 0 TypeScript
  errors, and clean Turbopack production build (19/19 pages prerendered).
- Re-review pass: Standards subagent reported 0 hard violations. Spec subagent
  noted count announcement on filter settle, timeout token alignment, and input focus offset.
  Accepted and refined:
  - `ShopControls`: Added `aria-hidden="true"` to visible count and restored settled
    count announcement to the live region, ensuring filter updates are announced
    without duplicate reading when scanning.
  - `ProductOptions`: Aligned busy guard timeout to 220ms (`--duration-standard`);
    renamed `nextVal` to `nextValue`.
  - `QuantityInput`: Standardized `<input>` focus ring offset to 3px (`focus-visible:ring-offset-3`).
- Final verification: 26 test files (131 tests) passing, 0 lint errors, 0 TypeScript errors.
- Status: Phase 7 is fully completed and review-closed.

## Phase 7 unit 1 — interaction polish (overlay, drawer, motion)

Implemented 2026-09-10 as the first dependency-safe Phase 7 unit. No route
was added or removed; `/`, `/shop`, and `/shop/[slug]` card consumers plus
every route rendering the global `CartDrawer` inherit the polish with no URL,
metadata, or data-contract change.

Scope was limited to the two AGENTS.md §7 gaps plus their motion/focus
consistency: the card overlay is no longer hover-only, the drawer meets the
modal contract, and touched transitions reuse certified tokens under the
global reduced-motion reset. No cart-model, pricing, checkout, comparison,
filter, gallery, carousel, pagination, blog, or contact change was made.

Decisions: the overlay keeps its reference dark-wash design but renders at
every width (`display:flex` with opacity/visibility, `pointer-events:none`
until revealed) and reveals on hover **and** `:focus-within`; image and title
links keep the product name to the same `/shop/[slug]` while the overlay
action carries the visible label plus the product name (`View product:
{name}` via a screen-reader suffix, so the accessible name contains the
visible label per WCAG 2.5.3), giving keyboard users one clear destination
with a documented naming decision and touch users the image/title path
with no hover gate. Full component contracts live in `docs/components.md`;
this record keeps only scope, deltas, and verification. The title link is
`inline-flex` with a 44px minimum height. The drawer reuses the certified
`Sheet` primitive (dialog labelled `Your cart`, trap, Escape/backdrop
dismissal, scroll lock, focus return);
removal announces once through the provider's polite live region, and removing
the last line moves focus to the `Browse furniture` recovery link. The
empty-state solid action keeps white label text in its own span so the gold
fill keeps AA contrast against the shared `Link` ink-text cascade. No new
motion, palette, or type token was needed; `web-design-guidelines` was
reviewed against the touched files with no unresolved finding.

Reference deltas: legacy brand stays reference-only; overlay reveal on focus
and the single-destination naming are the §7 accessibility deltas; drawer
responsive width (550px maximum, nearly full-width with 16px insets at 390px)
and 140/220ms motion timing are system values, not screenshot measurements.

### Verification

Self-verification on 2026-09-10 (named `compfi-interaction-8dbc2e39d5ed`
session, dev server on :3000):

| check | result |
| --- | --- |
| focused interaction tests | passed: 2 files, 9 tests (card destination naming, badge/discount edges, token/reduced-motion/44px CSS contract, drawer Escape/focus-return, rapid open/close, last-line removal announcement + recovery focus, single-removal announcement, axe) |
| `npm run test` | passed: 25 files, 123 tests |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | passed; all routes prerender as before |
| keyboard flow | focusing the first `/shop` card image link revealed the overlay (`visibility: visible`, opacity 1, `pointer-events: auto`) and the overlay link reads `View product: Alder Dining Chair`; Enter navigates to `/shop/alder-dining-chair` |
| drawer flow | dialog `Your cart` opened with focus inside, Tab cycled within the dialog, body scroll locked (`overflow: hidden`) while open, Escape closed after the transition, focus returned to the `Open cart` trigger |
| removal flow | removing the last drawer line announced `Alder Dining Chair removed from cart.` politely and moved focus to `Browse furniture` |
| responsive | `/shop` showed `scrollWidth === clientWidth` at 1440, 1024, 768, 390, and 320px; drawer measured 550px at 1440px and 358px (390 minus 16px insets) at 390px with no page overflow |
| reduced motion | emulated `prefers-reduced-motion: reduce` collapsed overlay/drawer transitions (computed `1e-05s`) with the overlay instantly visible and usable on focus |
| axe | `/shop` 0 violations/0 incomplete; open drawer 0 violations after the empty-state contrast fix (axe mid-transition reads were re-taken at rest; `aria-hidden-focus` remains an expected modal-inert incomplete manually verified via the focus trap) |
| console | dev HMR/React-DevTools messages plus the pre-existing Next LCP image hint only; no page errors |
| screenshots | `/tmp/compfi-interaction-{1440,1024,768,390,320}.png` plus `/tmp/compfi-interaction-drawer-{1440,390}.png` |
| review-fix re-verification | named `compfi-interaction-review-9f3a2c` session confirmed the corrected overlay name (`View product: Alder Dining Chair`), focus-within reveal (`visibility: visible`, opacity 1), no overflow at all five widths, drawer trap/scroll-lock/Escape/focus-return, reduced-motion `1e-05s`, and `web-design-guidelines` pass on `components/commerce/product-card.tsx` |

### Independent review (2026-09-10)

Review base `620a96b36420d539483087dddf4a4eaca195c9a6...HEAD` covered
`f064ad4` and `2219c81` against `prompts/20-polish-card-overlay-drawer-motion.md`
plus `AGENTS.md` §§2.4, 3.2–3.4, 6–7, 9, 12–13 and the owning docs.

- Standards: 2 findings. Worst (hard): overlay `aria-label="View {name}"`
  did not contain the visible `View product` text (WCAG 2.5.3 Label in Name).
  Accepted and fixed by rendering `View product` plus a screen-reader
  `: {name}` suffix with no `aria-label` override. Second (hard, docs):
  `docs/pages.md` restated the component contract owned by
  `docs/components.md`; accepted as a docs pointer fix in this closure.
- Spec: 7 findings (3-stop tab path, touch overlay gating, busy guard,
  count/subtotal politeness, axe automation coverage, contrast-wrapper scope,
  visibility-easing mechanics). All rejected with evidence: the spec permits a
  documented naming decision for the shared destination; touch users keep the
  image/title path to the same destination; removal is synchronous so no
  busy guard applies; removal is politely announced with count/subtotal
  perceivable in the DOM; `/` and open-drawer axe were covered by the named
  browser run; the contrast span fixed a verified axe defect; the visibility
  easing keyword is harmless discrete-property mechanics.
- Fix verification: focused 2-file/9-test interaction suite, full 25-file
  suite, lint, TypeScript, and production build pass after the fix. The fix
  touches only the card leaf's accessible name (no public API, primitive,
  data-flow, or security change), so no second full two-axis re-review was
  required. Unit 1 is review-closed; Phase 7 remains open.

## Blog (`/blog`)

Implemented 2026-09-10 as the second and final Phase 6 content unit. The
server route owns metadata (`Blog | Compfi`), the existing banner hero with
Home / Blog breadcrumbs, one main landmark, a `Container` two-column
feed/sidebar composition, and the shared benefits strip. Direct load shows
three article cards, sidebar search, five categories with exact counts
(Crafts 2, Design 8, Handmade 7, Interior 1, Wood 6), five recent posts, and
pagination for 24 fixtures across 8 pages.

State is allowlisted URL state projected by the pure `resolveBlogView`
(`lib/blog.ts`): case-insensitive `q` search across title/excerpt/category,
case-insensitive `category` filter, 3-post pages clamped to `1..totalPages`,
and clean `blogHref` URLs that preserve sibling filters while resetting the
page on filter change. Invalid categories fall back to all articles; unknown
searches render the certified empty state with a `View all articles` link.
Pagination reuses the certified primitives with the measured 60px wash
buttons and an accessible gold active fill; only the filter-status region
uses `role="status"`.

Fresh native measurement confirmed the 2880 × 7962 reference and reproduced
the `2400×4000+240+900` body field (5,331,406 white px, 42,385 black px),
the 1634px feed / 143px gap / 622px sidebar split, 1634×1000px leads, and
the photographic hero wash that production replaces with the tokenized
`PageHero`. The 1440px implementation preserves the two-column composition
inside the 1240px container; 1024px keeps fluid columns, while 768px, 390px,
and 320px stack search, feed, categories, and recent posts in DOM order.

Reference deltas are deliberate: honest reused editorial originals replace
unknown-provenance mockup crops (CSS `object-cover` inside the measured
frames); the active pagination fill uses `--color-brand-action` so white
numerals keep AA contrast against the reference `#B88E2F`; title and
read-more links target `/blog#{slug}` because no article reader route exists
in this unit; search is a page-level grid sibling (not nested in the
sidebar) so DOM order matches the single-column visual order on mobile with
no CSS reordering; 1024px keeps flexible two columns with a reduced gap
while 768px and below stack search, feed, and widgets in DOM order; the
two-argument `blogHref` threads current filters through
every link where the prompt sketched a single partial; and tablet/mobile
structure, focus treatment, 44px targets, and reduced motion are
implementation decisions not proven by the desktop screenshot.

### Verification

Self-verification on 2026-09-10:

| check | result |
| --- | --- |
| focused blog tests | passed: 1 file, 7 tests (projection defaults/counts, category/page clamping, search/invalid/empty, URL builder, default/category/empty route states with DOM search-before-feed order, ISO times, axe) |
| `npm run test` | passed: 23 files, 114 tests |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | passed with the default Turbopack pipeline; `/blog` renders dynamic on demand |
| browser customer flow | named `compfi-blog-8dbc2e39d5ed` session passed direct load, Wood category filter (`?category=wood`, status, current marking, page reset), linen search (`?q=linen`, retained results), empty search recovery, page-2 navigation with changed articles, and unchanged-article card/heading/link naming |
| responsive screenshots | inspected `/tmp/compfi-blog-{1440,1024,768,390,320}.png`; all five widths matched the recorded layout decisions with `scrollWidth === clientWidth` |
| reduced motion and accessibility | reduced-motion emulation matched with `scroll-behavior: auto`; axe audit reported 0 violations/0 incomplete/45 passes; console showed only dev HMR/React-DevTools messages with no page errors |
| keyboard | skip link first in tab order with a logical DOM path through search, articles, categories, recent posts, and pagination |
| Web Interface Guidelines | fresh rules reviewed against all new/changed UI files; placeholder ellipsis (`…`) and a 44px search-submit target were corrected and re-verified |

Independent two-axis review is closed; this completes Phase 6.

The implementation commit is `f65c357`. The initial independent review
reported four Standards findings and six Spec findings. Accepted and fixed
in `df0d177`: certified Pagination primitives replace the hand-rolled nav,
clear-search routes through `blogHref`, raw component geometry moves to
blog tokens, and search becomes a page-level grid sibling so DOM order
matches the single-column mobile order with flexible two columns retained
through 768px. Rejected with evidence: prompt-mandated `BlogPost` naming
and stateless `"use client"` (since removed), semantic token utilities,
catalog-parity view-model fields, global reduced-motion handling, the `Prev`
label (60px geometry with full aria-labels), and illustrative token names.
The worst Standards issue was the missing native-prop contract (resolved by
documenting the explicit-props decision with the owned-slot rationale and
shop precedent); the worst Spec issue was the mobile search order.

The second review reported two remaining Standards findings and no new Spec
findings. Both were accepted and fixed in `af93de4`: the unneeded client
boundary was removed from the stateless search form and the filter-status
radius plus tablet sidebar width were tokenized. Final re-review from the
original `299b3c5` base reported zero Standards findings and zero Spec
findings. No verified blocking issue remains, and nothing was pushed.

### Date modernization (2026-09-11)

In direct response to the durable ALWAYS rule added on 2026-09-11 ("Always make
sure the dates used across all the pages are the latest"), all 24 editorial post
fixtures in `lib/blog.ts` were modernized from legacy 2022 mockup dates to the
current 2026 calendar, leading with `11 Sep 2026` (`2026-09-11`).

- **Reference delta**: Replace 2022 template dates from `design/9-Blog.png` with
  descending 2026 publication dates (`11 Sep 2026` down to `01 Apr 2026`). The
  mockup reflects its 2022 Figma export date; Compfi is an active 2026 storefront
  where stale dates undermine customer trust and contradict the current sitemap
  and footer metadata.
- **Data integrity**: Every `date` string follows `DD MMM 2026` and every
  `dateTime` attribute strictly matches ISO-8601 `YYYY-MM-DD` (`2026-MM-DD`).
- **Tests**: `test/blog.test.tsx` was expanded with assertions verifying that all
  24 fixtures have valid 2026 dates and ISO datetimes, and that both the article
  feed and the "Recent Posts" sidebar render current 2026 dates.
- **Verification**: All 27 test files (140 tests) passed cleanly. Named
  `agent-browser` session (`compfi-8dbc2e39d5ed`) verified `/blog` at 1440, 768,
  and 390px viewports (`scrollWidth === clientWidth`, 0 axe violations, 45 passes).

## Contact (`/contact`)

Implemented 2026-09-10 as the first Phase 6 content unit. The server route
owns metadata (`Contact | Compfi`), the existing banner hero with Home /
Contact breadcrumbs, one main landmark, the focused contact block, and the
shared benefits strip. Direct load shows concise Compfi inquiry guidance and
a blank name/email/message form with no delivery claim.

The form review is synchronous and client-only. It prevents native
submission, holds only error/status state, focuses a linked error summary,
preserves typed values, clears stale field errors and success feedback on
edit, and announces `Message checked. It was not sent and no email was
delivered.` for valid synthetic input. It has no subject taxonomy, form
action, server action, request, persistence, ticket, email, policy, or
confirmation state.

Fresh native measurement confirmed the 2880 × 4730 reference, reproduced the
`2880×550+0+3100` benefit band (`#FAF3EA` 1,462,171 px, `#242424` 35,404 px,
`#898989` 11,492 px), and confirmed unknown-provenance hero photography, so
production uses the tokenized hero wash. The 1440px implementation preserves
the quiet two-column details/form hierarchy inside the 1240px container;
1024px uses flexible columns, while 768px, 390px, and 320px use logical
one-column flow.

Reference deltas are deliberate: the send action becomes a `Check message`
non-transactional review with honest preview copy; the reference subject
taxonomy is omitted rather than invented; template address/phone/hours/map
facts are omitted, not relabeled; tablet/mobile structure, validation, focus
recovery, privacy limits, and reduced motion are implementation decisions not
proven by the desktop screenshot.

### Verification

Self-verification on 2026-09-10:

| check | result |
| --- | --- |
| focused contact tests | passed: 1 file, 5 tests (pure validation, bounds, blank/invalid email, presentation, review flow, retained values, stale-success clearing, axe) |
| `npm run test` | passed: 22 files, 106 tests |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | passed with the default Turbopack pipeline; `/contact` prerendered as static content |
| browser customer flow | named `compfi-contact-8dbc2e39d5ed` session passed direct load, empty-submit summary/errors/focus, per-field `aria-invalid`/`aria-describedby`, error clearing on edit, valid review with exact announcement, retained inputs, unchanged URL, no POST, and stale-success clearing |
| responsive screenshots | inspected `/tmp/compfi-contact-{1440,1024,768,390,320}.png`; all five widths matched the recorded layout decisions with `scrollWidth === clientWidth` |
| reduced motion and accessibility | reduced-motion emulation matched with `scroll-behavior: auto` and collapsed transitions; axe audit reported 0 violations/0 incomplete/43 passes; console showed only dev HMR/React-DevTools messages |
| zoom/reflow | contact layout stayed in-bounds at 200% root text; the remaining document overflow at 200% comes from pre-existing global header chrome and is out of scope for this unit |
| keyboard | skip link first, logical DOM order through fields and review action, visible focus treatment |
| Web Interface Guidelines | fresh rules reviewed against all changed UI files; placeholder ellipsis and long-word wrapping findings were corrected and re-verified |

Implementation commit `fd48719` received the mandatory dual-axis independent
code review on 2026-09-10 against base `08a9af5`. Standards reported 3
violations and 2 baseline smells; the worst hard violation was an `<h2>` heading
inside the form error summary alert interrupting the page section outline under
the main section `<h2>`. Spec reported 3 findings; the worst was a lack of
defensive null-safety in `reviewContactDetails` when encountering undefined
properties.

Review dispositions:
- Standards violation 1 (heading hierarchy): Accepted. The error summary title
  now uses `<h3 className="font-semibold">` to preserve a logical heading
  hierarchy inside the section.
- Standards violation 2 (geometry tokens): Rejected with evidence. The
  `--contact-*` tokens are surface-specific component geometry explicitly
  mandated by Prompt 17 based on measured reference dimensions; AGENTS.md § 6.1
  permits component tokens when semantic roles cannot express component
  contracts, and sharing them with checkout would couple two separate domain
  surfaces.
- Standards violation 3 (docs index sync): Accepted. `AGENTS.md` documentation
  index was updated to reflect current comparison, checkout, and contact
  documentation status.
- Standards baseline smells (duplicated layout / duplicated regex): Rejected with
  evidence. The layout geometry is intentionally surface-scoped; extracting a
  shared regex across checkout and contact would violate task boundary rules by
  editing pre-existing checkout code without a bug.
- Spec finding 1 (trimmed blank email test): Accepted. `test/contact.test.tsx`
  now tests trimmed blank email input producing the required message.
- Spec finding 2 (explicit type attribute): Accepted. `name` field in
  `components/contact/contact-form.tsx` now explicitly declares `type="text"`.
- Spec finding 3 (defensive null-safety): Accepted. `reviewContactDetails` now
  normalizes fields with `(details[fieldName] ?? "").trim()` and is covered by a
  dedicated unit test.

The accepted fixes are committed as a local review-fix commit (`dcc353c`). Focused tests (1
file, 6 tests), full test suite (22 files, 107 tests), lint, TypeScript, and
production build pass cleanly with zero errors. Contact is verified and
review-closed; blog (`/blog`) is the remaining unit of Phase 6.

## Product comparison (`/comparison`)

Implemented 2026-09-09. Missing `product` query state presents Atlas Bed and
Haven Sectional; repeated known `product` values provide shareable selection
state up to three products, while an explicit empty value renders the empty
state. The native GET picker preserves selected allowlisted values and remove
links construct only fixed internal comparison URLs. The table compares only
fixture-backed price, category, descriptions, sizes, and finishes.

The reference's unknown-provenance photographic hero is represented by the
approved wash. Unsupported material, dimensions, rating, warranty, shipping,
support, inventory, and cart actions are omitted, so the page is intentionally
shorter. Desktop uses its quiet product-summary row and wide table; tablet and
mobile stack summaries while preserving a labelled table scroll region.

Verification: focused tests, full Vitest suite, ESLint, and TypeScript passed.
Local browser inspection covered 1440, 1024, 768, 390, and 320 CSS px; axe
reported zero violations after the semantic table adjustment. Screenshots are
temporary at `/tmp/compfi-comparison-*.png`.
The webpack production build compiled successfully, but its final verification
could not run while the existing development server retained `.next/dev/lock`;
this is an environment limitation, not a passing build result.

## Product-detail commerce browsing

All eight `/shop/[slug]` routes resolve from the immutable catalog fixture,
await Next.js 16 promised params, prerender known slugs through
`generateStaticParams`, and provide product-specific title and description
metadata. Unknown slugs terminate through `notFound()` and render the local
recoverable not-found state with `noindex`. Colocated loading and safe error
boundaries preserve the route hierarchy without exposing exception details.

The native 2880×6214 reference was opened and measured before implementation.
Its compact wash is exactly `#F9F1E7` from raster y=228–421 (194px, interpreted
as 97 CSS px); the global reviewed header remains 100 CSS px despite this
export's 228px raster discrepancy. The desktop summary uses the measured
76×80px thumbnail rail, 423×500px lead frame, and approximately 106px column
separation. Product information uses two 605×348px landscape frames with a
29px gap, and related products reuse the existing four-column card grid.

The gallery is the only image-state client leaf. Product options compose the
existing certified size, finish, and quantity controls; their selections are
demonstrative and local. Add-to-cart now sends a valid configured selection to
the transient tab-local cart model, with restrained live feedback.
explanation, while comparison is a shareable catalog-browsing link. No stock,
delivery, review, rating, warranty, cart, comparison store, or transient
success claim was introduced. Information tabs expose only
catalog-backed description, ID, category, and configured choices.

The first browser run identified the selected lead as the route's LCP image and
Next emitted its specific above-fold eager-loading warning. That observed LCP
evidence supports `loading="eager"` plus high fetch priority on the selected
lead only; thumbnails, information media, and related products remain lazy.
Card navigation also reproduced Next 16's smooth-scroll transition warning.
The documented framework fix, `data-scroll-behavior="smooth"` on the root HTML
element, is the narrowly authorized root-layout exception: it lets Next
temporarily use automatic scrolling between routes while the existing global
smooth-scroll preference remains intact. A subsequent named-browser navigation
run verified the marker and no new application error.

Desktop retains the reference's image-led side-by-side summary. At 1024px the
same hierarchy remains compact; below 800px the gallery and summary stack, the
thumbnail rail becomes horizontal, information media stacks at mobile, and
related cards follow the certified 3/2/1-column grid. Generated detail imagery
and its exact prompt/provenance contract are recorded in `docs/catalog.md`.

Reference deltas are deliberate: three truthful unique images replace the
reference's four-thumbnail repetition; Compfi USD fixtures and copy replace
the template brand and mixed locale; low-contrast reference gray is replaced
by semantic accessible muted text; unsupported purchasing controls
are honest disabled controls; and responsive layouts are derived because no
mobile comp was supplied.

Verification on 2026-09-09:

| check | result |
| --- | --- |
| focused product-detail tests | passed after review fixes: 5 files, 27 tests; malformed catalog rejection, related edges, PageHero owned state, gallery reset/announcement/empty naming, Tabs contracts and complete keyboard modes, options present/absent and bounds, all eight route states, USD, and axe coverage |
| `npm run test` | passed after review fixes: 18 files, 84 tests |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | environment-limited: Turbopack's PostCSS worker could not bind its internal port (`Operation not permitted`) |
| `npm run build -- --webpack` | passed; compiled, type-checked, and prerendered all eight `/shop/[slug]` paths |
| direct route matrix | all eight catalog URLs rendered one product-specific `h1`, matching Compfi metadata, one `main`, and zero horizontal overflow; unknown slug rendered `Product not found`, `/shop` recovery, and `noindex` |
| browser navigation | product-card click, back, forward, and reload retained the correct Alder route and heading |
| browser interaction/accessibility | gallery selection, size, finish, quantity, tabs, and keyboard focus exercised; final axe audit reported 0 violations and 0 incomplete results |
| browser reflow/motion | zero horizontal overflow at 1440, 1024, 768, 390, and 320px; 200% root text showed no overflow; 320px supplied the WCAG 400% reflow equivalent; reduced-motion matched and collapsed transitions to 0.01ms |
| screenshots | inspected `/tmp/compfi-product-detail-{1440,1024,768,390,320}.png`; hierarchy and responsive stacking matched the recorded decisions; `/tmp/compfi-product-detail-contact-sheet.webp` records all 16 selected generated images |
| Web Interface Guidelines | fresh official rules reviewed; inactive tab contrast and an invalid naming target were found in-browser, corrected, and re-audited with no unresolved issue |

The implementation commit is `8a4540f`. Initial independent review reported
four documented Standards violations and one heuristic smell; its worst issue
was caller-overridable stable component state. The stable PageHero/Tabs slots,
named Tabs prop exports, empty-gallery naming, and purpose-named geometry tokens
were accepted and fixed. The possible catalog data-clump smell was resolved at
the contract boundary with complete lead/gallery equality checks; adding a
fixture factory solely to shorten eight static records was rejected as weaker
locality and speculative generality.

The independent Spec review reported five findings; its worst issue was gallery
selection and live-region state surviving a product round trip. The reset bug,
empty native prop, and missing automated matrix were accepted and fixed. The
lead-priority finding identified missing documentation rather than an invalid
implementation, so the observed LCP warning is now recorded above. The root
layout scope finding was rejected: the approved prompt explicitly permits a
verified, documented, tested in-scope defect, and Next's warning plus the
post-fix named-browser route transition establish that exception. Complete
re-review results from the original base follow after the fix commit. After the
fixes, focused tests passed 5 files / 27 tests, the full suite passed 18 files /
84 tests, lint and TypeScript passed, the default build repeated only the known
restricted Turbopack worker-port failure, and the webpack build compiled,
type-checked, and prerendered all eight slugs.

Review fixes are committed as `1d8f5c3` (gallery/Tabs/contracts/tests) and
`6577a17` (stale PageHero record and lead-ratio token). The complete Spec
re-review from the original `f45c1e9c` base reported zero remaining findings.
The complete Standards re-review initially found those last two documentation/
token mismatches; after `6577a17`, its final confirmation reported zero
documented violations and zero heuristic smells. No verified blocking issue
remains, and nothing was pushed.

## Home inspiration and editorial completion

The reviewed Home foundation now continues with a 670px desktop inspiration
band and a full-bleed nine-image editorial mosaic before the global footer.
The shared `BenefitsStrip` remains certified and used by Shop but is absent
from Home to match the reference. Copy uses `Rooms to make your own` and
`#CompfiAtHome`; the hashtag is text, not a social link or submission claim.

Native evidence confirms `#FCF8F3` from y=5526 through y=6865, an 808×1164
raster lead image at x=1128, and 32-raster-pixel mosaic gutters. Compfi maps
those to a 670px band, 404×582px lead frame, and 16px full-bleed grid gaps.
Desktop shows a dominant and partial next slide; tablet stacks copy above a
primary/peek carousel; 390px retains a varied mosaic; 320px uses readable
single-column images.

The carousel does not auto-rotate. Previous/next controls, four named dots,
positional labels, `aria-current`, and one polite status provide non-drag
navigation. The primitive releases both Embla listeners. Reduced-motion
navigation jumps immediately, and nested links keep native arrow-key behavior.
All thirteen original editorial WebPs are local, lazy, distinct, and rendered
with exact intrinsic dimensions. Fixture, copy, gallery, and image composition
stay server-owned; only the carousel wrapper enters the client graph.

Evidence is retained in `/tmp/compfi-home11.bwIsT7`: native crops, contact
sheet, five viewport screenshots, and full-height 1440/390/320 captures.
Chromium CDP verified real pointer and Space-key room 1→2 navigation, retained
keyboard focus, pointer dot navigation to room 4, disabled first/last
boundaries, native Enter-key link navigation to `/shop`, refresh reset, no
auto-rotation before or after refresh, reduced-motion selection, lazy gallery
images, zero horizontal overflow at 1440, 1024, 768, 390, and 320px, and
visible in-viewport controls with no overflow at 200% text. `agent-browser` was
unavailable with `command not found`, so the approved Chromium fallback was
used. The fresh Web Interface Guidelines review found no unresolved issue:
navigation uses links, state changes use buttons, icon controls are named,
image loading and dimensions are explicit, focus is visible, and reduced
motion is honored.

Self-verification on 2026-09-08: focused Home/editorial/carousel tests passed
(3 files, 8 tests); the complete suite passed (15 files, 66 tests); lint and
`npx tsc --noEmit` passed. Turbopack failed only at its known restricted
PostCSS worker port bind (`Operation not permitted`); the required webpack
fallback compiled, type-checked, and prerendered `/` successfully.

The first two-axis review from the immutable base reported three Standards
findings (two documented violations and one smell) and three Spec findings.
All were accepted: Home blocks now forward native props, responsive component
contracts are documented, unused focal-position fields were removed, 390px
keeps a varied two-column mosaic with accurate image sizing, carousel tests
cover all destinations plus first/middle/last controls, reduced motion,
rerendering, and listener cleanup, and full verbatim generation prompts are
preserved. No scope creep was found. The worst Standards issue was the missing
native-prop contract; the worst Spec issue was the incorrect 390px layout.

The first re-review reported two Standards findings, one optional smell, and
two Spec findings. All were accepted: the caption contract now says overlay,
owned slots/heading relationships cannot be overwritten by forwarded props,
shared media fields have one type, every gallery placement has a breakpoint-
accurate `sizes` hint, and tests prove the final disabled boundary plus the
reduced-motion jump path. The worst Standards issue was stale caption
documentation; the worst Spec issue was underestimating wide mosaic images.

The second re-review reported one Standards finding and one Spec finding. Both
were accepted: carousel items and controls now protect their owned slots,
roles, and boundary-disabled state while preserving caller props, and the
expanded Chromium run now covers actual pointer/keyboard input, link
activation, focus persistence, refresh/no-auto behavior, reduced motion, and
200% text. The Standards finding was an owned-state override risk; the Spec
finding was incomplete real-browser interaction evidence.

The final cumulative re-review from the original immutable base reported zero
Standards findings and zero Spec findings. No verified blocking issue remains.

## Shop commerce browsing

`/shop` is a request-time Server Component. Its allowlisted URL state resolves
from the immutable catalog fixture through `lib/catalog-view.ts`: category,
stable locale-aware/name or integer-cent price sort, grid/list presentation,
page size, and clamped one-based page. The canonical helper omits defaults,
retains supported state, and resets pagination whenever result shape changes.

The native 2880 × 6948 Shop reference was rechecked with native crops. Its
`#F9F1E7` controls band begins at y=830 raster (415 CSS px) beneath the 630
raster-pixel hero; the four-card first row retains the established 570-raster
pixel cards and 64-raster-pixel gaps (285/32 CSS px). Compfi renders its eight
real products once, with page size 8 by default and real two-page pagination
only at page size 4.

The filter is a labelled native disclosure with ordinary local category links.
Sort, page-size, and mutually exclusive view selection form the single small
client leaf; all result data and cards stay server-rendered. At desktop the
controls form a two-sided band and list view places existing card media beside
existing content. Controls wrap at tablet, then stack; both views converge to
one readable card column at narrow widths.

Reference deltas: the page hero remains the approved tokenized wash because no
licensed local hero photo exists. Compfi removes unbacked product actions and
the reference's repeated template items, mixed currency, warranty, shipping,
and support claims.

Verification on 2026-09-08: focused catalog/page tests passed (5 tests);
`npm run test` passed (13 files, 55 tests); `npx tsc --noEmit` and `npm run
lint` passed. Turbopack build remains sandbox-limited because its PostCSS worker
cannot bind an internal port; the required `npm run build -- --webpack` fallback
compiled and completed type checking. Fresh native crops confirmed the 630px
hero, y=830px `#F9F1E7` control-band transition, 570px first-row cards, and
64px gaps, interpreted at the established 2:1 raster-to-CSS scale.

Chromium screenshots and crops are retained in
`/tmp/compfi-shop-verify.FPTlQJ`: desktop, 1024px, 768px, 390px, and 320px
grid captures plus a desktop list capture. The real-browser matrix
verified one main landmark, four results and truthful `Showing 1–4 of 8
products` on page size 4, and no horizontal overflow at 1440×1000, 1024×900,
768×1024, 390×844, or 320×720. Direct URLs verified list view and page-two
rendering. The `agent-browser` executable was still unavailable; an isolated
Chromium/webpack fallback supplied the screenshots without changing production
dependencies. The fallback server logged only Next's expected development-HMR
origin warning. The view group now marks its selected item with Base UI's
`data-composite-item-active` contract, giving Grid view the roving `tabindex=0`
entry point and List view `tabindex=-1`; the focused Shop test verifies that
contract. Arrow keys move between the two controls under Base UI's documented
composite behavior.

The fresh Web Interface Guidelines review found no unresolved Shop-page issue:
navigation uses links, controls have accessible names, icons are hidden when
decorative, loading state has `aria-busy`, product images carry intrinsic sizes
and local alternatives, number/currency display uses the shared formatter, and
focus styles use `focus-visible`. The completion pass also corrected an RSC
boundary defect: `ShopControls` now receives only the normalized five-field
options record rather than serializing the full catalog view model into its
client leaf.

Initial two-axis review from `5625e3c...9d29ddb` recorded two Standards
findings (missing Shop component contracts and undocumented component geometry)
and two Spec findings (incomplete Shop-state coverage and absent completion
record). All four were accepted. The review-fix commit restores native pagination
link semantics, expands model/loading/empty/error/pagination coverage, and
documents the Shop contracts and measured component tokens. The Standards
review's duplicate ProductGrid breakpoint observation was accepted and
consolidated; its centralized sort conditional is a deferred low-risk heuristic,
not a documented violation.

The implementation is `696c8e1`; the completion and review-fix commits are
`9d29ddb` and `a70e7a3`. The headless fallback did not provide an interactive
400% reflow or reduced-motion assertion, so those remain explicitly unverified
rather than inferred from the desktop references.
## Home commerce foundation

The Home route now renders the campaign, room navigation, all eight canonical
catalog products, inspiration carousel, and editorial gallery inside its single
`main#main-content` landmark. The upper foundation remains unchanged; its
lower-page completion is recorded above.

### Reference evidence and production interpretation

| surface | native reference measurement | Compfi production decision |
| --- | --- | --- |
| campaign band | Home image-led region begins beneath the 200-raster-pixel header and ends near y=1620 | 710 CSS px desktop campaign block below the existing 100 CSS px header; local 3:2 hero image fills it at large widths |
| campaign panel | `1286 × 886 + 1478 + 506` raster `#FFF3E3` region | 643 × 443 CSS px cream panel, vertically centered and 58 CSS px from the 1440px viewport edge; it stacks below the image below 1024px |
| room navigation | `762 × 960` raster room crop at x=262–1023, y=2016–2975 | Three 381 × 480 CSS px portrait crops in a 1180 CSS px row with 18 CSS px gaps at desktop; 3/2/1 columns at 1024/640/320px pressure points |
| featured cards | `570 × 892` raster card, including a `570 × 602` image field; 64-raster-pixel column gap | Flat four-column desktop list within the 1240px container, with a 285:301 media field and 32 CSS px gaps; 3/2/1 columns at 1024/768/390px |
| lower boundary | inspiration wash begins around y=5526 raster | The completed inspiration band begins after featured products and the editorial mosaic transitions directly to the footer |

### Responsive and interaction decisions

- The 1440px hierarchy uses a right-side cream campaign panel, three tall room crops, and four product columns. At 1024px, the campaign remains image-led, rooms and products use three columns. At 768px rooms and products use two columns and the panel becomes normal-flow content; at 390px and 320px rooms and products each use one column.
- The campaign image is decorative because its adjacent HTML copy carries the message. Room images have contextual alt text; product images retain the fixture alt unchanged.
- The only preloaded image is the campaign hero. Room and catalog images use local paths, intrinsic dimensions, accurate responsive `sizes`, and default lazy loading.
- Product actions are navigation only: image/name links are always available; the overlay is a redundant `View product: {name}` link (visible `View product` plus a screen-reader product-name suffix) revealed by hover or `focus-within` at every width. An inset media focus ring remains visible when the image link triggers the overlay. No cart, comparison, favorite, stock, rating, review, or purchase control was added.

### Reference deltas

- Compfi copy, Poppins, local original WebP imagery, and coherent USD-cent fixtures replace the reference brand, template copy, unknown-source photography, and mixed-currency values.
- `Shop the collection` is navigation to `/shop`, not an unsupported immediate-purchase claim.
- The reference grid's add-to-cart/share/compare/like controls are omitted until their backed behavior exists. Sale badges use a calculated 15% discount from the fixture's integer cents; new products say `New`.
- Tablet and mobile flows are responsive decisions derived from the desktop hierarchy; normal-flow campaign copy, focus treatment, 44px actions, and no-overflow layouts take precedence over desktop overlap.

### Verification

Self-verification on 2026-09-08:

| check | result |
| --- | --- |
| focused Home/product tests | passed: 2 files, 3 tests; semantic landmarks, customer links, USD, badges, image alternatives, and axe checks covered |
| `npm run test` | passed: 11 files, 50 tests |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | environment-limited: Turbopack's PostCSS worker could not bind its internal port (`Operation not permitted`) |
| `npm run build -- --webpack` | passed; `/` prerendered as static content |
| browser rendering | local Chromium screenshots inspected at 1440, 1024, 768, 390, and 320 CSS px; hero, room, and product hierarchy matched the recorded responsive decisions without observed clipping or horizontal overflow |
| browser tooling delta | the requested `agent-browser` executable was not installed. Its local Chromium fallback was used to inspect temporary screenshots under `/tmp/compfi-home-*.png`; no production dependency or asset was added. |
| Web Interface Guidelines | fresh rules reviewed against all new/changed Home UI files; no unresolved finding after verifying native navigation, focus-visible styles, decorative/meaningful image alternatives, dimensions, lazy loading, and reduced-motion handling |

## Shared storefront chrome

## Cart

`/cart` is a server-rendered route shell with a focused client content leaf.
It uses the approved banner `PageHero`, the shared benefits strip, and footer.
The current tab's transient cart synchronizes product-detail additions, header
count, drawer rows, and this route; it deliberately resets on reload.

The 2880px Cart reference places its table from approximately x=196 to 1837
and its `#F9F1E7` totals block at approximately x=1900 with a 900 × 850px
native field. Compfi maps that evidence to the established 1240px container,
a desktop two-column grid, and a 450px maximum warm subtotal block. The Cart
Sidebar reference's 1100px native sheet remains the existing 550px maximum
with a 20% scrim. At `768px` the table intentionally becomes labelled line
item cards, avoiding horizontal overflow.

Reference deltas: fixture local WebP media and integer USD cents replace
template imagery and mixed currencies. The unsupported total and comparison
controls remain omitted. Populated cart states now link to the presentation-only
`/checkout` review boundary; empty states omit checkout actions. The cart has no
persistence, tax, shipping, discount, payment, inventory, or delivery claim.

### Reference evidence and production interpretation

| surface | native reference measurement | Compfi production decision |
| --- | --- | --- |
| Header | repeated 200 raster px bar across Home, Shop, Product, and Cart Sidebar | 100 CSS px white header; 1240 CSS px container; brand, centered desktop navigation, and right utility actions |
| Page hero | Shop photo/title area is 630 raster px tall; the later exact Product scan corrected its breadcrumb wash to y=228–421, or 194 raster px | reusable 315 CSS px generic title band plus a product-specific 97 CSS px compact breadcrumb wash |
| Benefits | Contact benefit band is 550 raster px tall | 275 CSS px desktop band with four item groups; responsive 2-column then 1-column flow |
| Cart drawer | 1100 raster px sheet from x=1780; background white changed to `#CCCCCC` | 550 CSS px maximum right sheet and 20% black scrim; narrow viewports preserve a 16 CSS px inset on each side |

The exact shared-chrome geometry is consumed through the named chrome and
wordmark tokens documented in `docs/design-system.md`.

### Components and behavior

- `SiteHeader` is server-rendered; `HeaderControls` is the small client boundary
  for pathname semantics, the mobile disclosure, and the cart leaf.
- `PageHero` accepts a small breadcrumb record (`label`, optional `href`) and a
  discriminated variant. The default `banner` requires its 315px title; the
  `compact-breadcrumb` variant forbids a title and uses the measured 97px
  product wash. Its current page is a non-link `aria-current` span, never a
  fake disabled link.
- `BenefitsStrip` owns a typed four-item local record. Its Lucide icons are
  decorative and hidden from assistive technology.
- `SiteFooter` contains only approved, non-claiming Compfi copy and route
  links. It deliberately has no address, policy, payment, newsletter, or
  service affordance.
- `CartDrawer` uses the audited Base UI sheet composition. The primitive
  supplies modal focus containment, Escape and backdrop dismissal, inert
  background, scroll locking, and trigger focus return; the chrome adapts its
  width, 20% scrim, flat surface, and motion token. The empty state uses a real
  `/shop` link styled as a primary action.

### Reference deltas

- The Shop title band is a tokenized wash instead of an image because no
  licensed local image exists.
- The reference's template footer contact data, policy claims,
  newsletter form, warranty, support hours, and shipping offer are intentionally
  absent. Cart data is intentionally transient and has no unapproved commerce
  claims.
- Keyboard focus, 44px targets, motion reduction, responsive navigation, and
  no-overflow mobile behavior are deliberate accessibility additions not proven
  by the desktop references.

### Verification

Self-verification on 2026-09-07:

| check | result |
| --- | --- |
| `npm run test` | passed: 8 files, 42 tests; shared chrome interactions and axe checks included |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | environment-limited: Turbopack's PostCSS worker cannot bind an internal port in the restricted sandbox (`Operation not permitted`) |
| `npm run build -- --webpack` | passed; `/` and `/design-system` prerendered as static content |
| browser interaction | desktop cart opens as a named modal with empty-state description and closes with Escape; mobile menu exposes its state, opens primary links, and closes with Escape |
| browser reflow | no document overflow at 1024, 390, and 320 CSS px (`scrollWidth === clientWidth`) |
| screenshots | inspected temporary desktop, small-desktop, mobile, and narrow-mobile screenshots under `/tmp/compfi-phase3-*.png`; visual hierarchy and responsive stacking match the measured chrome evidence, with documented intentional deltas |
| Web Interface Guidelines | reviewed against the fresh Vercel rule set; no unresolved finding after using a real link for the browse action and adding sheet overscroll containment |

Initial independent review found and resolved two Spec issues (PageHero height
and fake current-page link) and four Standards issues (semantic scrim/motion and
named chrome geometry tokens). The subsequent Standards re-review found and
resolved the remaining geometry/wordmark token gaps and documentation-status
inconsistency; Spec re-review initially reported no remaining finding. The next
full review accepted a docs-lifecycle correction, intermediate breadcrumb
semantics, 44px text-link target fixes, drawer insets on both narrow sides, and
the certified sheet's public props export. Final cumulative re-review from the
original base reported zero Standards findings. Its final Spec pass found the
benefit heading at 20px rather than the required 24px; that one-line,
behavior-preserving typography correction is committed separately after the
same test, lint, and TypeScript checks passed.

## Checkout (`/checkout`)

Implemented 2026-09-09 as the remaining Phase 5 presentation unit. The server
route owns metadata, the existing banner hero with Home / Cart / Checkout
breadcrumbs, one main landmark, the focused client checkout block, and the
shared benefits strip. A direct empty load shows only the certified recovery
state and Shop link. A populated tab-local cart shows blank uncontrolled US
contact/address fields, a read-only United States value, canonical product
configuration and integer-cent subtotal, an explicit unavailable-payment
explanation, and `Check details`.

The form review is synchronous and client-only. It prevents native submission,
holds only error/status state, focuses a linked error summary, preserves typed
values and cart lines, clears stale field errors and success feedback on edit,
and announces `Details checked. No order was placed and no payment was
processed.` for valid synthetic input. It has no form action, server action,
request, persistence, order, payment control, tax, shipping, discount,
inventory, policy, or confirmation state. Populated cart page and drawer states
now expose real `/checkout` links; empty states omit them.

Fresh native measurement reproduced the `2200×3000+300+900` Checkout crop and
its 6,454,154-pixel white field. The measured body starts near y=1050, with
approximately 454px/527px columns, a 145px gap, 75px controls, a 1px summary
rule, and a 318×64px outline action under the established 2× interpretation.
The 1440px implementation preserves that quiet two-column hierarchy; 1024px
uses flexible columns, while 768px, 390px, and 320px use logical one-column
flow with name fields stacking below 480px.

Reference deltas are deliberate: Compfi copy, Poppins, USD fixtures, a
tokenized hero wash, a display subtotal, an unavailable-payment explanation,
and a non-transactional review action replace the legacy brand, mixed currency,
photograph, unsupported grand total, bank/cash choices, policy claim, and
misleading order action. Tablet/mobile structure, validation, focus recovery,
privacy limits, and reduced motion are implementation decisions not proven by
the desktop screenshot.

### Verification

Self-verification on 2026-09-09:

| check | result |
| --- | --- |
| focused checkout/cart/field tests | passed: 3 files, 13 tests |
| `npm run test` | passed: 21 files, 101 tests |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | environment-limited: Turbopack's PostCSS worker could not bind its internal port (`Operation not permitted`) |
| `npm run build -- --webpack` | passed; `/checkout` prerendered as static content |
| browser customer flow | named `compfi-checkout-8dbc2e39d5ed` session passed product add → populated drawer → Checkout, Cart → Proceed to checkout, direct empty reload, invalid focus recovery, valid review, stale-success clearing, retained values/cart, no URL change, no POST, and modal Escape/focus return |
| responsive screenshots | inspected `/tmp/compfi-checkout-{1440,1024,768,390,320}.png`; all five widths matched the recorded layout decisions and had `scrollWidth === clientWidth`; 320px supplies the effective 400% reflow width for a 1280px desktop viewport |
| reduced motion and accessibility | reduced-motion media emulation matched; populated axe audit reported 0 violations/0 incomplete/43 passes and empty-state re-audit reported 0/0/39 after correcting the primary-link foreground contrast |
| console | no checkout runtime, hydration, or accessibility errors after clearing the earlier product-page-only LCP development warning |
| Web Interface Guidelines | fresh rules reviewed against all changed UI files; the verified primary-link contrast defect was fixed and no unresolved finding remains |

Implementation commit `4266071` received the required independent review on
2026-09-10. Standards reported 0 hard violations and 2 judgment-call smells;
the worst was duplicated field-length constraints. Spec reported 2 findings;
the worst was accepting alphabetic phone characters when the digit count was
otherwise valid. All four findings were accepted: one immutable length map now
drives validation and input attributes, summary rows use `cartLineKey`, phone
formatting rejects non-phone characters, and upper-bound tests cover every
field. The fixes were committed as `db6c11c`. Focused tests, lint, TypeScript,
and the webpack production build pass;
the full 21-file/101-test suite passes with one worker after the unconstrained
run exceeded two existing 5-second per-test limits under host load. Final
independent re-review from the original `e2bfa6c` base reported 0 Standards
findings and 0 Spec findings. Phase 5 is complete and reviewed.

## Clerk Authentication and Protected Account (`/account`, `/sign-in`, `/sign-up`) (Phase 9)

Implemented 2026-09-11 as Phase 9 of the storefront build sequence. Brings the
presentational account affordance in the desktop and mobile navigation chrome
to life using Clerk, the project's contracted identity platform.

### Surfaces and Architecture

- **Root Layout (`app/layout.tsx`)**: Integrates `<ClerkProvider dynamic appearance={{ theme: shadcn }}>` within `<body>` with `@import "@clerk/ui/themes/shadcn.css";` loaded in `app/globals.css`.
- **Server Proxy (`proxy.ts`)**: Adheres to the Next.js 16 `proxy.ts` convention, protecting `/account(.*)` with `clerkMiddleware` while keeping catalog, blog, cart, and checkout routes public and prerenderable.
- **Header Auth Controls (`components/chrome/header-controls.tsx`)**:
  - Signed-out state: Modal `<SignInButton>` wrapping `IconButton` with `UserIcon`, label `"Sign in to account"`, and min 44 × 44 px touch target.
  - Signed-in state: `<UserButton userProfileMode="navigation" userProfileUrl="/account" />`.
  - Mobile drawer: Mirrors auth actions with accessible touch targets.
- **Protected Account Route (`app/account/page.tsx`)**: Server Component verifying `await auth()`. Redirects unauthenticated requests to `/sign-in?redirect_url=/account`. Renders `PageHero` ("My Account") and `<UserProfile routing="hash" />`.
- **Dedicated Auth Routes**:
  - `/sign-in/[[...sign-in]]`: Renders Compfi `PageHero` and `<SignIn routing="path" path="/sign-in" />`.
  - `/sign-up/[[...sign-up]]`: Renders Compfi `PageHero` and `<SignUp routing="path" path="/sign-up" />`.
- **Search Engine Directives**:
  - `app/robots.ts`: Disallows `/account`.
  - Auth route metadata: `robots: { index: false, follow: false }`.
  - `app/sitemap.ts`: Excludes auth routes from sitemap.

### Verification

Self-verification on 2026-09-11:

| check | result |
| --- | --- |
| `npx -y clerk@latest doctor --json` | passed: All checks passing (CLI 3.3.0, logged in, project linked to Compfi, app reachable, env vars configured) |
| `npm run test` | passed: 28 files, 152 tests (including `test/account.test.tsx` verifying signed-out/signed-in controls, proxy route matching, server redirect, and axe a11y) |
| `npm run lint` | passed: 0 warnings, 0 errors |
| `npx tsc --noEmit` | passed: 0 errors |
| `npm run build` | passed: Next.js 16.3.4 (Turbopack) compiled successfully, generated 22 static pages and detected `ƒ Proxy (Middleware)` |
| `agent-browser` interaction | modal sign-in opens on Account click, traps focus, dismisses with Escape; direct navigation to `/account` redirects with HTTP 307 to `/sign-in?redirect_url=...`; dedicated sign-in/up routes render inside Compfi layout |
| `agent-browser` responsive | verified zero horizontal overflow (`scrollWidth <= clientWidth`) across 1440, 1024, 768, 390, and 320 px viewports; mobile drawer menu contains sign-in / account action |
| axe accessibility | 0 accessibility violations across header chrome, `/account`, `/sign-in`, and `/sign-up` |

## 100% Free Stack: SQLite Persistence, Server Actions, and Services (Phase 10)

Implemented 2026-09-11 as Phase 10 of the storefront build sequence. Delivers an entirely free, zero-cost, self-contained local persistence and backend architecture using embedded SQLite via Drizzle ORM and `@libsql/client`. Replaces mock operations with real transactional database persistence without external paid APIs, cloud databases, or payment gateways.

### Surfaces and Architecture

- **Embedded Database (`db/schema.ts`, `db/index.ts`, `db/orders.ts`)**:
  - Embedded SQLite database at `file:data/compfi.db`, untracked via `.gitignore` (`data/`, `*.db*`).
  - Drizzle ORM schema for `orders`, `order_items`, and `contact_inquiries`.
  - Automatic `ensureDbSchema()` initialization executing `CREATE TABLE IF NOT EXISTS` DDL statements on startup.
  - Queries for customer order history (`getOrdersByUserId`) and single orders (`getOrderById`).
- **Checkout Flow & Server Action (`app/actions/checkout.ts`, `components/checkout/checkout-content.tsx`)**:
  - `placeOrderAction` validates customer input with `reviewCheckoutDetails`, treats client prices as untrusted, authoritatively validates variant options and pricing from `lib/catalog.ts`, and commits the order atomically within a SQLite transaction.
  - Optionally links order to authenticated customer via `await auth()`.
  - Client checkout UI submits via Server Action, provides accessible `aria-busy` feedback, clears cart via `useCart().clear()`, and transitions to an accessible `OrderConfirmation` receipt view with order reference, placed timestamp, itemized line items, and shipping details.
- **Cart Persistence (`components/cart/cart-provider.tsx`)**:
  - Synchronizes cart items to `localStorage` (`compfi_cart_v1`) to preserve shopping state across navigation, refresh, and checkout.
- **Protected Account Order History (`app/account/page.tsx`, `components/account/order-history.tsx`)**:
  - `/account` Server Component queries `getOrdersByUserId(userId)`.
  - Renders `OrderHistory` with empty state (call to browse furniture) or populated order cards with order number, formatted placement date, status badge, interactive `<details open>` itemized disclosure with thumbnails, finish/size details, and total price.
- **Contact Inquiry Persistence (`app/actions/contact.ts`, `components/contact/contact-form.tsx`)**:
  - `submitContactInquiryAction` validates input and persists contact inquiries to `contact_inquiries` table.
  - Contact form renders submitting state and accessible positive confirmation alert banner (`role="status"`).

### Verification

Self-verification on 2026-09-11 (using named session `AGENT_BROWSER_SESSION="compfi-phase10"`):

| check | result |
| --- | --- |
| `npm run test` | passed: 31 files, 166 tests (including `test/db.test.ts`, `test/actions.test.ts`, and `test/phase10-services.test.tsx`) |
| `npm run lint` | passed: 0 warnings, 0 errors |
| `npx tsc --noEmit` | passed: 0 errors |
| `npm run build` | passed: Turbopack prerendered 22/22 routes successfully |
| `agent-browser` checkout order placement | verified end-to-end: adding product to cart, submitting checkout form, displaying Order Confirmed receipt, and verifying row in SQLite `orders` and `order_items` tables |
| `agent-browser` contact inquiry | verified end-to-end: submitting inquiry on `/contact`, displaying confirmation banner, and verifying row in SQLite `contact_inquiries` table |
| `agent-browser` responsive | verified zero horizontal overflow (`scrollWidth <= clientWidth`: true) across 1440, 1024, 768, 390, and 320 px viewports |
| axe accessibility | 0 axe violations across `OrderConfirmation`, `OrderHistory` (empty & populated states), and `/checkout` |


