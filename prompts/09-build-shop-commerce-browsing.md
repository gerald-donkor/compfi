# Build the Compfi Shop commerce-browsing surface

## Status and authorization boundary

Prepared for approval. This is the next dependency-safe unit of Phase 4. Do
not modify implementation files, generate or add assets, install packages or
skills, stage, commit, or push until this prompt is explicitly approved with
`y` or `Y`.

The starting worktree is intentionally not clean:
`prompts/08-build-home-commerce-foundation.md` is an untracked pre-existing
file whose corresponding implementation and review-fix commits are already in
history. Treat it as user-authored/unrelated state. Do not edit, delete, stage,
or commit it as part of this task.

## Goal and why this is next

Build `/shop` as the next complete commerce-browsing surface: shared Shop hero,
filter disclosure, result count, grid/list view control, stable sorting,
page-size control, product results, pagination, loading/error/empty handling,
and the existing benefits strip. Use only the eight committed Compfi catalog
fixtures and their local media.

Phases 1–3 are committed, documented, verified, and reviewed. Phase 4 now has
the typed catalog/media foundation and the reviewed upper Home commerce
foundation, including the reusable `ProductCard` and `ProductGrid`. The Shop
route is therefore the earliest unbuilt dependency-safe surface in the ordered
sequence. Product detail and comparison depend on this browse path and remain
separate later units. The deferred Home inspiration/editorial blocks require a
new editorial media contract and do not block core commerce navigation.

## Starting repository evidence

- Current branch: `main`; planning-time `HEAD` is
  `5625e3ccc8ece05c9fe64714dc3c7be7dadbc4ca`, and `main` tracks
  `origin/main`. Reconfirm branch, status, and `HEAD` immediately before
  execution, then capture the immutable `BASE_SHA` with `git rev-parse HEAD`
  before changing implementation files.
- Planning-time status contains only
  `?? prompts/08-build-home-commerce-foundation.md`. Preserve it untouched and
  stage only files named by this approved task.
- `docs/pages.md` records the reviewed Home commerce foundation and the shared
  storefront chrome. `docs/components.md`, `docs/catalog.md`,
  `docs/design-system.md`, `docs/automation.md`, and `CONTEXT.md` are current
  owners for component, fixture, token, measurement, and domain contracts.
- `lib/catalog.ts` is the sole server-safe source for eight immutable
  `CatalogProduct` records across dining, living, and bedroom. It already
  validates identity, integer USD cents, optional compare-at prices, badges,
  local image paths, useful alternatives, and intrinsic dimensions. Do not
  duplicate, mutate, supplement, or reshape fixture records in page code.
- `ProductGrid` owns semantic list layout and preserves fixture order.
  `ProductCard` owns product links, local `next/image`, USD display, truthful
  computed discount/new badges, and a redundant desktop `View product`
  overlay. It intentionally exposes no cart, comparison, favorite, stock,
  rating, review, or purchase action.
- `PageHero`, `BenefitsStrip`, `Container`, `Link`, `Button`, `Badge`,
  `Pagination`, `NativeSelect`, `ToggleGroup`, `Skeleton`, `Empty`, and the
  existing Base UI `Sheet` source are present. Reuse certified components and
  inspect any currently uncertified generated component before adopting it.
- `components.json` identifies an RSC, Tailwind CSS 4, Base UI, Lucide,
  `base-nova` shadcn project with semantic CSS variables. Do not assume Radix
  APIs, install a duplicate component, or add a Tailwind config.
- Installed Next.js 16.3.4 docs confirm that App Router pages are Server
  Components by default; a page receives `searchParams` as a Promise; reading
  it makes the route request-time rendered; and URL filtering, sorting, and
  pagination belong in that page prop. Use `PageProps<"/shop">` after generated
  route types are available, or an explicit promised record type if the local
  type-generation state requires it. Do not use the older synchronous API.
- `useSearchParams` is unnecessary when the resolved query state is passed to
  the small control leaf. If execution discovers a genuine need for that hook,
  obey the installed Suspense requirement and document why the extra client
  rendering is justified.
- The lightweight architecture-signal check found visual review churn in the
  Home CSS but no repeated commerce workflow, scattered business rule,
  caller-visible sequencing, repeated adapter, or second provider seam. It
  does not cross the Section 3.5 audit threshold. The single-letter `i`
  workflow forbids an audit now, and later `y` execution must remain within
  this approved prompt.

## Reference evidence and measured interpretation

Open `design/2-Shop.png` at its native 2880 × 6948 raster dimensions before
execution. Continue the validated two-raster-pixels-to-one-CSS-pixel working
scale from `docs/design-system.md`. Use the repeatable crop/histogram procedure
in `docs/automation.md`; distinguish observed raster evidence from production
decisions and record any refined measurements in `docs/pages.md`.

| surface | native raster evidence | CSS interpretation for this unit |
| --- | --- | --- |
| shared header | 200 raster px | existing 100 CSS px `SiteHeader`; unchanged |
| Shop hero | y=200 through about y=830, 630 raster px tall | existing 315 CSS px banner `PageHero`, with `Shop` and `Home > Shop` |
| hero imagery | pale room photograph under centered title/breadcrumb | retain the documented tokenized wash because no approved local Shop hero image exists |
| control band | begins about y=830 and is about 200 raster px tall; broad sampled fill is `#F9F1E7` | approximately 100 CSS px desktop wash band, content aligned to the existing 1240 CSS px container |
| product grid | first row begins near y=1160; four approximately 570-raster-pixel cards with approximately 64-raster-pixel gutters | reuse the 285 CSS px card basis and 32 CSS px gap already established for the four-column grid |
| card field | reference repeats template cards through four desktop rows | show only real Compfi fixture records; never repeat eight products to counterfeit 16 results |
| pagination | centered below the product results before the benefits strip | render only when the selected page size creates more than one real page; preserve 44 × 44 CSS px targets |
| benefits band | broad native sample is `#FAF3EA` and the reference band is about 550 raster px tall | reuse the reviewed 275 CSS px desktop `BenefitsStrip`; no copied warranty/shipping/support claims |
| footer | follows the benefits band | existing `SiteFooter` from the root layout; unchanged |

Before coding, make focused native-resolution crops of the hero/control
transition, complete controls band, first product row, pagination, and
benefits boundary. Validate the approximate y-coordinates and grid geometry
above rather than silently treating them as exact.

## Visual direction

This is a quiet, image-led premium furniture catalog, not a generic dashboard.
Keep the established Compfi Poppins typography, white canvas, flat product
surfaces, cream control band, gold selected state, and measured spacious rhythm.
The dense control row and product imagery carry the hierarchy; add no gradient,
shadow-card kit, decorative eyebrow, rounded-pill language, or unrelated motion.

Desktop fidelity follows the reference. Accessibility and truthful fixture
counts override copied template values. Use the existing semantic token layers;
if Shop geometry needs a stable reusable value, add a purpose-named Shop token
to `app/globals.css` and document it. Do not scatter raw colors, arbitrary
measurements, radii, shadows, or durations through components.

## URL state and data contract

Create a small pure server-safe catalog-view module rather than embedding query
parsing and sort branches in the page. Its public input is the immutable product
list plus these supported query concepts:

| query | supported values | default | rules |
| --- | --- | --- | --- |
| `category` | `dining`, `living`, `bedroom` | all categories when omitted | invalid, empty, or array values normalize to all; changing it resets `page` |
| `sort` | `featured`, `name`, `price-low`, `price-high` | `featured` | `featured` preserves fixture order; all other sorts are stable and never mutate the fixture array |
| `view` | `grid`, `list` | `grid` | affects presentation only; it never changes result order or count |
| `pageSize` | `4`, `8` | `8` | do not offer 16 or claim 32 results when only eight fixtures exist; changing it resets `page` |
| `page` | positive base-10 safe integer | `1` | invalid values normalize to 1; values beyond the final real page clamp to that page; zero results still report page 1 of 1 internally |

Return one typed resolved view model containing normalized options, filtered and
stably sorted records, total count, one-based visible start/end, current page,
total pages, and the current page slice. Keep money in cents and keep product
records immutable. Reject prototype-like or unbounded parsing tricks by
accepting only the small string union values above; no query value becomes HTML,
CSS, a filesystem path, or an external URL.

Build one canonical query-string helper that omits default values, preserves
unrelated supported Shop state, resets page when the result shape changes, and
produces local `/shop?...` URLs only. Pagination, category links, view changes,
sort changes, and page-size changes must share it rather than each hand-rolling
parameter rules.

## Component boundaries and server/client ownership

- `app/shop/page.tsx` remains an async Server Component. It awaits the current
  promised `searchParams`, resolves the catalog view model, exports unique Shop
  metadata, and orchestrates one `main#main-content` landmark containing
  `PageHero`, controls/results, pagination when needed, and `BenefitsStrip`.
- Add a server-rendered Shop results block if that keeps page orchestration
  shallow. It owns the result summary, the existing `ProductGrid`, list/grid
  presentation attributes, empty state, and pagination links. Do not copy
  `ProductCard` markup or add a `shop` boolean prop to it.
- Add one small `"use client"` controls leaf only for interactions that cannot
  be expressed as ordinary links: native sort/page-size selection, pending
  navigation feedback, and the mutually exclusive grid/list view control. Pass
  normalized serializable values and canonical local hrefs; do not pass the
  catalog array across the server/client boundary.
- Category choices are navigation, not mutable business data. Prefer ordinary
  links within a semantic native disclosure (`details`/`summary`) unless the
  measured implementation genuinely requires the existing Sheet. If Sheet is
  used, reuse its title, focus containment, Escape/backdrop dismissal, inert
  background, scroll lock, and focus return; do not hand-roll a dialog.
- Use the existing `NativeSelect` and `ToggleGroup` APIs only after checking
  their actual source and current Base UI behavior. Option sets must expose a
  single selected state without relying on color alone. Keep variant
  definitions outside render functions and avoid boolean-prop proliferation.
- Pass `data-view="grid" | "list"` at the Shop composition boundary and style
  descendants from that explicit state. At wide widths, list view places a
  restrained product image beside its existing content; at narrow widths both
  views collapse to the same readable one-column card hierarchy rather than
  forcing horizontal content.
- Extend native props and export `<Name>Props` for every new reusable component.
  Forward valid DOM props, merge `className` predictably, and expose stable
  kebab-case `data-slot` plus `data-state`, `data-disabled`, or `data-loading`
  where the state exists.
- Do not make `ProductGrid` or `ProductCard` client components. Do not export
  shared types/constants from a client module. Do not add context, a provider,
  global store, request-time module state, or an effect that mirrors derived
  URL state.

## Exact scope and expected files

Expected additions, with names adjustable only when an inspected existing
boundary makes another name materially clearer:

- `app/shop/page.tsx`
- `app/shop/loading.tsx`
- `app/shop/error.tsx`
- `components/shop/shop-controls.tsx`
- `components/shop/shop-results.tsx`
- `lib/catalog-view.ts`
- focused tests such as `test/catalog-view.test.ts` and `test/shop.test.tsx`

Expected updates:

- `app/globals.css` for purpose-named Shop tokens and responsive composition
- `docs/pages.md` for measurements, responsive/interaction decisions,
  reference deltas, and actual verification evidence
- `docs/components.md` only for genuinely reusable new component contracts or
  newly certified existing generated controls

Modify `components/commerce/product-grid.tsx`, `ProductCard`, `Pagination`,
`NativeSelect`, `ToggleGroup`, `Empty`, `Skeleton`, or `Sheet` only when the
approved Shop behavior exposes a verified reusable defect or missing native
prop contract. Record and test any such change; do not restyle shared primitives
for one page through ad hoc class overrides.

Do not modify fixture product content or media unless execution proves a real
data-contract defect. Do not touch the pre-existing untracked prompt 08.

## Responsive behavior

- **1440 CSS px:** preserve the existing 100px header and 315px hero; render a
  single approximately 100px control band with filter/view/count grouped left
  and page size/sort grouped right; use the four-column 285px product grid and
  measured 32px gutters. List view may use one wide row per product inside the
  same 1240px container.
- **1024 CSS px:** retain a readable two-sided control hierarchy when space
  allows, allow controlled wrapping without overlapping, and use the existing
  three-column product breakpoint. Ensure every control stays at least 44px.
- **768 CSS px:** split controls into two logical rows, keep labels attached to
  their controls, use the existing two-column product grid, and let filter
  choices expand in normal flow or an accessible sheet without covering the
  result status unexpectedly.
- **390 CSS px:** stack control groups, keep count copy concise, use one product
  column, make disclosure/sort/page-size controls fit without truncating their
  accessible name, and center pagination with no document overflow.
- **320 CSS px:** preserve at least the narrow container gutter, one-column
  results, 44px touch targets, full focus rings, readable USD prices, and zero
  horizontal page overflow. List view intentionally converges on the same
  single-column card geometry as grid view.

At 400% browser zoom, the page must reflow without two-dimensional scrolling;
only content that intrinsically requires it may scroll, and this surface has no
such table.

## States and behavior

- **Default/success:** all eight fixtures in featured order, grid view, showing
  1–8 of 8 products, no false multi-page navigation.
- **Filtered:** category navigation reports the truthful subset and a visible
  active choice; result count and visible range update; page resets to 1.
- **Sorted:** name is locale-aware for `en-US`; price sorts use integer cents;
  equal keys retain canonical fixture order.
- **View:** grid/list state is perceivable in control semantics and URL, not by
  color alone; product navigation and result order do not change.
- **Pagination:** choosing four per page creates two real pages. Page links
  preserve category, sort, view, and page size. Current page uses
  `aria-current="page"`; unavailable previous/next controls are omitted or
  correctly non-interactive, never fake links.
- **Hover/focus-visible/active:** reuse semantic interaction tokens. Links,
  disclosures, selects, toggles, and pagination have visible focus; product
  overlay remains redundant to always-visible image/name links.
- **Loading/pending:** `app/shop/loading.tsx` uses the inspected `Skeleton`
  composition to reserve hero/control/result geometry without pretending to
  know product copy. Client navigation controls retain accessible names, expose
  busy state, and prevent duplicate updates while a transition is pending.
- **Empty:** the results block accepts an empty resolved result and uses the
  inspected `Empty` component with plain guidance and a real `View all
  products` link that clears Shop parameters. Do not invent out-of-stock copy.
- **Error:** `app/shop/error.tsx` is the narrow required Client Component,
  provides a useful heading/message, a retry action calling `reset`, and a
  local return-to-Shop link. It does not leak exception details.
- **Disabled:** only genuinely unavailable/pending controls are disabled; the
  reason remains perceivable. A disabled style is not used to simulate a link.
- **Reduced motion:** URL/control state changes remain usable with motion
  removed; add no decorative entrance or per-card animation.

## Accessibility and security requirements

- Meet WCAG 2.2 AA. Keep one `main`, one visible Shop `h1`, logical headings,
  semantic lists, persistent select labels, and a polite live status for
  client-side pending/result context only where it does not duplicate route
  announcements.
- The filter disclosure has an explicit accessible name and exposes expanded
  state through native or audited primitive behavior. Category, view, and page
  selection remain understandable without color.
- Icon-only grid/list controls have visible tooltips only if needed, but always
  have stable accessible names. Decorative Lucide icons are hidden. Do not size
  icons ad hoc inside shadcn controls; use their component contract.
- Preserve Next.js route announcements with unique metadata and the visible
  `h1`. Use real links for navigation and buttons only for actions.
- Images retain fixture alt text, intrinsic dimensions, accurate Shop/list
  responsive `sizes`, and lazy loading. No Shop product image is an LCP preload
  candidate beneath the hero/control chrome.
- Query parsing is allowlisted, deterministic, side-effect free, and bounded.
  Do not fetch external data, render raw query strings, use client prices as
  authority, access secrets, add endpoints, or introduce persistence.

## Reference deltas

- Use `Compfi`, English (United States), local original WebP imagery, and
  coherent USD-cent fixture prices instead of the reference brand, mixed-locale
  prices, and unknown-source images.
- The Shop hero remains the already documented tokenized wash because no
  approved local image exists. Do not duplicate the Home hero or hotlink the
  reference photograph.
- Truthfully report eight fixtures. Default page size is 8, with 4 as the only
  alternate so pagination has real semantics. Do not show `1–16 of 32`, a
  disabled 16 selector, or repeated cards.
- Omit add-to-cart/share/compare/favorite actions because those behaviors are
  not yet backed. Keep the reviewed `View product` navigation overlay.
- Use a documented native disclosure or audited Sheet for filters because the
  static screenshot does not define its open mechanics. Tablet/mobile layouts
  are responsive decisions derived from the desktop hierarchy.
- Reuse the non-claiming Compfi benefits/footer copy; do not reproduce warranty,
  shipping threshold, support-hours, address, newsletter, or policy claims.

## Non-goals

- Product detail, comparison, cart state, checkout, contact, blog, account/auth,
  wishlist, reviews, ratings, inventory, stock, delivery, tax, search, CMS,
  payment, order persistence, analytics, or external services
- New product fixtures, duplicated products, generated imagery, remote images,
  or changes to canonical USD prices
- Home inspiration carousel/editorial gallery work
- Client-side catalog fetching, a global commerce store, optimistic purchase
  behavior, server actions, route handlers, or API endpoints
- Authentication merely because the shared account icon exists
- Decorative animation or Phase 7 interaction polish beyond the complete,
  accessible behavior required for this Shop surface
- An architecture audit, ADR, dependency addition, migration, push, rebase,
  amend, squash, or unrelated cleanup

## Acceptance criteria

- `/shop` renders the shared Compfi header/footer, a unique Shop hero and
  breadcrumb, truthful controls, real fixture results, conditional real
  pagination, and the shared benefits strip inside one main landmark.
- Filtering, sorting, view, page size, and pagination are encoded in validated
  canonical local URLs, survive refresh/back/forward navigation, and produce
  deterministic server-rendered results without mutating fixtures.
- Default state shows all eight products once. Selecting four per page yields
  two pages with no duplicates or omissions. Filtered/sorted counts, ranges,
  and preserved query state are correct.
- Grid/list controls are mutually exclusive and accessible; list presentation
  changes layout only. Product names, media, prices, badges, and detail links
  remain owned by the existing reusable card.
- Loading, pending, empty, error, disabled, hover, focus-visible, active, and
  reduced-motion behavior meet the contracts above.
- Desktop geometry is faithful to measured reference evidence; 1024, 768, 390,
  320, and 400% zoom remain readable and free of document overflow.
- No unsupported claim, purchase action, service, package, remote asset,
  duplicated component, raw component-level design value, or unnecessary
  client boundary is introduced.
- Owning docs record refined measurements, component behavior, deltas, and only
  checks actually run. The unrelated untracked prompt 08 remains untouched.

## Tests and verification

Use behavior-first tests with accessible queries and `userEvent`; avoid DOM
snapshots, private state assertions, and implementation-detail mocks.

1. Pure catalog-view tests cover every accepted/invalid query value, array
   input normalization, immutable stable sorts, category filtering, truthful
   ranges, page-size changes, out-of-range page clamping, canonical query
   preservation/reset behavior, and empty input.
2. Component/page tests cover the main landmark, unique heading, breadcrumb,
   labels and accessible control names, selected states, truthful USD content,
   all eight unique default links, filtered results, conditional pagination,
   empty recovery, loading semantics, error retry/return behavior, and axe
   checks for each interactive state that JSDOM can represent.
3. Run focused new tests first, then:
   - `npm run test`
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm run build`
   If the known restricted-sandbox Turbopack PostCSS worker port failure
   recurs, record the exact output and also run `npm run build -- --webpack`;
   never claim the first command passed.
4. Start `npm run dev` and use the `agent-browser` core workflow when its CLI is
   available. If the executable remains unavailable, report that exact tooling
   limitation and use the established local Chromium/CDP fallback without
   adding a production dependency.
5. In a real browser, exercise default, each category, each sort, grid/list,
   page size 4, both pages, invalid and out-of-range queries, back/forward,
   reload, keyboard-only controls, visible focus, disclosure open/close,
   pending state where observable, reduced motion, and error recovery.
6. Capture stable full-page screenshots at 1440, 1024, 768, 390, and 320 CSS px.
   At 1440 compare the header/hero/control transition, container alignment,
   four-column card geometry, vertical rhythm, conditional pagination, benefits,
   and footer against `design/2-Shop.png`. At smaller widths verify the explicit
   responsive contract and `scrollWidth === clientWidth`.
7. Verify 400% reflow, no two-dimensional document scrolling, no clipped focus
   rings, useful image alternatives, native select/disclosure semantics, and
   contrast for selected/muted/control states in a real rendering engine.
8. Fetch the current Web Interface Guidelines as required by the local skill,
   review every new/changed UI file, verify each finding against repository
   rules, and resolve valid issues before the implementation commit.
9. Inspect every changed file plus the complete diff. Update `docs/pages.md`
   and, only where relevant, `docs/components.md` before staging.
10. Load `caveman-commit`, stage only approved task files (never prompt 08),
    inspect the staged diff, and create the local implementation commit on
    `main`. Do not push.
11. Run the mandatory `code-review` skill against the immutable
    `BASE_SHA...HEAD`, with `AGENTS.md` and owning docs as Standards sources and
    this prompt as the Spec. Spawn isolated Standards and Spec reviewers in
    parallel, preserve their separate reports, and include the full smell
    baseline. This prompt is the originating spec, so the missing optional
    issue-tracker setup does not authorize invented issue content.
12. Verify every review finding against the diff, installed APIs, prompt, and
    standards. Fix accepted findings, rerun affected and full checks, update
    docs, and create a separate local fix commit with `caveman-commit`. Re-run
    both review axes from the original `BASE_SHA` if fixes materially affect a
    public API, shared component, data flow, security, or complex interaction.
    Finish with no verified blocking finding and do not push.

## Documentation update

Update `docs/pages.md` as the owner of the Shop route build record. Record:

- refined native raster measurements and the chosen CSS interpretation;
- URL/data behavior, server/client boundary, responsive decisions, all
  reference deltas, and the remaining Phase 4 scope;
- exact automated command results, browser widths/flows, screenshot locations,
  Web Interface Guidelines result, two-axis review counts, accepted/rejected
  finding dispositions, commits, and any environment limitation.

Update `docs/components.md` only for new reusable contracts or an existing
generated component that becomes inspected, adapted, tested, and certified.
Do not duplicate the catalog query contract into multiple documents; keep its
detailed code-facing contract with the implementation and summarize route
behavior in `docs/pages.md`. No new documentation index row or ADR is expected.

## SKILLS USED

- `frontend-design`: preserve the measured furniture-store hierarchy, Compfi
  visual character, concise copy, and motion restraint without generic
  restyling.
- `building-components`: define composable props, semantic HTML, native
  disclosure/control behavior, state/data attributes, and truthful component
  documentation.
- `vercel-composition-patterns`: keep Shop variants explicit, avoid boolean-prop
  growth in `ProductCard`/`ProductGrid`, and keep shared state at the narrow URL
  composition boundary.
- `vercel-react-best-practices`: enforce Server Component defaults, minimal
  serialization/client code, direct imports, derived state, stable rendering,
  image sizing, and no request or render waterfalls.
- `react-testing`: own behavior-first Vitest/RTL coverage, accessible queries,
  awaited user interactions, axe assertions, and the JSDOM/real-browser test
  boundary.
- `shadcn`: inspect `components.json`, current local source, Base UI contracts,
  and current component guidance before adapting `NativeSelect`, `ToggleGroup`,
  `Pagination`, `Skeleton`, `Empty`, or `Sheet`; compose existing primitives and
  use semantic tokens.
- `agent-browser`: load the installed CLI-matched core workflow and own real
  browser navigation, keyboard checks, responsive screenshots, reflow, and
  interaction verification; record and safely fall back if the executable is
  unavailable.
- `web-design-guidelines`: fetch the fresh rule set during execution and perform
  the final UI/UX/accessibility review of changed UI files.
- `code-review`: after the self-verified local implementation commit, run the
  mandatory parallel Standards and Spec reviews against the immutable base and
  keep both axes separate.
- `caveman-commit`: create the local implementation and any separate review-fix
  commit messages, intent-first and without AI attribution.

