# Build the Compfi product-detail commerce-browsing surface

## Status and authorization boundary

Approved with `y` and implemented from immutable review base
`f45c1e9c2bea95147a5626354dbe25c3fc0f275f`. The task remains unpushed.

Planning-time repository state is clean on `main` at
`f45c1e9c13bbf061bf143f2144566c34eaa07288`. Reconfirm the current branch,
`git status --short`, recent history, and `HEAD` immediately before execution.
If the branch is no longer `main`, stop and ask for direction. Preserve every
unrelated or user-authored path that appears after this prompt is prepared.

## Goal and why this is next

Build `/shop/[slug]` as the next complete product-detail browsing surface for
all eight committed Compfi catalog products. The surface includes a compact
breadcrumb band, product-specific metadata, a useful selectable gallery,
truthful USD price, optional demonstrative size and finish selection, quantity
selection, honest unavailable-action treatment, product information tabs,
related products, loading/error/not-found states, responsive layouts, and
local product-detail media.

Phases 1–3 are committed, documented, verified, and independently reviewed.
Within Phase 4, the catalog/media foundation, Home, and Shop are implemented
and reviewed. Product detail is therefore the unique earliest unbuilt unit: it
is reached from every existing `ProductCard`, uses the established catalog and
shared chrome, and must exist before product comparison can offer complete
product navigation. `/comparison` remains the next separate Phase 4 unit.
Cart state and checkout remain Phase 5 and must not be pulled into this task.

This task completes the browsing and configuration presentation of a product,
not purchasing or comparison behavior. Render the reference actions in an
honest unavailable state with visible explanatory copy; do not create a fake
cart, broken `/comparison` link, transient success message, global store, or
placeholder mutation merely to make the controls appear active.

## Starting repository evidence

- `lib/catalog.ts` is the sole immutable source for exactly eight static
  `CatalogProduct` records. Each currently has identity, category, short
  description, safe integer USD-cent price, optional compare-at price/badge,
  and one local 1120×1400 WebP image. It has no stock, rating, review,
  warranty, delivery, specification, or provider data.
- `types/commerce.ts` owns `CatalogProduct`, `ProductMedia`, `ColorOption`,
  `SizeOption`, category, and badge types. Extend this existing contract
  narrowly; do not create a parallel product-detail fixture in page code.
- `getCatalogProductBySlug` already returns `undefined` for an unknown slug.
  Add a pure related-product helper only if the route would otherwise need to
  know selection rules.
- `ProductCard`, `ProductGrid`, and `Money` are certified, server-safe commerce
  components. Reuse them for related products and all customer-facing money.
- `QuantityInput`, `ColorSelector`, and `SizeSelector` are certified client
  components with controlled/uncontrolled APIs, 44px targets, keyboard
  behavior, accessible names, empty/disabled handling, and existing tests.
  Use them rather than rebuilding controls.
- `components/ui/tabs.tsx` is present but explicitly uncertified in
  `docs/components.md`. It wraps Base UI Tabs and must be inspected, checked
  against current shadcn/Base UI guidance, adapted only where needed, tested,
  and documented before this route relies on it.
- `PageHero` is a server-safe shared title/breadcrumb block. Its unused
  `breadcrumb` size currently still renders an `h1`, while the reference needs
  a breadcrumb-only compact band followed by the visible product `h1` in the
  detail summary. Evolve this API with an explicit, type-safe variant rather
  than adding a boolean or creating duplicate breadcrumb markup.
- `Skeleton`, `Empty`, `Button`, `Link`, `Breadcrumb`, `Separator`, and the
  layout primitives already exist. Inspect actual source and certification
  status before use; compose existing components and do not reinstall them.
- `components.json` confirms a Tailwind CSS 4, RSC, Base UI, Lucide,
  `base-nova` shadcn project. Use Base UI `render`, not Radix `asChild`, and use
  semantic tokens rather than raw component colors.
- `next.config.ts` does not enable Cache Components. Installed Next.js 16.3.4
  documentation confirms that dynamic route `params` are promises, App Router
  pages are Server Components by default, `generateStaticParams` may
  prerender the eight known slugs, and `notFound()` terminates the render path,
  selects the nearest `not-found.tsx`, and injects `noindex`.
- `docs/pages.md`, `docs/components.md`, `docs/catalog.md`,
  `docs/design-system.md`, `docs/automation.md`, and `CONTEXT.md` are the
  current owners for route, component, fixture/media, design, measurement, and
  domain contracts. Read them again before execution.
- The lightweight architecture-signal check found repeated review churn in
  completed Home presentation code, but no repeated product-detail workflow,
  scattered commerce rule, caller-visible sequencing, repeated adapter, or
  real provider seam. It does not cross the Section 3.5 audit threshold. The
  single-letter `i` workflow forbids an audit now, and later `y` execution must
  remain within this approved prompt.

## Installed framework and package sources to re-read

Before implementation, re-read at minimum:

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/not-found.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`

Run `npx shadcn@latest info --json`, inspect `components.json`, and run
`npx shadcn@latest docs tabs button skeleton empty breadcrumb` before using or
adapting those components. Follow the returned current documentation URLs; do
not infer current APIs from memory. Inspect the installed Base UI Tabs source
and types when the local wrapper does not settle behavior.

## Reference evidence and measured interpretation

Open `design/3-Single Product.png` at its native 2880×6214 dimensions before
coding. Use native crops and scanlines following `docs/automation.md`, retain
the established two-raster-pixels-to-one-CSS-pixel working interpretation, and
record observations separately from implementation decisions.

The planning pass established these exact flat-run boundaries. Reproduce and
retain focused crops for the breadcrumb, full product summary, gallery,
information tabs, related products, and section boundaries during execution.

| surface | native raster evidence | CSS interpretation / decision |
| --- | --- | --- |
| header | this reference remains white through y=227, while the cross-reference Compfi baseline is a repeated 200 raster px header | keep the reviewed 100 CSS px shared header; record this reference-export inconsistency rather than changing global header geometry |
| compact breadcrumb wash | exact `#F9F1E7` center scan runs y=228–421, 194 raster px | about 97 CSS px; correct the currently unused 180px breadcrumb token/contract to a purpose-named 97px basis before first use |
| summary start | gallery surfaces begin at y=492, 70 raster px below the wash | 35 CSS px top separation; preserve spacious but not exaggerated transition |
| thumbnail rail | x=198–349, 152 raster px wide; four 160-raster-pixel surfaces at y=492–651, 716–875, 940–1099, 1164–1323 | about 76×80 CSS px thumbnails with 32px vertical gaps; Compfi may use three truthful views rather than duplicate a fourth image |
| lead image | x=412–1257 and y=492–1491, 846×1000 raster px | about 423×500 CSS px warm wash frame with 10px image radius |
| summary column | gallery ends at x=1257; visible product content begins around x=1470 inside the x≈198–2678 reference container | keep a two-column 1240px desktop composition with about 106px between gallery and summary; let content pressure define smaller breakpoints |
| summary section | structural border at y=2082–2083 | summary region ends near 1041 CSS px page y; use a semantic Separator or documented structural border token |
| information media | exact wash runs x=200–1409 and x=1468–2677 at y=2746–3441 | two approximately 605×348 CSS px landscape frames with a 29px gap |
| information section | top border y=2082–2083; next border y=3570–3571 | approximately 744 CSS px including tab navigation, copy, and media |
| related products | begins after y=3571; uses the established four 570-raster-pixel card runs and 64-raster-pixel gaps | reuse the certified four-column 285px ProductGrid and 32px gap; do not copy card markup |
| footer boundary | structural border y=5105; root footer follows | preserve the existing shared footer and let truthful content height determine the final route height |

The broad reference palette remains white, `#F9F1E7` wash, dark ink, muted
copy, and gold selection/action accents. Use the existing accessible semantic
tokens: do not restore low-contrast `#898989` text or white text on reference
gold. Any geometry promoted to a stable contract gets a purpose-named
product-detail token in `app/globals.css` and a matching documentation record.

## Visual direction

Preserve the reference's quiet, image-led premium furniture composition: an
unadorned breadcrumb band, dominant product imagery, restrained type hierarchy,
flat outlined controls, generous white space, a calm tabbed editorial field,
and familiar related-product cards. The product itself is the memorable visual
element. Add no gradients, generic shadow cards, glass effects, decorative
eyebrows, pill-heavy controls, star decoration, or ambient motion.

Use established Poppins typography and Compfi tokens. Desktop should be close
to the measured end state. Tablet and mobile derive from the same hierarchy;
accessibility, useful imagery, and no horizontal overflow override a literal
desktop arrangement.

## Product-detail data and media contract

Extend `CatalogProduct` only with product-detail fields used by every real
caller. Recommended shape, adjustable when actual implementation yields a
clearer equivalent:

- `detailDescription`: one or two concise English (United States) paragraphs
  grounded only in the existing product name, visible form, existing material
  wording, and category. Do not invent durability, craftsmanship, comfort,
  care, origin, warranty, availability, or delivery claims.
- `gallery`: a non-empty readonly tuple/array of exactly three validated
  `ProductMedia` records: the existing lead image plus a product-specific
  three-quarter view and close material/form view.
- `sizes?`: a non-empty readonly `SizeOption[]` only for products where a
  fixture size choice is coherent. Use descriptive demonstrative labels rather
  than pretending inventory exists; do not add disabled/out-of-stock options.
- `finishes?`: a non-empty readonly `ColorOption[]` with accessible customer
  labels and semantic fixture colors appropriate to the already described
  wood or upholstery. The CSS color string is presentation data, not a stock
  assertion. No option is disabled.

Use a single detail contract within `lib/catalog.ts`; do not make a second map
that callers must manually join to products. Validate and freeze new nested
arrays and records at initialization. Enforce non-empty useful copy, exactly
three unique local WebP paths, positive safe intrinsic dimensions, useful alt
text, no duplicate option values, and defaults that exist in their option
sets. Preserve the existing lead `media` field for card consumers; either make
it the first gallery item by construction or assert those records agree so the
two sources cannot drift.

Add a pure `getRelatedCatalogProducts(product, limit = 4)` or slug-based
equivalent only if it deepens the route interface. It must exclude the current
product, prefer same-category fixtures in canonical order, fill remaining
slots from canonical catalog order, never duplicate, never mutate fixtures,
clamp a non-negative safe limit, and return a frozen readonly result. Do not
encode recommendations, personalization, ratings, or tracking.

### Generated detail media

Use the built-in `image_gen` tool, not the fallback CLI, external downloads, or
reference pixels. For each of the eight existing lead images:

1. Inspect the local lead with `view_image` and label it as a **reference
   image**, not an edit target. The existing file must remain unchanged.
2. Make two separate built-in generation calls so each output receives a
   specific brief: one landscape three-quarter product view and one landscape
   close material/form detail. Preserve the product's defining silhouette,
   materials, palette, and studio direction from the reference image.
3. Use this normalized common scaffold, substituting exact product details from
   the existing fixture and adding only the view-specific line below:

   ```text
   Use case: product-mockup
   Asset type: project-bound Compfi product-detail gallery image
   Input images: Image 1: reference image for the existing product's identity, materials, palette, and studio direction; do not modify or overwrite Image 1
   Primary request: an original alternate product photograph of <fixture product name and existing description>
   Scene/backdrop: warm off-white minimal studio interior consistent with Image 1
   Subject: the same recognizable furniture design as Image 1, with matching silhouette, proportions, materials, and color
   Style/medium: premium photorealistic product photography
   Composition/framing: landscape 3:2, <view-specific composition>, useful center-safe crop for a 605:348 frame
   Lighting/mood: soft controlled natural light with a subtle grounding shadow, consistent with Image 1
   Materials/textures: only the wood, upholstery, or woven materials already visible and described in the fixture
   Constraints: preserve product identity; one product only; no people, text, logo, watermark, trademark, product label, embedded UI, extra furniture, collage, border, or cropped essential silhouette
   Avoid: redesigned product, changed material or color, duplicated parts, warped legs, impossible joins, illegible pseudo-text
   ```

   Three-quarter line: `front three-quarter view showing the complete product
   and its depth with generous breathing room`.

   Detail line: `closer side/detail view emphasizing one truthful defining form
   or material transition while keeping enough of the product visible to
   identify it`.
4. Inspect every output for identity consistency, geometry, extra objects,
   pseudo-text, borders, and useful responsive crops. Iterate with one targeted
   correction if required. Do not claim a generated material detail that the
   source/fixture does not support.
5. Copy selected project-bound finals into
   `public/images/catalog/detail/<slug>-three-quarter.webp` and
   `public/images/catalog/detail/<slug>-detail.webp`. Convert selected outputs
   non-destructively to WebP with recorded actual dimensions; never overwrite
   the eight existing lead assets. Keep intermediate/generated source files
   outside the shipped public tree unless provenance requires them.
6. Record every final exact prompt, input/reference role, source dimensions,
   final dimensions, output path, inspection result, and built-in-tool usage in
   `docs/catalog.md`. Produce a temporary contact sheet for verification and
   record its absolute `/tmp` path in the implementation evidence.

This produces 16 new gallery assets and three truthful views per product. Do
not create a fourth duplicate thumbnail solely because the reference shows
four.

## Route, metadata, and component boundaries

- Add `app/shop/[slug]/page.tsx` as an async Server Component. Await promised
  params, resolve the catalog product, call `notFound()` outside a swallowed
  promise/catch when absent, and render one `main#main-content` landmark.
- Export `generateStaticParams()` directly from the immutable catalog slugs so
  all eight known pages are prerenderable. Do not fetch, read request state, or
  add a route handler.
- Export product-specific metadata with `generateMetadata`, awaiting the same
  promised params and using concise Compfi title/description data. Do not add
  rating, price, availability, Open Graph image, or schema claims unless this
  approved fixture contract directly and truthfully supports them.
- Add colocated `loading.tsx`, `error.tsx`, and `not-found.tsx`. The error file
  is the narrow required Client Component and never exposes exception details.
  Not-found provides a real `Browse products` link to `/shop`.
- Evolve `PageHero` into an explicit discriminated contract: the existing
  banner variant keeps its visible title and breadcrumbs; the compact
  breadcrumb-only variant accepts breadcrumbs and renders no heading. Preserve
  existing `/shop` output and tests. Do not use a `hideTitle` boolean, duplicate
  the Breadcrumb composition, or render two product-name headings.
- Add a server `ProductDetail` block, or similarly clear name, for summary
  orchestration. It owns the visible product `h1`, `Money`, short description,
  fixture metadata, and composition of focused interactive leaves. It extends
  native section/article props, exports `<Name>Props`, forwards valid DOM
  props, merges `className`, and owns stable kebab-case slots.
- Add a focused client `ProductGallery` component that owns only active-image
  selection. Pass three serializable `ProductMedia` records. Use native buttons
  for thumbnails, `aria-label="Show <alt>"`, `aria-pressed` or the established
  selected-state primitive contract, and one polite atomic announcement after
  user-initiated changes. Do not announce the initial render. The selected
  image uses `next/image`, intrinsic dimensions, and an accurate `sizes` hint.
- Add a focused client `ProductOptions`/`ProductConfigurator` composition for
  optional size/finish and quantity state. Reuse `SizeSelector`,
  `ColorSelector`, and `QuantityInput`; do not reimplement their state. Keep
  defaults in fixture data, quantity at a validated minimum of 1, and use a
  conservative demonstrative maximum such as 10 only if documented as a UI
  guard rather than inventory.
- Render `Add to cart` and `Compare` as genuinely disabled `Button` controls
  associated with visible text: `Online ordering and comparison are not
  available in this preview.` Do not add click handlers, loading, success,
  cart-drawer mutation, localStorage, URL hacks, or navigation to an unbuilt
  route. Remove the temporary unavailable treatment only in the later task
  that supplies real behavior.
- Inspect and certify the existing Base UI Tabs wrapper. Product tabs are
  `Description` and `Details`; omit the reference's unsupported `Reviews [5]`.
  Description uses fixture detail copy. Details may list only product ID,
  customer-facing category, and available fixture option labels. TabsTrigger
  stays inside TabsList; Base UI owns tab/tabpanel semantics and Arrow/Home/End
  keyboard behavior.
- Add a server `RelatedProducts` block that uses the pure helper, the existing
  `ProductGrid`, a visible `Related products` heading, and a real `View all
  products` link to `/shop`. Related cards remain ordinary navigation with no
  newly invented commerce actions.
- Keep all static copy, lookup, relation selection, product cards, and route
  composition server-owned. Client boundaries receive only minimal immutable
  serializable media/options/default values. Export no shared constant or type
  from a client module, define no component inside another component, and add
  no provider/context when two independent focused leaves suffice.

## Expected file scope

Expected additions, with names adjustable only for a materially clearer
inspected boundary:

- `app/shop/[slug]/page.tsx`
- `app/shop/[slug]/loading.tsx`
- `app/shop/[slug]/error.tsx`
- `app/shop/[slug]/not-found.tsx`
- `components/product/product-detail.tsx`
- `components/product/product-gallery.tsx`
- `components/product/product-options.tsx`
- `components/product/product-information.tsx`
- `components/product/related-products.tsx`
- `public/images/catalog/detail/*` (exactly 16 selected WebP assets)
- focused tests such as `test/product-detail.test.tsx` and
  `test/product-gallery.test.tsx`

Expected updates:

- `types/commerce.ts`
- `lib/catalog.ts`
- `app/globals.css`
- `components/chrome/page-hero.tsx`
- `components/ui/tabs.tsx` only for verified certification fixes
- `test/catalog.test.ts`
- `test/chrome.test.tsx`
- `docs/catalog.md`
- `docs/components.md`
- `docs/design-system.md` for the corrected compact-breadcrumb token/evidence
- `docs/pages.md`
- this approved prompt, including final verification/review evidence where the
  established workflow records it

Do not modify the root layout, SiteHeader, SiteFooter, cart drawer contents,
Shop controls/results, Home blocks, unrelated primitives, dependencies,
lockfiles, skill files, `next.config.ts`, or environment files unless a
verified in-scope defect makes the change unavoidable and it is documented and
tested. Do not install a gallery, state, animation, or image dependency.

## Responsive behavior

- **1440 CSS px:** retain the shared 100px header; use the corrected ~97px
  breadcrumb-only wash; render the 1240px summary in two columns with the
  approximately 529px total gallery area (76px rail + 30px gap + 423px lead)
  and an approximately 604px information column. Keep the lead around
  423×500px, thumbnails around 76×80px, and actions/option groups aligned with
  the measured hierarchy. Information media uses two approximately 605×348px
  frames. Related products use the established four-card row.
- **1024 CSS px:** keep gallery and summary side by side only while each remains
  useful; reduce the inter-column gap, allow action buttons to wrap, and use
  the established three-column related grid. A thumbnail rail may stay
  vertical if it does not compress the lead image.
- **768 CSS px:** stack gallery above summary, place the three thumbnails in a
  horizontal row beneath or beside the lead image, keep selected state clear,
  allow tab labels to wrap/scroll only within their own region if necessary,
  stack the two information images, and use the two-column related grid.
- **390 CSS px:** use one content column, a full-width lead frame with preserved
  ratio, horizontally arranged 44px-minimum thumbnails, wrapped option groups,
  full-width unavailable action buttons, readable tab panels, one information
  image per row, and one related-product column.
- **320 CSS px:** retain the narrow container gutter, one-column hierarchy,
  useful `next/image` sizing, 44px targets, unclipped focus rings, readable USD
  formatting, and zero document overflow. If the thumbnail row cannot fit, it
  may scroll horizontally inside a labelled gallery region without creating
  page-level two-dimensional scrolling.

At 400% browser zoom, all text and controls must reflow without lost content or
two-dimensional document scrolling. Only the narrow gallery thumbnail region
may scroll on its own when genuinely required.

## States and behavior

- **Default/success:** each known slug shows its own name, USD price, lead
  image, first available size/finish where present, quantity 1, description,
  details, and unique related-product links. “Success” here means a fully
  rendered browsing state; no order or comparison success is implied.
- **Gallery selection:** clicking or keyboard-activating a thumbnail updates
  the main image, selected semantics, alternative text, and one concise polite
  status. The current thumbnail is identifiable without color.
- **Variants:** optional size/finish choices use the certified single-select
  semantics, remain selected when quantity/gallery changes, and expose visible
  labels. Products without a meaningful option omit that entire labelled
  group; do not render an empty selector as page chrome.
- **Quantity:** increment, decrement, typing, blur normalization, Arrow Up/Down,
  minimum, maximum guard if used, disabled state, and visible value remain
  owned by `QuantityInput`.
- **Tabs:** Description is initially active. Pointer and keyboard selection
  reveal exactly one associated panel. Arrow Left/Right and Home/End follow
  verified Base UI behavior; focus and selection remain perceptible.
- **Unavailable actions:** both action buttons are disabled, show their normal
  visible names, and share a visible explanation. No status falsely announces
  that anything was added or compared.
- **Related:** never contains the current slug or duplicates. Its count is at
  most four and uses deterministic fixture order.
- **Loading:** skeletons reserve breadcrumb, gallery, summary, tabs, and related
  geometry inside a single busy main landmark without fake product copy.
- **Not found:** unknown slugs render the nearest product not-found state with a
  useful heading, plain explanation, `/shop` recovery link, and Next's noindex
  behavior. Do not catch or transform the `notFound()` interrupt.
- **Error:** unexpected errors render a safe heading/message, `Try again`
  action calling `reset`, and `Return to Shop` link. Never display the exception
  message, stack, slug-derived HTML, or filesystem detail.
- **Image failure/empty:** the catalog validator makes an empty gallery invalid;
  the reusable gallery still handles an empty input defensively with a useful
  non-interactive empty state or returns no gallery with an explicit component
  contract. Broken image URLs are prevented by file/dimension tests rather than
  a client fetch retry system.
- **Hover/focus-visible/active:** use established semantic interactions.
  Thumbnail, tabs, links, selectors, quantity, and controls have visible focus;
  hover never reveals exclusive functionality.
- **Reduced motion:** image and tab changes are immediate or use existing
  reduced-motion-safe transitions. Add no carousel autoplay, entrance
  sequence, crossfade dependency, or decorative motion.

## Accessibility and security requirements

- Meet WCAG 2.2 AA. Render one `main`, one visible product-name `h1`, logical
  subsequent headings, semantic lists/figures where useful, and no duplicate
  product heading hidden in the breadcrumb band.
- Breadcrumb navigation identifies itself; Home and Shop are real links; the
  current product is a non-link with `aria-current="page"`.
- Every image has useful product/view-specific alt text and exact dimensions.
  Thumbnail alternative text must distinguish the view without redundantly
  speaking “image of.” Do not preload related or below-fold images; only the
  selected lead above the fold may be a priority candidate after browser/LCP
  evidence supports it.
- Gallery selection, size, finish, quantity, and tabs work with keyboard and
  touch. Touch targets are at least 44×44px. Selection and disabled state never
  rely on color alone.
- The gallery live region announces only user-caused main-image changes and is
  not duplicated by `aria-pressed` announcements. Disabled action reasoning is
  visible and programmatically associated where the underlying component API
  supports it.
- Price, compare-at price, and any calculated discount remain integer-cent
  display data formatted through the shared `Money` formatter. Never derive
  authority, totals, stock, shipping, tax, or availability in the browser.
- Slugs are used only for exact in-memory lookup. No slug becomes an external
  URL, path traversal input, CSS value, HTML string, query, or log payload.
- Add no server action, route handler, external request, analytics event,
  persistence, cookie, localStorage, secret, payment collection, or auth
  boundary.

## Reference deltas

- Use Compfi, English (United States), coherent USD-cent fixture prices, and
  original local generated media instead of the reference brand, mixed-locale
  currency, and unknown-provenance images.
- Correct the unused shared compact-breadcrumb height from the stale documented
  180 CSS px to the measured 194-raster-pixel/about-97-CSS-pixel product band.
  Keep the reviewed cross-reference 100px header despite this file's 228px
  header export.
- Use three unique gallery views rather than duplicating a fourth thumbnail.
- Omit star rating, `5 Customer Review`, reviews tab/count, social-share icons,
  material/specification claims, stock, SKU fiction, and tag stuffing. Product
  ID and category may appear as truthful fixture metadata.
- Use `Description` and `Details` tabs only. Details expose only the approved
  fixture contract.
- Show cart/comparison actions disabled with honest explanation until the
  comparison and cart-state units provide real behavior. Do not imply that a
  product was added, saved, or compared.
- Related products use actual distinct fixtures and may show fewer than four
  same-category items before deterministic fill. `View all products` is real
  navigation, not an infinite “Show more” action.
- Tablet/mobile arrangements, focus treatment, live feedback, 44px targets,
  loading/error/not-found states, and reduced-motion behavior are production
  additions not established by the desktop PNG.

## Non-goals

- `/comparison`, comparison selection/state, cart state, populated cart drawer,
  cart page, checkout, order submission, payment, tax, shipping, inventory,
  stock, authentication, wishlist, ratings, reviews, social sharing, or product
  search
- Contact, blog, Home, Shop browsing-control changes, Phase 7 decorative motion,
  or Phase 8 whole-site audit
- CMS/database/API/provider integration, server actions, route handlers,
  localStorage, cookies, analytics, email, remote media, or new dependencies
- Unverified furniture dimensions, material composition, performance claims,
  warranty, care, origin, delivery, sustainability, availability, or policy
  copy
- A fourth repeated gallery image, copied reference pixels, destructive edits
  to existing media, or externally hosted imagery
- Architecture audit, ADR, provider seam, migration, push, rebase, amend,
  squash, history rewrite, or unrelated cleanup

## Acceptance criteria

- Every existing product card link resolves to a prerenderable
  `/shop/[slug]` route with unique Compfi metadata, compact breadcrumb, one
  visible `h1`, correct product data, and one main landmark.
- Unknown slugs render the product not-found boundary; unexpected failures have
  safe retry/return handling; loading reserves the principal layout and exposes
  busy semantics.
- Every product has exactly three unique local gallery views, with 16 new
  inspected WebPs added non-destructively, exact intrinsic metadata, useful
  alt text, truthful identity, recorded prompts/provenance, and a temporary
  verification contact sheet.
- Gallery thumbnails update the lead image with correct selected semantics and
  restrained live feedback. Tabs, optional selectors, and quantity are usable
  by pointer, keyboard, and touch without state loss or duplicate client-owned
  product data.
- Product tabs contain only grounded fixture content. No rating, review, stock,
  warranty, shipping, social, or unsupported product claim appears.
- Add-to-cart and comparison controls remain explicitly unavailable and cause
  no mutation/navigation. Their reason is visible and understandable.
- Related products exclude the current item and duplicates, use deterministic
  catalog order, reuse `ProductGrid`/`ProductCard`, and link to valid detail
  routes.
- Desktop geometry follows the measured reference evidence; 1024, 768, 390,
  320, and 400% zoom honor the responsive contract with no document overflow,
  lost content, or clipped focus.
- The compact-breadcrumb evidence, token, PageHero contract, component
  certification, fixture/media provenance, route behavior, responsive deltas,
  checks, browser evidence, and review results are truthfully updated in their
  owning docs.
- No new dependency, external request, fake commerce state, duplicate
  component, raw component-level system value, secret, unrelated change, or
  push is introduced.

## Tests and verification

Use behavior-first Vitest/React Testing Library tests with accessible queries
and awaited `userEvent`; do not use DOM snapshots, test IDs when roles/labels
work, child-component mocks, or private-state assertions.

1. Extend catalog tests for detail copy, exactly three unique media records,
   lead/gallery agreement, nested immutability, local WebP existence and actual
   dimensions, useful unique alt text, option/default integrity, and rejection
   of malformed records. Test related selection for same-category preference,
   canonical fill, current-product exclusion, duplicates, limits, immutability,
   and empty/edge input.
2. Test the explicit `PageHero` variants: Shop banner output remains unchanged;
   compact breadcrumb output has navigation/current-page semantics and no
   heading. Update the documented geometry assertion to ~97px.
3. Certify Tabs with focused tests for tablist/tab/tabpanel relationships,
   default state, click selection, Arrow Left/Right, Home/End, disabled behavior
   if supported, focus visibility hooks/data state, native prop forwarding, and
   axe. Verify behavior from the actual installed Base UI version rather than
   overspecifying an unsupported mode.
4. Product gallery tests cover first-image default, distinct thumbnail labels,
   pointer and keyboard activation, selected semantics, lead `src`/`alt`
   changes, one user-initiated polite announcement, rerender/reset behavior,
   empty input, native props/slots, and axe.
5. Product options tests cover products with and without size/finish groups,
   default selection, changing each option, retained independent state,
   quantity behavior through the existing component, visible unavailable-action
   explanation, genuinely disabled actions, no callbacks/navigation, and axe.
6. Route/page tests cover all generated slugs, promised params, unique metadata,
   single main/heading, breadcrumb links, USD price, absence of unsupported
   ratings/reviews/claims, correct tabs/detail data, valid related links, and
   not-found behavior without swallowing Next's interrupt. Test loading busy
   semantics and error reset/return controls.
7. Run focused new/affected tests first, then run and report actual results:
   - `npm run test`
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm run build`
   If the known restricted-sandbox Turbopack PostCSS worker bind failure recurs,
   preserve its exact result and also run `npm run build -- --webpack`; never
   claim the first command passed.
8. Start the app with `npm run dev`. Before the first browser command, read
   `docs/agent-browser.md`, refresh `agent-browser skills get core --full`, and
   create one worktree-scoped named session for this whole task:
   `export AGENT_BROWSER_SESSION="$(agent-browser session id --scope worktree --prefix compfi-product-detail)"`.
   Never use the unnamed persistent session. Close the named session when done.
9. In the named browser session, exercise at least one product in each category
   plus all eight direct URLs. Verify card-to-detail navigation, back/forward,
   reload, unknown slug, gallery selection by pointer and keyboard, size/finish
   options where present, quantity buttons/typing/Arrow keys/bounds, tab
   click/Arrow/Home/End behavior, disabled actions, related navigation, visible
   focus, reduced motion, and safe error recovery where practically induced.
   Re-snapshot after every navigation or dynamic rerender before using element
   references.
10. Capture stable full-page and focused screenshots at 1440×1000, 1024×900,
    768×1024, 390×844, and 320×720. At 1440 compare breadcrumb height,
    container alignment, gallery/summary ratio, lead/thumbnail geometry, tab
    rhythm, information frames, four-card related row, and footer boundary with
    `design/3-Single Product.png`. At smaller widths verify the explicit
    responsive contract and `scrollWidth === clientWidth`.
11. Verify 200% text and 400% reflow, no two-dimensional page scroll, no clipped
    focus rings, useful image alternatives, no accidental eager-loading below
    the fold, selected/disabled state independence from color, and contrast in
    a real rendering engine. Run `agent-browser a11y` and inspect browser
    console errors.
12. Fetch the fresh Web Interface Guidelines as required by the local skill,
    review every new/changed UI file, verify findings against Compfi standards,
    and resolve valid issues before the implementation commit.
13. Inspect every changed file and the complete diff. Update owning docs before
    staging. Load `caveman-commit`, stage only this approved prompt's files,
    inspect the staged diff, and create one local implementation commit on
    `main`. Do not push.
14. Run `code-review` against the immutable `BASE_SHA...HEAD` with this prompt
    as the Spec and `AGENTS.md` plus owning docs as Standards. Spawn isolated
    Standards and Spec reviewers in parallel, include the complete smell
    baseline, and preserve separate `## Standards` and `## Spec` reports. This
    prompt is the originating spec; missing optional issue-tracker setup does
    not authorize invented issue content.
15. Verify every finding against the diff, installed APIs, prompt, reference,
    and repository rules. Resolve accepted findings in dependency order,
    rerun affected and full checks, update docs, and create a separate local
    fix commit using `caveman-commit`. Re-run both review axes from the original
    `BASE_SHA` if fixes materially affect the shared PageHero/Tabs API, fixture
    data flow, security, or complex gallery/tab interaction. Finish with no
    verified blocking issue and do not push.

## Documentation update

- Update `docs/catalog.md` as the sole detailed owner of the expanded fixture,
  gallery-media, validation, generation-prompt, provenance, and related-product
  contract. Record all 16 outputs and actual inspection evidence.
- Update `docs/components.md` with the explicit PageHero variant contract,
  certified Tabs behavior, ProductGallery, ProductDetail/ProductOptions,
  ProductInformation, and RelatedProducts APIs, slots, server/client ownership,
  states, responsive behavior, keyboard behavior, accessibility, and real
  Compfi usage.
- Update `docs/design-system.md` with the exact y=228–421 compact-breadcrumb
  evidence, corrected ~97px token, reference-export header discrepancy, and any
  genuinely reusable named product-detail geometry tokens. Do not duplicate
  component behavior there.
- Update `docs/pages.md` with the `/shop/[slug]` route record: measured raster
  evidence, chosen CSS interpretation, data/metadata/not-found behavior,
  server/client boundary, responsive decisions, all reference deltas, exact
  automated results, named browser session and flows, screenshot/contact-sheet
  paths, Web Interface Guidelines result, two-axis finding counts and
  dispositions, commits, and any environment limitation.
- Update statuses truthfully. No new documentation-index row or ADR is expected.

## SKILLS USED

- `imagegen`: use the built-in image tool for 16 project-bound product-detail
  views; preserve existing assets, inspect outputs, save selected finals into
  the workspace, and record exact prompts and paths.
- `frontend-design`: preserve the measured furniture-detail hierarchy, quiet
  Compfi visual character, grounded copy, responsive composition, and motion
  restraint without generic restyling.
- `building-components`: own semantic composition, native prop contracts,
  state/data attributes, gallery and tab accessibility, keyboard behavior, and
  component documentation.
- `vercel-composition-patterns`: use explicit PageHero variants and focused
  composition, avoid boolean-prop growth, keep state in the narrow gallery and
  options leaves, and preserve React 19 ref conventions.
- `vercel-react-best-practices`: enforce Server Component defaults, promised
  params, static generation, minimal serialization/client JS, direct imports,
  derived event state, stable rendering, and accurate `next/image` sizing.
- `react-testing`: own behavior-first Vitest/RTL coverage, accessible queries,
  awaited user interactions, axe assertions, and the JSDOM/real-browser
  boundary.
- `shadcn`: inspect project info, current docs, existing component source, and
  Base UI contracts before certifying Tabs or composing Button, Skeleton,
  Empty, Breadcrumb, and selectors; reuse semantic tokens and installed
  primitives.
- `agent-browser`: refresh the installed CLI-matched core guide, use one named
  worktree session, and own navigation, responsive screenshots, interactions,
  keyboard/focus/reflow, console, and accessibility smoke verification.
- `web-design-guidelines`: fetch the fresh rule set during execution and perform
  the final UI/UX/accessibility review of changed UI files.
- `code-review`: after the local implementation commit, run mandatory parallel
  Standards and Spec review from the immutable base and keep both axes
  separate.
- `caveman-commit`: create the local implementation and any separate review-fix
  commit messages, compressed to intent and without AI attribution.

## Execution evidence

Implementation and browser verification completed on 2026-09-09. The focused
product-detail suite passed 4 files / 20 tests; the complete suite passed 17
files / 77 tests; lint and `npx tsc --noEmit` passed. The default Turbopack
build reached only the known restricted-worker port limitation; the webpack
fallback compiled, type-checked, and prerendered all eight product slugs.

The required named browser session was
`compfi-product-detail-8dbc2e39d5ed` and was closed after use. All eight direct
URLs, card navigation, back/forward/reload, unknown-slug recovery, gallery,
options, quantity, tabs, responsive layouts, 200% text, 400% reflow equivalent,
reduced motion, console, and axe were exercised. Final axe result: 0 violations
and 0 incomplete. Screenshots are retained at
`/tmp/compfi-product-detail-{1440,1024,768,390,320}.png`; the generated-image
contact sheet is `/tmp/compfi-product-detail-contact-sheet.webp`.

Implementation commit and independent two-axis review evidence are recorded in
`docs/pages.md` after those workflow stages complete.

Initial review of `f45c1e9c...8a4540f` reported four documented Standards
violations plus one heuristic smell, and five Spec findings. Accepted fixes
protect PageHero/Tabs slots, export the Tabs prop contracts, pass orientation
to Base UI, reset gallery state across product identity changes, preserve empty
gallery naming, promote measured geometry to product tokens, strengthen full
lead/gallery agreement, and expand the focused matrix to 5 files / 27 tests.
The lead priority and root-layout marker were retained with their reproduced
Next/LCP evidence documented in `docs/pages.md`. A separate fix commit and the
required complete re-review from the original base follow. Post-fix checks
passed: focused 5 files / 27 tests, complete 18 files / 84 tests, lint,
TypeScript, and webpack production build with all eight slugs prerendered; the
default build repeated only the known sandbox worker-port limitation. The
post-fix named-browser route transition produced no console or application
errors, retained the root marker, and passed axe with 0 violations and 0
incomplete results.
