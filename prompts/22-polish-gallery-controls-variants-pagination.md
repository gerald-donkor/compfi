# Polish galleries, browsing controls, variants, and pagination (Phase 7 unit 2)

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-10. This is a planning
artifact only. It authorizes no implementation, dependency installation,
staging, commit, or push until the user explicitly approves it through the
single-letter `y` workflow.

Planning-time repository state is a clean `main` at `01705cc`
(`git status --short` empty at prompt-preparation time). Reconfirm
`git status --short`, `git branch --show-current`, recent history, and `HEAD`
before execution. Stop if the branch is not `main`. Preserve every unrelated
path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Deliver the second and final interaction unit of Phase 7 (Interaction and
motion polish, AGENTS.md §8 phase 7, depends 2–3, builds on 4–6) by closing
the remaining §7 interaction gaps that Phase 7 unit 1 deliberately deferred:

- Unit 1 (prompts 20–21, review-closed) covered the product-card overlay
  hover/keyboard/touch parity, the cart-drawer modal contract, and the
  motion/focus token consistency for those two surfaces only.
- This unit covers everything else interactive that already ships:
  product-detail gallery selection, size/finish/quantity variant controls,
  product information tabs, Shop filter disclosure / sort / page-size / view
  toggle, Shop pagination, comparison picker and table scroll region, and the
  Home inspiration carousel. All keep their certified data contracts; only
  keyboard operability, focus visibility, announcements, busy handling,
  44px targets, motion-token reuse, and reduced-motion behavior are polished.

Phases 1–6 are implemented, verified, and review-closed. Phase 7 unit 1 is
implemented, verified, and independently review-closed (see `docs/pages.md`
Phase 7 unit 1 record and `docs/components.md` overlay/drawer contracts).
This unit depends only on already-certified components and tokens, changes no
catalog data, pricing, cart identity, checkout, contact, blog, routes,
metadata, providers, or authentication, and unblocks Phase 8 (accessibility,
performance, visual QA). It is the earliest unbuilt dependency-safe unit:
Phase 8 requires Phase 7 complete, and Phases 9–10 require explicit product
requirements that do not exist.

The required lightweight architecture-signal check found no
threshold-crossing candidate. This unit touches small client leaves and CSS
token usage only; it introduces no module seam, adapter, provider, or shared
commerce rule. Do not run an architecture audit during this single-letter
workflow.

## Evidence to re-read before implementation

- `AGENTS.md`, especially §§6 (tokens, 44px targets, taxonomy), 7 (WCAG 2.2
  AA, focus-visible, hover-only ban, tabs contract, live regions, loading
  controls, reduced motion), 9 (server/client leaves), and 12–13.
- `CONTEXT.md`; `docs/design-system.md` (motion roles 140/220ms, focus roles,
  product-detail / shop / comparison / inspiration geometry);
  `docs/components.md` (gallery, options, tabs, Shop blocks, pagination,
  comparison, carousel contracts); `docs/pages.md` (Phase 7 unit 1 closure,
  shop/detail/comparison/home verification); `docs/automation.md`;
  `docs/agent-browser.md`.
- Installed Next.js guide relevant to the task from
  `node_modules/next/dist/docs/` (App Router rendering, `next/image`,
  accessibility routing behavior). Heed deprecation notices.
- Existing implementation (read fully before changing):
  - `components/product/product-gallery.tsx` (client leaf, lead + thumbnail
    buttons with `aria-pressed`, polite announcement, media-identity reset,
    empty state).
  - `components/product/product-options.tsx` (client leaf composing certified
    `SizeSelector`, `ColorSelector`, `QuantityInput`, add-to-cart submit,
    optional `comparisonHref`).
  - `components/commerce/size-selector.tsx`,
    `components/commerce/color-swatch.tsx`,
    `components/commerce/quantity-input.tsx` (toggle-group bindings,
    spinbutton keyboard, 44px targets, bounds).
  - `components/product/product-information.tsx` + `components/ui/tabs.tsx`
    (Base UI tabs, roving focus, manual Enter/Space, disabled handling).
  - `components/shop/shop-controls.tsx` (client leaf: native `details`
    filter + local links, Base UI view `ToggleGroup` with
    `data-composite-item-active`, `NativeSelect` sort/page-size, `useTransition`
    pending, polite count + pending announcements).
  - `components/shop/shop-results.tsx` (server block, result range,
    `ProductGrid` delegation, empty state, real-link pagination).
  - `components/ui/pagination.tsx` + `components/ui/native-select.tsx` +
    `components/ui/toggle-group.tsx` (verify keyboard/composite behavior from
    the established primitives; do not hand-roll a second control).
  - `components/comparison/product-comparison.tsx`,
    `comparison-table.tsx`, `comparison-product-summary.tsx` (GET picker,
    removal links, focusable table scroll region).
  - `components/home/inspiration-carousel.tsx` + `components/ui/carousel.tsx`
    (Embla composition, previous/next + dots, polite status, jump path,
    listener cleanup).
  - `app/globals.css` motion/focus section (`--duration-fast` 140ms,
    `--duration-standard` 220ms, `--ease-standard`,
    `prefers-reduced-motion` reset, focus-visible treatment, shop/gallery/
    carousel rules).
  - `lib/catalog-view.ts`, `lib/catalog.ts`, `lib/comparison.ts`,
    `lib/money.ts` (read-only; do not change projection, pricing, or identity
    in this unit).
- Design references (open at native 2880px raster before changing visuals):
  - `design/2-Shop.png` (controls band, filter affordance, sort/view placement,
    card grid, pagination).
  - `design/3-Single Product.png` (gallery rail + lead, options, tabs,
    information media, related grid).
  - `design/5-Product Comparison.png` (picker, summary row, attribute table).
  - `design/1-Home.png` (inspiration band, carousel affordance).
- Relevant skills (load fully before execution; see `## SKILLS USED`).

Planning-time native measurements to reuse (established 2:1 raster-to-CSS
interpretation; do not re-measure unless a fix needs new geometry):

| evidence | production decision |
| --- | --- |
| Shop 570px cards / 64px gaps; 630px hero; `#F9F1E7` band from y=830 | 285px cards, 32px gaps, 1240px container, 315px banner hero, 100px control band (`--shop-controls-block-padding` 28px + 44px controls) |
| Product wash y=228–421 (194px) | `--product-detail-breadcrumb-height` 97px compact wash |
| Product 423×500px lead; 76×80px thumbs; ~106px column gap; 605×348px info frames; 29px gap | matching `--product-detail-*` tokens |
| Comparison 2664px rule; 355px attribute / 344px product columns; 180px media | `--comparison-table-max-width` 1332px + column/media roles; labelled focusable scroll region only |
| Inspiration `#FCF8F3` y=5526–6865; 808×1164 lead; 32px mosaic gutters | 670px band, 404×582px lead frame, 16px full-bleed gaps |
| 88px minimum actions | 44px targets everywhere; focus ring 3px + 3px offset |

## Exact scope, expected files, and route impact

In scope (interaction polish only; no data-contract change):

- `ProductGallery`: thumbnail buttons keep `aria-pressed` + visible
  `:focus-visible`; selection announcement stays single and polite; lead
  change keeps `alt` meaningful; empty state unchanged in contract; any
  hover/transition uses motion tokens and collapses under reduced motion.
- `ProductOptions` + selectors + `QuantityInput`: size/finish groups keep
  labelled group semantics (`aria-labelledby`), selected option is
  perceivable without color alone (existing check/ring/text cues preserved),
  quantity keeps spinbutton keyboard (ArrowUp/Down, Enter commit) and 1–10
  clamping with boundary-disabled buttons, add-to-cart keeps its accessible
  label + busy guard + single polite result announcement without inventing a
  toast.
- `ProductInformation` tabs: keep primitive-owned roving focus and manual
  activation; inactive labels keep the accessible muted token; tab panels
  keep `tablist`/`tab`/`tabpanel` relationships; no color-only state.
- `ShopControls`: filter `details`/`summary` keeps native disclosure keyboard
  behavior with a named summary and visible focus; category links keep
  `aria-current` on the active value; view toggle keeps the
  `data-composite-item-active` roving entry contract with arrow-key movement;
  sort/page-size selects keep labels, `disabled` during transition, and
  `aria-busy` on the controls region; count + pending announcements stay
  polite with no duplicate live regions.
- Shop pagination + comparison picker links: real anchors only (no fake
  disabled links); active page uses `aria-current="page"`; prev/next keep
  accessible names at the 60px wash geometry; comparison scroll region keeps
  its label and keyboard focusability.
- `InspirationCarousel`: previous/next + dots keep accessible names,
  `aria-current` on the active dot, disabled boundaries stay mounted;
  single polite status only; nested links keep native arrow-key behavior;
  reduced-motion uses the jump path; both Embla listeners are released.
- Motion/focus consistency for touched surfaces only: every added
  hover/focus/active/disabled transition reuses
  `--duration-fast`/`--duration-standard` + `--ease-standard`; never add raw
  `ms`, `cubic-bezier`, or `transition: all` in components (a missing value
  means a missing token).

Expected files (do not expand without a verified bug):

- `components/product/product-gallery.tsx`
- `components/product/product-options.tsx`
- `components/commerce/size-selector.tsx`, `components/commerce/color-swatch.tsx`,
  `components/commerce/quantity-input.tsx` (narrow fixes only)
- `components/product/product-information.tsx` (only if a verified tabs wiring
  defect; `components/ui/tabs.tsx` is read-only unless a proven primitive
  defect blocks the contract)
- `components/shop/shop-controls.tsx`, `components/shop/shop-results.tsx`
  (polish only; no view-model change)
- `components/ui/pagination.tsx`, `components/ui/native-select.tsx`,
  `components/ui/toggle-group.tsx`, `components/ui/carousel.tsx`
  (read-only unless a verified primitive defect; narrowest fix + regression
  test)
- `components/comparison/product-comparison.tsx` (picker/table-region polish
  only)
- `components/home/inspiration-carousel.tsx` (carousel polish only)
- `app/globals.css` (only if a touched state lacks a token: add one semantic
  or component token with a reference comment)
- `test/` focused interaction tests following the existing convention
  (e.g. gallery selection/announcement/reset, variant bounds/keyboard,
  tabs keyboard, controls pending/announcement, pagination semantics,
  carousel boundaries/reduced-motion, axe coverage)
- Owning docs (see Documentation section).

Route impact: none added or removed. `/`, `/shop`, `/shop/[slug]`,
`/comparison` inherit the polish with no URL, metadata, or data-contract
change.

## Component boundaries and server/client ownership

- Gallery, options, selectors, quantity, Shop controls, carousel remain the
  existing small client leaves. All result data, cards, comparison model,
  and editorial records stay server-owned and pass through composition.
- Do not export shared constants or types from a client module. Keep
  serialized props across the server/client boundary minimal.
- Do not define components inside components. Keep variant definitions
  outside render functions. Reuse certified primitives; do not create second
  gallery, selector, pagination, or carousel versions.
- Import modules directly; do not add barrel imports that widen the client
  bundle. No new dependency (GSAP/Embla APIs beyond the certified carousel
  usage, toasts, analytics) in this unit.

## Responsive behavior

- 1440px desktop: gallery rail + lead side-by-side per measured tokens; Shop
  two-sided controls band; comparison wide table; inspiration band with
  dominant + peek slides.
- 1024px: same hierarchies compact; Shop controls wrap without overflow;
  gallery summary columns narrow per product tokens.
- 768px tablet: gallery + summary stack, thumbnail rail becomes horizontal;
  Shop controls stack; comparison summaries stack while the table keeps its
  labelled scroll region; inspiration stacks copy above carousel.
- 390px / 320px mobile: single-column cards and info media; Shop views
  converge to one readable column; comparison keeps one-column summaries +
  scroll region (never compress unreadably); carousel uses 84% basis peek;
  drawer behavior from unit 1 is untouched.
- Zero horizontal page overflow (`scrollWidth === clientWidth`) at 1440,
  1024, 768, 390, and 320px on `/`, `/shop`, `/shop/[slug]`, and
  `/comparison` with and without carousel/gallery interaction (comparison
  table region excepted by design; only that named region may scroll).

## States

- Gallery: default, thumbnail hover/focus-visible, selected (`aria-pressed`),
  empty (certified `Empty`), announcement-only change (no toast).
- Variants: default, selected (non-color cue), focus-visible, boundary
  disabled (quantity min/max), busy during add-to-cart (`aria-busy`, label
  kept, double-activation prevented).
- Tabs: selected, inactive (accessible muted), focus-visible, disabled
  (focusable, `aria-disabled`, not activatable).
- Shop controls: default, hover, focus-visible, `aria-busy` pending
  (controls disabled during transition), count/pending polite announcements.
- Pagination/picker: default, hover, focus-visible, active
  (`aria-current`), prev/next boundary handling without fake links.
- Carousel: default, hover, focus-visible, disabled boundaries (mounted),
  status announcement, reduced-motion jump.
- Errors never expose exception details; images retain meaningful `alt`;
  no transient success claim beyond the existing polite announcements.

## Accessibility and security requirements

- WCAG 2.2 AA floor. Landmarks and heading order unchanged.
- Every interactive control has a visible accessible name and visible
  `:focus-visible`; never remove outlines without the certified replacement.
- Tabs implement the tablist/tab/tabpanel keyboard contract via the
  primitive; view toggle keeps its composite roving contract.
- Dynamic gallery selection, variant selection, quantity, Shop count/pending,
  pagination, comparison, and carousel status use polite live regions;
  `assertive` only for a verified error.
- No discount, selection, badge, or status communicated through color alone.
- Icon-only actions have accessible names; decorative icons are hidden.
- Text zoom / 200% root text and 320px reflow produce no clipped controls.
- Reduced motion honored everywhere touched; content visible and usable with
  motion removed; no information carried by motion alone.
- Security: no form input beyond existing controls, no server mutation, no
  secrets, no external URLs, no analytics. Treat prices as display state;
  change no pricing logic. Validate nothing new on the client as
  authorization; Shop/comparison state stays allowlisted URL state.

## Data shapes and edge cases

- No data-shape change. `CatalogProduct`, `ProductMedia`, `CatalogViewModel`,
  comparison projection, cart-line identity (`slug` + `size` + `finish`,
  quantity 1–10) are untouched.
- Edge cases to cover in tests and browser flows:
  - gallery with one image / empty media (no broken rail, named empty state);
  - product round trip resets gallery selection and clears announcements;
  - options with missing size or finish groups (group omitted, no orphan
    label);
  - quantity bounds 1 and 10 (clamp + boundary disabled + keyboard);
  - rapid gallery/quantity/view/sort interaction (no duplicate announcements,
    no stuck pending, no lost focus);
  - filter disclosure keyboard open/close with focus retained;
  - invalid Shop query values fall back to defaults (existing projection;
    add no new param);
  - comparison with 0–3 selections (empty/full guidance, removal links);
  - carousel empty collection (no carousel rendered) and first/last
    boundaries;
  - reduced-motion enabled (instant usable gallery/controls/carousel).

## Reference deltas and why each is necessary

1. **Brand**: legacy brand in PNGs is reference content; shipped UI stays
   Compfi.
2. **Responsive structure**: no mobile comps exist; stacking, horizontal
   thumbnail rail, scroll regions, and full-width dialogs are derived from
   AGENTS.md §6.2 and content pressure.
3. **Focus/announcement/motion additions**: static PNGs prove appearance
   only; `:focus-visible`, live regions, busy handling, and 140/220ms token
   timing are documented accessibility deltas.
4. **Imagery**: reuse certified local media only; reference photography has
   unknown provenance and is never shipped.
5. **No invented claims**: omit or disable unsupported actions, ratings,
   stock, shipping, warranty, and policy claims rather than relabelling
   template copy.

## Non-goals

- Do not change catalog fixtures, prices, compare-at math, cart identity,
  cart persistence, checkout, contact, blog, comparison projection, routes,
  metadata, or authentication.
- Do not add toasts, wishlists, ratings, reviews, inventory, CMS, analytics,
  payment, persistence, or newsletter behavior.
- Do not add GSAP, new Embla APIs, or any new dependency.
- Do not create dark mode, new palette, new typefaces, or new shadows.
- Do not rework `Sheet`/drawer beyond unit 1; do not touch card overlay
  beyond a verified regression.
- Do not create `docs/adr/` or select providers.

## Acceptance criteria

1. Keyboard-only users can operate gallery thumbnails, size/finish/quantity,
   tabs, filter disclosure, sort/page-size, view toggle, pagination,
   comparison picker/removal, and carousel controls with visible focus and
   no hover gate.
2. Announcements are single, polite, and accurate; pending/busy states keep
   labels, use `aria-busy`, and prevent duplicate submission.
3. All touched transitions reuse motion tokens and collapse under
   `prefers-reduced-motion` with content usable.
4. Axe reports 0 violations on `/shop`, a `/shop/[slug]` route,
   `/comparison`, and `/` carousel region (expected modal-inert incompletes
   manually verified, never misreported).
5. Zero horizontal page overflow at 1440, 1024, 768, 390, and 320px on the
   four routes above (comparison table scrolls only in its named region).
6. Full checks pass: `npm run test`, `npm run lint`, `npx tsc --noEmit`,
   `npm run build`.

## Commands, automated checks, browser flows, and screenshot comparisons

Run from the repository root and report actual results:

```bash
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

If the default build hits the documented sandbox PostCSS worker-port
limitation, run `npm run build -- --webpack` and report both outcomes;
do not conceal either. Focused tests follow the existing `test/` naming;
do not invent script names (e.g. `npm run test -- test/product-gallery.test.tsx`
plus any new interaction test file).

Browser automation with `agent-browser` in your own named session
`compfi-phase7u2-<uuid>` (per the ALWAYS ledger; never use the shared
default session; consult the usage docs when needed):

- Start dev server; direct-load `/shop`, one `/shop/[slug]` (e.g. Alder),
  `/comparison`, and `/`.
- Gallery flow: activate each thumbnail via keyboard; assert lead swap +
  single polite announcement; reload product round trip and assert reset.
- Variant flow: select size/finish via keyboard; assert selection cue +
  announcement; drive quantity to 1 and 10 via buttons and ArrowUp/Down;
  assert clamp + boundary disabled.
- Tabs flow: arrow through tabs, activate via Enter/Space, assert panel
  swap and focus contract.
- Shop flow: open filter disclosure via keyboard, follow a category link,
  change sort/page-size/view; assert `aria-busy` pending, polite count
  update, canonical URL, and no page overflow.
- Pagination flow: follow page links; assert `aria-current` and changed
  results.
- Comparison flow: submit picker, remove a product, assert shareable URL
  and labelled scroll-region keyboard access.
- Carousel flow: previous/next + dot navigation via pointer and keyboard;
  assert status, disabled boundaries, focus retention, no auto-rotation.
- Viewports: capture `/tmp/compfi-phase7u2-{1440,1024,768,390,320}.png`
  plus `/tmp/compfi-phase7u2-gallery-{1440,390}.png`; compare geometry,
  type, color, and spacing against `design/1-Home.png`,
  `design/2-Shop.png`, `design/3-Single Product.png`, and
  `design/5-Product Comparison.png`; assert page-level
  `scrollWidth === clientWidth` at each width.
- Reduced motion: emulate `prefers-reduced-motion: reduce`; assert instant
  usable gallery/controls/carousel with no stranded hidden content.
- Axe audit on the four routes above; console shows no page errors
  (dev HMR/React-DevTools noise only).

## Documentation to create or update

- `docs/components.md`: extend the gallery, options/selectors, tabs, Shop,
  pagination, comparison, and carousel contracts with the polished keyboard,
  announcement, busy, target-size, and motion behavior; note any narrow
  primitive fix.
- `docs/design-system.md`: record any added motion/focus token (or confirm
  existing tokens sufficed) and the reduced-motion rule for the touched
  surfaces.
- `docs/pages.md`: open the Phase 7 unit 2 record with scope, decisions,
  deltas, and real verification results; do not mark Phase 7 complete until
  its exit criteria plus `web-design-guidelines` review are met.
- `CONTEXT.md`: no new domain term expected; update only if a genuinely new
  term crystallizes.
- `AGENTS.md` index: update only if a docs row truthfully changes status in
  the same commit.

## SKILLS USED

- `building-components`: token architecture, control APIs, states, slots,
  data attributes, docs.
- `frontend-design`: gallery/controls/carousel fidelity, focus/motion
  restraint, no generic restyling.
- `vercel-composition-patterns`: composition over boolean proliferation for
  any control variant.
- `vercel-react-best-practices`: server-safe blocks, small client leaves, no
  waterfalls, minimal client boundary.
- `react-testing`: behavior-focused interaction tests, accessible queries,
  user-event, axe assertions.
- `shadcn`: established tabs/select/toggle/carousel/pagination baseline;
  inspect `components.json` and current source before any primitive change.
- `web-design-guidelines`: final UI/UX and accessibility review before the
  unit is called complete.
- `agent-browser`: named-session verification, viewports, keyboard,
  reduced-motion, screenshots.
- `code-review`: mandatory dual-axis Standards + Spec review after the
  self-verified local commit.
- `caveman-commit`: implementation and review-fix commits.
