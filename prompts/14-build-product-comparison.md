# Build the Compfi product-comparison surface

## Status and authorization boundary

Approved by the single-letter `y` workflow on 2026-09-09. Execution is in
progress; local commits and the required review remain pending.

Execution base: `764a7012449a4bbd2f6116ac630de09bb50dcd21`.

Planning-time repository state is clean on `main` at
`764a701d1b224b7a1cc488fbd5b0dc55b88efbf6`. Reconfirm the current branch,
`git status --short`, recent history, and `HEAD` immediately before execution.
If the branch is no longer `main`, stop and ask for direction. Preserve every
unrelated or user-authored path that appears after this prompt is prepared.

## Goal and why this is next

Build `/comparison` as the next complete Phase 4 commerce-browsing unit. The
page must let customers compare up to three of the eight committed Catalog
Products, add and remove products through shareable URL state, open each
product detail page, and compare only the truthful catalog attributes Compfi
already owns. It must include default, one-product, full, empty, invalid-query,
loading, and error states, responsive behavior, accessibility, focused tests,
browser verification, documentation, local commits, and the mandatory
two-axis review.

Phases 1–3 are committed, documented, verified, and reviewed. Within Phase 4,
the catalog/media foundation, Home, Shop, and all product-detail routes are
committed and reviewed. `/comparison` is therefore the unique earliest
unbuilt dependency-safe unit in the ordered sequence. It can reuse the
catalog, shared chrome, money formatter, local media, and certified controls;
it also makes the currently disabled product-detail Compare action useful.
Cart state and checkout remain Phase 5. Do not pull cart behavior, checkout,
inventory, a comparison persistence store, or any provider into this task.

The required lightweight architecture-signal check found no implemented
comparison workflow, scattered comparison rule, repeated comparison adapter,
or provider seam. Existing review churn is concentrated in completed visual
surfaces and does not justify an architecture audit. The `i` workflow forbids
running one now, and a later `y` must execute only this approved prompt.

## Starting repository evidence

- `lib/catalog.ts` is the sole immutable source for exactly eight
  `CatalogProduct` records and already validates identity, category, exact
  USD-cent prices, descriptions, local media, three detail views, optional
  sizes, and optional finishes. It contains no dimensions, weight, material,
  model number, configuration, origin, warranty, stock, delivery, rating,
  review, or provider data.
- `types/commerce.ts` owns the catalog contract. Do not extend it with claims
  copied from the reference. A comparison view/query model belongs in a pure
  comparison module unless an existing type is genuinely the owner.
- `ProductCard`, `Money`, `Link`, `Button`, `NativeSelect`, `Field`, `Empty`,
  `Skeleton`, `PageHero`, `BenefitsStrip`, and layout primitives already
  exist. Inspect their actual APIs and certification records before use.
- `components/ui/table.tsx` exists but is currently a generic shadcn wrapper
  marked as a Client Component despite containing no client behavior. It does
  not expose wrapper props for a labelled focusable overflow region and its
  prop types are not exported. Inspect current shadcn guidance and installed
  behavior, then either narrowly certify/evolve this one primitive or explain
  in `docs/components.md` why the domain block uses semantic table markup.
  Do not create a second generic table implementation.
- `components/ui/native-select.tsx` is server-safe and provides a real native
  select. Prefer a progressively enhanced GET form for the add-product picker
  so comparison content remains server-rendered and shareable without adding
  router state merely for immediacy. Its current 32px control height needs a
  task-scoped 44px composition or a justified component correction before use.
- `ProductOptions` is the existing small client leaf for detail choices. Its
  Add to cart and Compare buttons are disabled behind one sentence. Evolve it
  minimally so Compare is a real link to the comparison route with the current
  product selected, while Add to cart remains disabled with cart-only copy.
  Do not serialize the full product merely to build that link; pass a slug or
  prebuilt safe href.
- `PageHero` already owns the 315px banner variant required here. The current
  reference image has unknown provenance, so reuse the approved tokenized wash
  rather than copying or hotlinking it.
- `BenefitsStrip` is implemented and certified. Reuse it unchanged; do not
  restore the reference's unsupported warranty, shipping, or support claims.
- `components.json` establishes a Tailwind CSS 4, RSC, Base UI, Lucide,
  `base-nova` shadcn project. Use Base UI `render`, never Radix `asChild`, and
  use Compfi semantic tokens instead of raw component colors.
- `next.config.ts` does not enable Cache Components. Installed Next.js 16.3.4
  docs confirm that page `searchParams` is a promise, using it opts the page
  into request-time rendering, pages are Server Components by default, and
  fixed internal URLs must be constructed from allowlisted values before any
  navigation.
- Existing tests use Vitest, React Testing Library, `userEvent`, accessible
  queries, and `axe-core` through `test/a11y.ts`. Browser layout and native
  interactions remain the real-browser lane.
- `CONTEXT.md`, `docs/catalog.md`, `docs/design-system.md`,
  `docs/components.md`, `docs/pages.md`, `docs/automation.md`, and
  `docs/agent-browser.md` are the owning records to re-read and update where
  this task changes their contracts.

## Installed framework and package sources to re-read

Before implementation, re-read at minimum:

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md`

Run `npx shadcn@latest info --json`, inspect `components.json`, and run
`npx shadcn@latest docs table native-select field empty button skeleton` before
changing or composing those components. Follow the returned current docs and
inspect installed Base UI source/types if the local wrapper does not settle an
API. Do not reinstall or overwrite existing components.

Before browser commands, re-read `docs/agent-browser.md`, run
`agent-browser skills get core`, and use one worktree-scoped named session with
a `compfi-comparison`-specific prefix for the whole task. Never use the shared
unnamed default session; close the named session at handoff.

## Reference evidence and measured interpretation

Open `design/5-Product Comparison.png` at its native 2880×7996 dimensions
before coding. Follow `docs/automation.md`: preserve native crops and
scanlines in a task-specific `/tmp` directory, distinguish observations from
implementation decisions, and retain the established two-raster-pixels to one
CSS-pixel working interpretation.

The planning pass established the following evidence. Re-measure it during
execution and correct the owning documentation if a focused crop disproves a
boundary.

| surface | native raster evidence | CSS interpretation / decision |
| --- | --- | --- |
| shared header | white header occupies y=0–199 | reuse the reviewed 100px `SiteHeader` |
| title hero | reference photography runs below the header through about y=842; the center line becomes white at y=843 | keep the reviewed 315px banner wash; the few-pixel export difference and absent licensed photo are explicit deltas |
| comparison summary | white product/picker band spans about y=843–1601, or 759 raster px | about 380px desktop composition before the table rule; let truthful card copy define final height |
| compared-product media | broad `#F9F1E7` runs at y=900 are x=807–1328 and x=1467–1988; the full warm surfaces extend roughly x=788–1347 and x=1448–2007 in later scanlines | about 270–280px-wide, approximately 180px-tall landscape product frames; use each catalog image's own intrinsic ratio with `object-fit: contain`, not distorted crops |
| add-product control | exact gold run at y=1100 is x=2146–2629 | about 242px wide; preserve the right-side picker hierarchy with accessible action contrast and a 44px minimum control |
| table top rule | exact `#E8E8E8` run at y=1602 is x=108–2771 and remains two raster rows | about 1332px wide with a 1px rule; use a purpose-named comparison maximum rather than changing the global container |
| table columns | at y=1700 and y=3000 vertical rules are x=710–711, x=1398–1399, and x=2086–2087 | four conceptual columns: a roughly 355px attribute column plus three roughly 344px product columns; preserve readable widths in a labelled horizontal-scroll region under content pressure |
| reference table/action extent | table region spans y=1604–6345; reference Add to cart fills run y=5994–6121 and x=788–1217 / x=1434–1863 | omit the unsupported rows and cart buttons, so truthful Compfi content will be substantially shorter; never pad with invented facts to match height |
| shared benefits/footer | exact `#FAF3EA` starts y=6346 and runs through y=6884; footer begins after the y=6885–6886 boundary | reuse the reviewed approximately 275px `BenefitsStrip` and existing footer; content height determines their final page position |

The reference palette is white, warm wash, dark ink, muted copy, gold actions,
and light structural rules. Use established accessible semantic tokens. Do not
restore low-contrast muted text or white text on the sampled reference gold.
Add only purpose-named comparison geometry tokens that are demonstrably stable;
record every new token in `docs/design-system.md`.

## Visual direction

Preserve the reference's quiet, product-led comparison: the title hero gives
way to a spacious row of product summaries and one add-product control, then a
plain attribute-by-attribute table with restrained vertical rules. The product
imagery and names carry the hierarchy. Do not turn the page into dashboard
cards, introduce shadows, decorate every row, add generic badges, or animate
content on load.

Use Compfi's verified Poppins family and existing type roles. Product names are
links to detail pages; prices use `Money`; compare-at prices may appear only
when present and semantically use `<s>`. Product summaries use local
`next/image` assets with intrinsic dimensions, accurate `sizes`, and useful alt
text. The add-product picker should look intentional beside the summaries but
remain a native labelled field and action rather than a decorative faux menu.

## URL state and data contract

Create one pure comparison-state resolver, expected in `lib/comparison.ts`,
with exported types only where callers or tests need them. Keep it independent
of React and browser globals.

- Use repeated, singular `product` parameters as the public contract, for
  example `/comparison?product=atlas-bed&product=haven-sectional`.
- Treat a missing `product` key as the reference-faithful default pair. Choose
  two deterministic existing products with contrasting attributes and record
  them as presentation defaults, not featured-product business claims.
- Treat an explicitly present empty value as zero selected products, enabling a
  real empty state after the last removal.
- Accept only exact slugs from `catalogProducts`; ignore unknown values,
  non-string shapes, and surplus entries. Preserve the first occurrence order,
  deduplicate, and cap selection at three.
- Return selected products, unselected choices, selection count, capacity, and
  canonical add/remove href builders (or an equivalently small interface) so
  page and components do not duplicate URL rules.
- Construct links from the fixed `/comparison` pathname and allowlisted catalog
  slugs with `URLSearchParams`. Never pass arbitrary query text to navigation.
- Do not use localStorage, cookies, context, a global store, server actions, a
  route handler, or persistence. The URL is the complete comparison state.
- If category labels would otherwise be duplicated between product detail and
  comparison, extract one narrow catalog-owned formatter/map and update both
  callers. Do not introduce a broad presentation abstraction.

The comparison rows must derive exclusively from committed catalog fields:

- Overview: current price, category, concise summary, and product details.
- Options: available sizes and available finishes.
- Show a clear textual value such as `One size` or `No size options` when a
  product has no size array; never use a bare ambiguous dash.
- Preserve fixture option order and join labels readably.
- A compare-at price may be shown in the summary card but is not a separate
  universal attribute row unless the row stays meaningful for products that do
  not have one.

Do not add ratings, reviews, sales packages, model numbers, materials,
configuration, dimensions, weight, capacity, headrest behavior, manufacturing
origin, warranties, stock, shipping, support, or cart availability.

## Component boundaries and route ownership

Keep `app/comparison/page.tsx` a Server Component. It awaits `searchParams`,
resolves the pure comparison model once, owns metadata and the single
`main#main-content`, and composes:

1. `PageHero` with title `Product comparison` and Home/current breadcrumbs.
2. A comparison block under `components/comparison/` containing the intro,
   selected-product summaries, add-product GET form, empty/full guidance, and
   the table.
3. The unchanged `BenefitsStrip`.

Suggested boundaries, subject to evidence from the existing code:

- `ComparisonProductSummary`: server-safe linked image/name/price composition;
  extends native article props, exports its props, merges `className`, and owns
  stable slots.
- `ProductComparison`: server-safe block receiving the resolved model, not raw
  query data; it owns layout, selection status, form composition, and the
  table.
- `ComparisonTable`: server-safe semantic table with row-group headings and a
  labelled focusable overflow region. Use the existing Table primitive if it
  can be narrowly certified without harming other consumers.
- `ComparisonPicker`: preferably server-safe native GET form using `Field`,
  `NativeSelect`, and `Button`. Hidden repeated `product` inputs preserve the
  current allowlisted selection. The select is required only while capacity
  remains and unselected products exist.

Do not make the page or comparison block a Client Component. Add a client leaf
only if installed primitive behavior proves it necessary, document why, and
pass the minimum serializable product option records rather than the full
catalog.

Update `ProductOptions` to accept the safe comparison destination. Render the
Compare action as a real internal link using the established Button/Link Base
UI composition verified from current docs. Keep Add to cart disabled and
described by cart-specific text. Update its tests and component contract; size,
finish, and quantity state remain unchanged and are not encoded into comparison
state.

Add `app/comparison/loading.tsx` with a named busy main landmark and structural
skeletons matching hero, summaries, and table. Add
`app/comparison/error.tsx` as the smallest client error boundary with a safe
message, Try again button, and real Shop link; never render the raw error.

Expected files include, but are not limited to:

- `app/comparison/page.tsx`
- `app/comparison/loading.tsx`
- `app/comparison/error.tsx`
- `components/comparison/product-comparison.tsx`
- `components/comparison/comparison-product-summary.tsx`
- `components/comparison/comparison-table.tsx`
- `lib/comparison.ts`
- `components/product/product-options.tsx`
- `components/product/product-detail.tsx` only if needed to pass the safe href
- `components/ui/table.tsx` and/or `components/ui/native-select.tsx` only for a
  verified reusable contract correction
- `app/globals.css` only for measured, purpose-named geometry/responsive rules
- focused tests under `test/`
- `CONTEXT.md` only if comparison introduces a genuinely new stable domain term
- `docs/catalog.md`, `docs/design-system.md`, `docs/components.md`, and
  `docs/pages.md`
- this prompt's status/evidence sections after execution and review

Do not edit source reference images or add production imagery.

## Responsive behavior

- At 1440px, retain the title hero, a spacious summary row aligned to the
  existing 1240px content container, two default product summaries plus the
  add-product area, and the wider approximately 1332px comparison-table region.
  The table supports the attribute column plus up to three aligned product
  columns without compressing names or values into illegibility.
- At 1024px, allow summary cards and picker to wrap by content pressure while
  keeping stable reading order: intro, selected products, then picker. The
  table becomes an intentionally labelled horizontal-scroll region if all
  columns no longer fit.
- At 768px, use two summary columns when content fits and place the picker as a
  full or clearly aligned next row. Preserve the table's column association and
  provide a visible cue/instruction that more comparison content scrolls
  horizontally when overflow exists.
- At 390px and 320px, stack intro, each selected-product summary, and picker.
  Keep images proportionate, actions at least 44×44px, and the document itself
  free of horizontal overflow. Only the labelled table region may scroll
  horizontally; do not collapse attributes into an ambiguous unlabeled list.
- Verify default zoom and 200% text sizing without document overflow. Exercise
  400% zoom/reflow where practical. Long product names, descriptions, and
  option lists must wrap without clipping.

## States and interaction requirements

- **Default:** missing `product` query displays the documented deterministic
  pair and an add-product picker, matching the reference hierarchy.
- **One product:** one valid slug renders one summary/column plus picker and
  plain guidance to add another product.
- **Full:** three valid unique products render three columns; the picker is
  replaced with truthful `Comparison is full` guidance and removal remains
  available.
- **Empty:** an explicit empty selection uses the established `Empty`
  composition with a real Shop link and an available picker. Do not render an
  empty table.
- **Invalid/duplicate/overflow query:** normalize safely, show only the first
  three unique known products, and never echo unknown query input.
- **Add:** selecting an unselected product and submitting the GET form produces
  a canonical URL containing the existing selection plus the new product.
  Prevent an empty submission with native validation.
- **Remove:** each summary has an explicitly named `Remove <product name> from
  comparison` link/control that generates the remaining canonical URL. It is
  keyboard accessible and does not imply deletion from the catalog.
- **Navigation pending/loading:** the route loading boundary preserves the
  major geometry, keeps an accessible label, and exposes `aria-busy` without
  fake content.
- **Error:** safe recovery never reveals internal error text.
- **Success:** the newly rendered comparison state contains a polite concise
  status such as `Comparing 2 products`; no toast is needed for navigation.
- **Hover/focus-visible/active:** linked cards, remove actions, picker, and
  buttons use established semantic state treatments. Do not make functionality
  hover-only.
- **Disabled:** Add to cart remains disabled on product detail with a precise
  explanation. Comparison picker/full guidance is not represented by a
  misleading disabled action when no action is available.
- **Reduced motion:** no decorative motion is added; existing global reduced
  motion rules govern control feedback.

## Accessibility and security

- Meet WCAG 2.2 AA. Keep one `h1`, logical section headings, semantic landmarks,
  and a table caption that explains what is being compared.
- Use real `<table>`, `<thead>`/`<tbody>`, row/column headers, `scope`, and row
  groups so each value remains associated with its product and attribute.
  Group `Overview` and `Options` semantically rather than simulating headers
  with decorative rows.
- The horizontal table container has an accessible name, is keyboard focusable
  only when it is a meaningful scroll region, shows visible focus, uses
  overscroll containment, and does not hide scrollbars without another cue.
- The native product field has a persistent label. Its options expose only
  unselected catalog products. Hidden fields are allowlisted server output.
- Product links and removal actions have unique accessible names. Decorative
  icons are hidden. Product images retain useful fixture alt text and intrinsic
  dimensions.
- Use a polite live/status message for the current comparison count. Do not
  over-announce every table cell.
- Keep all route construction on the fixed internal pathname with known slugs.
  Do not pass untrusted query values to `router.push`, raw `href`, HTML, styles,
  logs, or errors.
- No secrets, personal data, payments, persistence, network calls, or external
  URLs enter this task.

## Reference deltas

Record these in `docs/pages.md` rather than silently diverging:

- Compfi branding, verified Poppins, local original product media, and coherent
  USD cents replace the legacy brand, unidentified photos/typeface, product
  names, mixed-local currency, and template values.
- The hero remains the approved wash because the source photograph has unknown
  provenance and no approved local comparison-hero image exists.
- Unsupported specification, material, dimension, origin, warranty, rating,
  review, cart, shipping, and support content is omitted. The resulting table
  and page are intentionally shorter than the reference.
- Add to cart buttons are omitted from comparison until Phase 5 supplies a cart
  model. Product detail's Add to cart stays disabled.
- The reference depicts two products and an empty third slot; Compfi supports
  the same maximum-three structure with deterministic default products and
  shareable add/remove URL state.
- Tablet/mobile stacking, a labelled horizontal-scroll region, focus states,
  44px targets, live status, loading/error/empty states, and reduced-motion
  behavior are accessibility/product decisions not proven by the desktop PNG.
- Accessible semantic action/muted colors override sampled low-contrast pairs.

## Non-goals

- Phase 5 cart state, cart drawer population, cart page, checkout, totals, or
  purchasing.
- Persisted comparison state, accounts, Clerk, cookies, localStorage, database,
  server action, API route, analytics, or external service.
- New catalog products, copied reference photography, generated assets, or
  externally hosted imagery.
- Ratings, reviews, stock, delivery promises, dimensions, material claims,
  warranty, manufacturing origin, support promises, or other fabricated data.
- Variant-level comparison, variant pricing, or encoding product-detail option
  selections into the comparison URL.
- Header/navigation redesign or speculative comparison icons on unrelated
  cards.
- Phase 4 cart behavior, Phase 6 content pages, Phase 7 broad interaction
  polish, Phase 8 full-site audit, authentication, or real-service work.
- An architecture audit/refactor or unrelated cleanup.

## Acceptance criteria

- `/comparison` exists with metadata, one main landmark, the shared hero and
  breadcrumbs, a reference-faithful summary/picker hierarchy, truthful
  comparison table, benefits strip, and existing footer.
- Missing query state shows the documented two-product default; repeated
  `product` params select up to three known unique products in first-occurrence
  order; explicit empty, invalid, duplicate, overflow, one-product, and full
  states behave as specified.
- Add and remove operations produce canonical fixed-path URLs and are usable by
  mouse, keyboard, touch, and assistive technology without a global store.
- Product summary images and names link to the correct detail route, images use
  local intrinsic media through `next/image`, and all money uses `Money`/the
  shared en-US USD formatter.
- The table compares only price, category, committed descriptions, sizes, and
  finishes. No unsupported claim or mixed currency appears anywhere.
- Product-detail Compare is a real link that opens `/comparison` with the
  current slug; Add to cart remains disabled with cart-specific explanatory
  copy and existing option behavior is preserved.
- The table is semantically associated, its overflow is contained and labelled,
  document-level horizontal overflow is absent at 1440, 1024, 768, 390, and
  320px, and long content remains readable.
- Every interactive target is at least 44×44px, focus-visible is clear and
  unclipped, contrast meets AA, headings are logical, status changes are
  appropriately announced, and reduced motion is respected.
- Loading, empty, full, invalid-query, and error states are safe, useful, and
  tested. Error UI never exposes the raw error.
- Component APIs extend native props, export `<Name>Props`, merge `className`,
  preserve caller props, expose stable kebab-case slots/states, and keep domain
  decisions out of generic UI primitives.
- No dependency, provider, persistence layer, unapproved asset, or unrelated
  feature is added.
- Owning documentation and this prompt report actual measurements, deltas,
  verification, commits, review findings/dispositions, and final status.

## Tests and verification

Add focused tests for the pure resolver and UI behavior. At minimum verify:

- default pair, explicit empty, one/three products, first-order preservation,
  deduplication, unknown-value rejection, maximum-three truncation, candidate
  exclusion, and canonical add/remove URLs;
- one main/h1, breadcrumbs, truthful headings/rows, USD, local images, product
  links, no unsupported claims, and no Add to cart comparison action;
- native picker label/options/required behavior and its GET form shape;
- remove accessible names and destinations, comparison status, empty/full
  states, loading busy semantics, and safe error retry/recovery;
- product-detail Compare destination and retained independent size/finish/
  quantity behavior;
- table caption/header associations and zero axe violations for representative
  default, empty, and full component states.

Use accessible queries and `userEvent`; do not assert private component state,
mock React, add brittle DOM snapshots, or substitute JSDOM for layout evidence.
Run and record:

```bash
npm run test -- test/comparison.test.ts test/product-detail.test.tsx
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

If the default Turbopack build fails only because its PostCSS worker cannot
bind an internal sandbox port, record the exact failure and run the supported
`npm run build -- --webpack` fallback. Do not claim the default build passed.

For browser verification, start `npm run dev` using the already approved
command, then use the same named agent-browser session for the entire task.
Verify at 1440×1000, 1024×900, 768×1024, 390×844, and 320×720:

- default two-product composition and table geometry against fresh crops of
  `design/5-Product Comparison.png`;
- direct URLs for explicit empty, one known product, three products, duplicate,
  unknown, and overflow parameters;
- keyboard traversal through product links, removal, picker, Add product, and
  the table scroll region; visible/unclipped focus and native select operation;
- submit Add product, confirm the URL and table update, remove each position,
  use Back/Forward, refresh deep links, and navigate from a product-detail
  Compare action;
- one main/h1, live status, table semantics in the accessibility snapshot,
  image/font loading, no console/hydration/application errors, and no document
  horizontal overflow;
- table-only horizontal overflow at pressured widths, touch-target sizing,
  200% text, 400% zoom/reflow where practical, and reduced-motion preference;
- loading/error recovery using deterministic test coverage plus real-browser
  smoke behavior available from the local route.

Capture full-page and focused summary/table screenshots in a new task-specific
`/tmp` directory. Inspect them rather than merely creating them. Fetch the
fresh Web Interface Guidelines required by `web-design-guidelines`, review all
new/changed UI files, fix valid findings, and record the outcome.

## Documentation and completion workflow

Before the implementation commit:

- update `docs/pages.md` with the `/comparison` route contract, measured
  geometry, URL states, responsive decisions, reference deltas, and actual
  verification;
- update `docs/components.md` with every comparison block plus any certified or
  changed Table/NativeSelect/ProductOptions API, states, slots, keyboard,
  responsive behavior, and real Compfi usage;
- update `docs/design-system.md` with only verified purpose-named comparison
  geometry tokens and the final overflow decision;
- update `docs/catalog.md` with the comparison projection/default-selection
  contract if that detail belongs with fixture consumers; do not duplicate the
  full URL contract across documents;
- update `CONTEXT.md` only if a stable, unambiguous domain term is introduced;
- update this prompt with approval status, immutable `BASE_SHA`, check results,
  screenshot path, review results, dispositions, commits, and unpushed status.

Capture `BASE_SHA=$(git rev-parse HEAD)` before implementation and keep it
immutable. After self-verification, load `caveman-commit`, stage only this
approved task's files, inspect the staged diff, and make the local
implementation commit on `main`. Then run `code-review` against
`BASE_SHA...HEAD` with independent parallel Standards and Spec reviewers,
using this prompt as Spec and `AGENTS.md` plus owning docs as Standards.
Evaluate every finding against the diff, installed APIs, and repository rules.
Fix valid findings, rerun affected complete checks, update docs, and create a
separate local fix commit with `caveman-commit`. Re-run both review axes from
the original `BASE_SHA` if a fix materially changes architecture, public APIs,
shared components, data flow, security, or complex interaction behavior.
Preserve finding counts and the worst issue inside each axis. Do not push.

## SKILLS USED

- `frontend-design` — preserve the reference's product-led hierarchy,
  typography, spacing, restrained states, copy, and intentional deltas.
- `building-components` — own comparison block/table/picker APIs, native prop
  inheritance, exported props, slots, state, tokens, accessibility, and docs.
- `vercel-composition-patterns` — keep the block composable, avoid boolean-prop
  proliferation, and keep state ownership out of reusable presentation.
- `vercel-react-best-practices` — preserve the Server Component page, minimize
  client JavaScript/serialization, use direct imports, and optimize images.
- `react-testing` — own behavior-first RTL/Vitest coverage, accessible queries,
  `userEvent`, axe, and the component-test versus browser boundary.
- `shadcn` — inspect and correctly compose the established Base UI table,
  native-select, field, empty, button, link, and skeleton approach.
- `agent-browser` — use one named session for responsive screenshots,
  interactions, URL navigation, keyboard, reflow, and accessibility smoke tests.
- `web-design-guidelines` — run the fresh final UI/UX/accessibility review over
  every new or changed UI file.
- `code-review` — run the mandatory independent parallel Standards and Spec
  review from the immutable base and preserve both axes.
- `caveman-commit` — generate the implementation and any review-fix commit
  messages; never stage, push, or amend through the skill.
