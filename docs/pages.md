# Compfi page build record

Status: Phase 4 Home, Shop, and product-detail browsing implemented and verified.

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
demonstrative and local. Add-to-cart and comparison are visibly disabled with
the explanation that online ordering and comparison are unavailable in this
preview. No stock, delivery, review, rating, warranty, cart, comparison store,
or transient success claim was introduced. Information tabs expose only
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
by semantic accessible muted text; unsupported purchasing/comparison controls
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
- Product actions are navigation only: image/name links are always available; the desktop overlay is a redundant `View product` link revealed by hover or `focus-within`. An inset media focus ring remains visible when the image link triggers the overlay. No cart, comparison, favorite, stock, rating, review, or purchase control was added.

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
- The reference's populated cart, template footer contact data, policy claims,
  newsletter form, warranty, support hours, and shipping offer are intentionally
  absent. The cart is an accessible empty state until a cart model is built.
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
