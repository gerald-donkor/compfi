# Build the Compfi Home commerce foundation

## Status and authorization boundary

Prepared for approval. This is the next dependency-safe unit of Phase 4. Do
not modify implementation files, generate or add assets, install packages or
skills, stage, commit, or push until this prompt is explicitly approved with
`y` or `Y`.

## Goal and why this is next

Replace the foundations placeholder at `/` with the upper, commerce-oriented
portion of the Compfi Home reference: the campaign hero, room-category
navigation, and an eight-item featured product grid. Build the reusable
`ProductCard` and `ProductGrid` boundaries needed by the later Shop route while
keeping the page server-rendered and backed only by the committed static catalog
fixtures and project-local media.

Phases 1–3 are committed, verified, and reviewed. The first Phase 4 unit also
established the typed catalog and all media required by this scope. The Home
page is therefore the earliest unbuilt customer surface whose dependencies are
present. This prompt intentionally stops before the reference's inspiration
carousel and editorial room mosaic: those blocks require a distinct editorial
media contract and an interactive carousel audit, so they belong in the next
Home prompt-sized unit rather than being improvised from duplicated catalog
images.

## Starting repository evidence

- Current branch: `main`; current `HEAD` is
  `4ab9674020744b5d7efe043d0edf4766a4fe3b35`; `main` tracks
  `origin/main`, and the starting worktree is clean. Confirm all of this again
  immediately before execution and capture the immutable `BASE_SHA` with
  `git rev-parse HEAD` before changing implementation files.
- Phase 3 completion is recorded in `docs/pages.md` and
  `docs/components.md`. `SiteHeader`, `SiteFooter`, `BenefitsStrip`, `Button`,
  `Link`, `Badge`, `Money`, and the layout primitives are certified and should
  be composed rather than recreated.
- `app/page.tsx` is still a foundations placeholder. It renders the shared
  header/footer through `app/layout.tsx`, owns `main#main-content`, and appends
  `BenefitsStrip`; preserve that landmark and the existing shared chrome.
- `lib/catalog.ts` is the sole server-safe source for exactly eight immutable
  `CatalogProduct` fixtures. Prices are integer USD cents and media records
  expose local paths, useful alt text, and intrinsic dimensions. Do not copy,
  reshape, or supplement the records in page code.
- `public/images/home/campaign-hero.webp` is a 1536 × 1024 local image with
  furnishings on the left and quiet copy space on the right.
  `dining.webp`, `living.webp`, and `bedroom.webp` are 1254 × 1254 local room
  images. Every catalog product image is a local 1120 × 1400 WebP.
- `components.json` confirms an RSC, Tailwind CSS 4, Base UI, Lucide,
  `base-nova` shadcn project. The generated generic `Card`, `Carousel`,
  `Skeleton`, and `Empty` files remain uncertified. This unit does not need a
  generic card, carousel, loading skeleton, or empty-state primitive.
- Installed Next.js 16.3.4 documentation confirms pages are Server Components
  by default, `next/image` local string sources require explicit intrinsic
  dimensions, responsive images require an accurate `sizes` value, and
  `priority` is deprecated in favor of `preload`. Only the campaign hero is an
  LCP candidate and may use `preload`.
- The recent history contains shared-chrome review churn and one static catalog
  boundary, but no repeated commerce workflow, scattered pricing behavior,
  second adapter, or caller-visible sequencing problem. The lightweight
  architecture-signal check does not cross the Section 3.5 audit threshold;
  do not run an architecture audit during this single-letter `I` workflow or
  during execution of this approved prompt.

## Reference evidence and measured interpretation

Open `design/1-Home.png` at its native 2880 × 9670 raster size before
execution. The validated working scale is two raster pixels to one CSS pixel.
Use `docs/design-system.md` and repeatable crops from `docs/automation.md`; do
not eyeball or replace recorded evidence with a screenshot impression.

| surface | native raster evidence | CSS interpretation for this unit |
| --- | --- | --- |
| shared header | 200 raster px tall | existing 100 CSS px `SiteHeader`; unchanged |
| campaign hero | image band begins below the header and runs to approximately y=1620 | about 710 CSS px of image-led desktop hero below the header; validate the exact transition before choosing the token |
| campaign panel | exact `#FFF3E3` region is 1286 × 886 at x=1478, y=506 | 643 × 443 CSS px, positioned on the right at x=739, y=253 in the 1440 viewport |
| hero type | the documented Home specimens use 52/65 px bold display and 18 px body | reuse `type-display` and `type-body-lg`; do not add a one-off font scale |
| room images | first image is 762 × 960 at x=262–1023, y=2016–2975; the three-column runs at y=2400 begin at x=262 | approximately 381 × 480 CSS px with about 18–19 CSS px inter-card gaps inside a narrower centered row |
| product cards | first card begins at x=202, y=3380 and is 570 × 892; image field is 570 × 602 | 285 × 446 CSS px card with a 285 × 301 CSS px cropped image field |
| product grid | four card runs are separated by 64 raster px | four 285 CSS px columns with 32 CSS px gaps in the existing 1240 CSS px container |
| lower boundary | the reference inspiration wash begins at y=5526 | stop this unit before that approximately 2763 CSS px page position; do not add a blank imitation band |

The reference establishes the hierarchy, not Compfi's product facts or source
copy. Continue to use Poppins, the measured cream/gold/neutral tokens, flat
surfaces, square buttons, and restrained image radii already documented. Do not
copy the legacy wordmark, lorem ipsum, mixed-currency prices, ratings, reviews,
stock claims, sale percentages, share/like actions, or `Buy now` behavior.

## Visual and content direction

Keep the Home page calm, furniture-led, and materially warm. The campaign image
is the memorable element; all other composition stays quiet and geometric.
Use concise Compfi copy with no unsupported business facts:

- hero label: `A calmer home`;
- hero heading: `Furniture for considered rooms.`;
- hero body: `Explore warm textures, natural materials, and pieces that bring
  ease to everyday spaces.`;
- hero action: `Shop the collection` linking to `/shop`;
- room heading: `Browse by room`;
- room support: `Start with the space, then find pieces that belong there.`;
- room labels: `Dining`, `Living`, and `Bedroom`, each linking to
  `/shop?category=<category>`;
- product heading: `Featured furniture`;
- product action: `View all products` linking to `/shop`.

Do not add an uppercase eyebrow treatment, decorative numbering, gradients,
rounded SaaS cards, shadows, ratings, inventory language, social proof, or
motion for its own sake. Review the visual plan against the reference before
coding and remove any treatment that is generic rather than evidence-backed.

## Exact scope and expected files

Create or modify only the files needed for this unit. Exact filenames may vary
when a clearer existing home is found after re-reading the repository, but the
responsibility boundaries must remain:

- `app/page.tsx`: server-owned Home orchestration, route metadata, section
  order, and the single `main#main-content` landmark. Remove the design-system
  placeholder CTA and render the campaign, rooms, featured products, then the
  existing `BenefitsStrip`.
- `components/home/campaign-hero.tsx`: server-rendered campaign block with one
  LCP `next/image`, an HTML copy panel, and a real `/shop` link composed through
  the existing `Button` rendering contract.
- `components/home/room-category-grid.tsx`: server-rendered, data-driven room
  navigation for the closed `ProductCategory` set. Keep its local records small:
  category value, customer label, local image metadata, and link only.
- `components/commerce/product-card.tsx`: a reusable server-rendered Compfi
  component for one `CatalogProduct`. It owns image crop, visible badge copy,
  name, description, current price, optional compare-at price, and product-detail
  navigation. Export `ProductCardProps`, extend a semantic native element's
  props where appropriate, forward valid DOM props, merge `className`
  predictably, and expose stable kebab-case `data-slot` values.
- `components/commerce/product-grid.tsx`: a reusable semantic list/grid that
  receives `readonly CatalogProduct[]`, renders `ProductCard`, exports
  `ProductGridProps`, forwards appropriate native props, and owns only layout.
- `app/globals.css`: add only measured, documented Home/product-card tokens that
  the existing system does not express. Candidate roles include desktop hero
  height, hero panel width, room-media aspect ratio, product-card media ratio,
  and product-card overlay. Keep reference evidence, semantic roles, and
  component tokens separated; do not scatter arbitrary dimensions in JSX.
- `test/home.test.tsx` and/or `test/product-card.test.tsx`: focused semantic and
  accessibility tests for customer-observable output, links, USD rendering,
  badges, compare-at behavior, alt text, and section hierarchy. Reuse
  `test/a11y.ts`; do not snapshot DOM or test Tailwind class strings.
- `docs/components.md`: certify and document `ProductCard` and `ProductGrid`
  APIs, slots, semantics, states, responsive behavior, image behavior, and one
  real Compfi use.
- `docs/pages.md`: record the implemented Home foundation, native/CSS
  measurements, responsive decisions, copy decisions, verification evidence,
  and all reference deltas. Mark the route as an intentionally partial Phase 4
  surface until the later inspiration/gallery unit is complete.

Do not modify `lib/catalog.ts`, `types/commerce.ts`, catalog image files,
shared chrome, generated generic `Card`/`Carousel`/`Skeleton`/`Empty`
components, `next.config.ts`, dependencies, lockfiles, skills, design
references, or unrelated files unless execution discovers a verified blocker
that is reported before scope expands.

## Component and rendering boundaries

- Keep `app/page.tsx`, campaign, room grid, `ProductGrid`, and `ProductCard` as
  Server Components. This unit has no state, effect, browser API, or event
  handler that justifies a new client boundary.
- Import catalog data directly in the server page. Pass only the records each
  component renders; do not introduce a provider, context, store, fetch layer,
  route handler, or module-level mutable state.
- Use composition rather than flags. `ProductCard` represents one honest
  product-card design; do not add `featured`, `home`, `hoverable`, `sale`, or
  other boolean mode props. Badge and compare-at rendering derive from the
  existing product record.
- A product card is a product-specific component rather than a restyled generic
  shadcn `Card`. The current generic `Card` is an uncertified `div` with rounded,
  padded, ringed styling that conflicts with the measured flat semantic
  `article`; do not distort either interface merely to claim reuse.
- Use existing `Badge`, `Money`, `Link`, and `Button` components for their owned
  behavior. Do not nest interactive elements. Use one primary product-detail
  link destination `/shop/${product.slug}` and ensure the card's image/name
  affordance is clear without turning the entire article into overlapping
  links.
- If implementing the reference's desktop overlay treatment, limit it to a
  redundant `View product` link. Reveal it for both hover and `focus-within`,
  keep the ordinary name/image link available to touch and keyboard users, and
  never render nonfunctional add-to-cart, comparison, share, or favorite
  buttons. The overlay must not be necessary to understand or navigate the
  product.

## Responsive behavior

Verify these explicit widths and derive intermediate behavior from content
pressure:

- **1440 CSS px:** preserve the approximately 710 px image hero, 643 × 443 px
  right-side cream panel, three 381 × 480 room crops, and four 285 px product
  columns with 32 px gaps. Align the page to the established 1240 px container.
- **1024 CSS px:** retain an image-led hero while reducing the panel to a
  balanced portion of the canvas; use three room columns and three product
  columns when the measured card content remains legible. Do not force desktop
  widths or overflow.
- **768 CSS px:** let the hero panel and image stop competing—use a stable
  stacked or lower-overlay composition with the HTML copy before it becomes
  cramped. Use two room columns and two product columns.
- **390 CSS px:** place the hero image and readable copy panel in normal flow,
  keep the primary action at least 44 px tall, and use one room and one product
  column with full-width media. Preserve generous but reduced section spacing.
- **320 CSS px:** maintain the same hierarchy without horizontal scrolling,
  clipped type, inaccessible overlay actions, or fixed heights that hide copy.

At every width, reserve image space before load, use `object-fit` and documented
focal positioning for deliberate crops, and give every responsive `next/image`
an accurate `sizes` expression. Use `preload` only for the campaign hero; all
below-fold images remain lazy by default.

## States and interaction contract

- **Default:** images, category labels, product name/description, prices, and
  destination links are visible without interaction.
- **Hover:** navigation affordances may use existing semantic color changes;
  the optional desktop product overlay may appear without moving the card.
- **Focus-visible:** every link retains an obvious, unclipped Compfi focus ring;
  the product overlay, if present, also appears on `focus-within`.
- **Active:** reuse the established one-pixel active feedback on button-like
  actions; do not invent large transforms or layout shifts.
- **Disabled/loading/success/error:** this static read-only unit has no mutation
  or async request and therefore no disabled, pending, success, or customer
  error state. Do not fabricate them. Missing/broken media remains a build/test
  failure under the catalog contract.
- **Empty:** the committed catalog invariant is exactly eight products, so the
  Home featured block is not an empty-capable customer flow. Empty browsing
  results belong to the later filterable Shop unit. Do not certify `Empty` or
  add dead fallback UI here.
- **Reduced motion:** no nonessential entrance animation, parallax, or carousel
  is in scope. Existing reduced-motion rules must continue to remove transition
  effects without hiding content.

## Accessibility, performance, and security

- Preserve the skip link target and use one `h1` in the campaign panel. Give
  each subsequent major section an `h2`; card product names may be `h3` within
  the featured section. Do not skip heading levels.
- Room images sit inside labeled links; use useful room-specific alt text that
  adds visual context without merely repeating the adjacent room name. Product
  images use fixture alt text unchanged. The hero image is atmospheric and its
  adjacent copy carries the message; use `alt=""` when the image is decorative.
- Badges must show text (`New` or a truthful discount percentage calculated
  from integer cents). Never rely on color alone. Do not label a product
  `Sale` without the existing higher compare-at value.
- Format all prices through `Money`/`lib/money.ts`. If showing a discount
  percentage, calculate it from integer cents without changing the fixture or
  implying a time-limited offer. Keep compare-at markup understandable to
  assistive technology; do not expose a confusing pair of unlabeled amounts.
- Links and controls must have at least 44 × 44 CSS px targets where they are
  presented as actions. Body copy must remain within readable line lengths.
- Use semantic HTML and existing accessible components. Do not add ARIA when
  native headings, lists, articles, links, and images already provide the right
  model.
- Keep the initial JS payload unchanged apart from existing chrome; this unit
  adds no client component. Avoid barrel imports, broad dynamic image imports,
  duplicate serialization, or eager loading of the eleven below-fold images.
- Use only checked-in `/images/...` paths. Add no remote pattern, network
  request, environment variable, HTML injection, user input, analytics, or
  external side effect.

## Data and edge cases

- Render `catalogProducts` in its canonical fixture order and do not mutate or
  sort it in place. `ProductGrid` accepts a readonly collection so the future
  Shop page can reuse it without weakening immutability.
- A `sale` product must have `compareAtPriceCents`; render the existing current
  and compare-at values and derive any visible percentage from those values.
  A `new` product renders the visible word `New`. Products without a badge or
  compare-at price reserve no blank badge/price node.
- Long but valid product names/descriptions must wrap without pushing price
  content outside the card. Do not truncate customer-facing product copy unless
  the reference geometry is proven to require it and the complete accessible
  name remains available.
- Category records must cover exactly `dining`, `living`, and `bedroom`, use
  their committed local images, and construct stable encoded query links.
- Broken fixture media metadata, non-safe money, unknown categories, and
  duplicate identifiers remain guarded by the existing catalog tests rather
  than being caught or hidden in rendering components.

## Reference deltas

- Replace the reference brand and all template copy with Compfi language.
- Use the original project-local generated media and coherent USD fixtures
  instead of copying unknown-source reference photography and relabeling mixed
  currency values.
- The hero action says `Shop the collection` and navigates rather than claiming
  an immediate purchase through `Buy now`.
- Product cards omit add-to-cart, comparison, share, favorite, ratings, stock,
  and review affordances until their real behavior exists. A redundant
  `View product` overlay may preserve the visual interaction cue while the
  always-visible title/image link keeps it accessible to touch and keyboard.
- Room links use the future Shop category query contract; the current prompt
  does not build filtering or the Shop route.
- The Home page ends this unit after featured products and proceeds to the
  existing `BenefitsStrip`, footer, and shared chrome. The inspiration carousel
  and editorial room mosaic are explicitly deferred to the next Home unit, not
  represented by placeholders or repeated assets.
- Tablet and mobile compositions are derived from the desktop hierarchy because
  no responsive references exist. Accessibility and no-overflow behavior take
  precedence over preserving desktop overlap.

## Non-goals

- Do not build `/shop`, `/shop/[slug]`, `/comparison`, cart state, checkout,
  contact, blog, authentication, or any backend/provider.
- Do not build or certify the inspiration carousel, social/editorial gallery,
  generic `Card`, `Carousel`, `Skeleton`, or `Empty` components.
- Do not generate, download, crop into new files, or otherwise add imagery in
  this unit. Do not reuse the design reference as production media.
- Do not add GSAP, Embla behavior, scroll animation, parallax, page-load
  choreography, auto-rotation, or Phase 7 motion polish. Installed animation
  packages are not a requirement to use them.
- Do not add ratings, reviews, favorites, stock, delivery thresholds, sale
  deadlines, warranties, addresses, policies, newsletter forms, social-network
  links, or other unsupported business facts.
- Do not change the shared header, footer, cart drawer, benefit copy, fixture
  prices, or catalog domain contract.

## Implementation sequence

1. Re-read `AGENTS.md`, this approved prompt, `CONTEXT.md`,
   `docs/design-system.md`, `docs/components.md`, `docs/pages.md`,
   `docs/catalog.md`, `docs/automation.md`, `design/1-Home.png`, installed
   Next.js page/server-client/Image/Link docs, `components.json`, every
   component consumed or changed, and every skill named below. Confirm clean
   `main`, record starting status, and capture immutable `BASE_SHA`.
2. Reproduce the documented native crops and validate the hero boundary, cream
   panel geometry, room-image runs, product-card runs, and lower inspiration
   boundary. Record observed raster evidence separately from chosen responsive
   CSS tokens.
3. Write or update focused behavior tests first for product-card semantics and
   Home landmarks/copy/links; confirm each new test fails for the intended
   missing behavior before implementation.
4. Add only missing Home/product-card tokens, then implement the server-owned
   `ProductCard`, `ProductGrid`, room grid, campaign, and page composition in
   dependency order. Use `next/image` with intrinsic dimensions and accurate
   `sizes`; use `preload` only on the hero.
5. Run focused tests and inspect the page in a real browser at 1440, 1024, 768,
   390, and 320 CSS px. Compare the implemented upper Home page with the native
   reference crops; inspect keyboard order, focus, touch-reachable navigation,
   400% reflow, reduced motion, image loading, console output, and horizontal
   overflow. Iterate on measured mismatches rather than subjective restyling.
6. Run `web-design-guidelines` against every changed UI file, fetch its current
   guideline source as required by the skill, verify each finding against local
   standards, and resolve valid findings before calling self-verification
   complete.
7. Update `docs/components.md` and `docs/pages.md` with actual measurements,
   decisions, deltas, and command/browser results. Inspect every changed file
   and the complete diff. Run the full checks below.
8. Load `caveman-commit`, stage only this prompt's approved files, inspect the
   staged diff, and create a local implementation commit on `main`. Do not stage
   unrelated changes and do not push.
9. Run `code-review` from `BASE_SHA...HEAD` with independent parallel Standards
   and Spec reviewers. Use this prompt as the Spec source and `AGENTS.md`,
   `docs/design-system.md`, `docs/components.md`, `docs/pages.md`,
   `docs/catalog.md`, and the skill's full smell baseline as Standards sources.
10. Verify every finding against the actual diff, installed APIs, reference,
    and prompt. Apply valid fixes with tests/docs in a separate local commit via
    `caveman-commit`; rerun affected checks and rerun the complete two-axis
    review from the original `BASE_SHA` if a fix materially changes a shared
    component API, server/client boundary, data flow, or complex interaction.
    Never push.

## Acceptance criteria

- `/` no longer contains the foundations placeholder. It renders one semantic
  main landmark containing the campaign, room navigation, all eight catalog
  products, and the existing benefits strip before the shared footer.
- Desktop geometry faithfully preserves the reference hierarchy at 1440 CSS px:
  image-led hero with right cream panel, three tall room crops, and four-column
  flat product cards. Differences are measured and documented.
- The page has no horizontal overflow and remains readable and navigable at
  1024, 768, 390, and 320 CSS px and at 400% zoom/reflow.
- Every product displays its fixture name, description, correctly formatted USD
  price, local image/alt text, and working planned product-detail link. Optional
  badges and compare-at prices render only when justified by fixture data.
- Campaign, room, product, and `View all products` links use the intended
  `/shop` destinations without nested interactive elements or fake mutation
  controls.
- `ProductCard` and `ProductGrid` export documented prop types, forward valid
  native props, merge `className`, expose stable `data-slot` values, and remain
  server-safe.
- Only the hero uses `preload`; every responsive image reserves its ratio and
  has an accurate `sizes` expression. No remote image, layout shift caused by
  missing dimensions, console error, or hydration warning remains.
- Keyboard order is logical; focus is visible and unclipped; hover-only content
  is redundant; touch users can reach every destination; axe/component checks
  produce no unaddressed violation.
- No new client boundary, dependency, generated image, data source, provider,
  unsupported business claim, lower Home placeholder, carousel, or editorial
  mosaic appears in the diff.
- `docs/pages.md` truthfully marks this as a partial Home implementation and
  owns its measurements/deltas. `docs/components.md` truthfully certifies the
  new product components and owns their API/state/accessibility contract.

## Verification commands and evidence

Run from the repository root and report the actual output:

```bash
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

If the restricted sandbox again prevents Turbopack from binding its internal
PostCSS worker port, preserve the exact error and run
`npm run build -- --webpack` as the existing documented fallback. Do not report
the failed default build as passed.

For browser verification, start `npm run dev`, then load the installed
`agent-browser` core workflow before issuing browser commands. Capture stable
screenshots at 1440, 1024, 768, 390, and 320 CSS px. At 1440, compare the upper
page with reference crops spanning header/hero, rooms, and products; do not
compare the intentionally deferred lower blocks as if they were implemented.
Use browser/accessibility snapshots to verify headings, image alternatives,
link names and destinations, keyboard order, focus-visible states, and that the
page remains usable with hover unavailable. Check computed document width at
every viewport, test 400% reflow where practical, emulate reduced motion, and
inspect console/network output for hydration, image, route, and asset errors.

After the implementation commit, preserve the `code-review` reports under
separate `## Standards` and `## Spec` headings. Report finding counts and the
worst issue within each axis, the disposition of every verified finding, all
local commits created, and no push.

## SKILLS USED

- `frontend-design`: own the reference-faithful visual plan, furniture-specific
  composition, concise Compfi copy, responsive hierarchy, restraint, and
  screenshot critique.
- `building-components`: own `ProductCard`/`ProductGrid` taxonomy, semantic
  native prop contracts, composition, data slots, accessibility, and component
  documentation.
- `vercel-composition-patterns`: prevent boolean-prop modes and keep page,
  block, component, and child composition explicit.
- `vercel-react-best-practices`: preserve Server Components, direct imports,
  minimal serialization/JavaScript, analyzable image paths, and responsive
  rendering performance.
- `react-testing`: drive behavior-focused Vitest/RTL tests with accessible
  queries and axe checks; keep layout/visual assertions in the browser lane.
- `shadcn`: inspect the established project/components, reuse certified
  primitives, apply semantic tokens and composition rules, and verify the
  deliberate decision not to force the uncertified generic `Card` onto the
  product-specific semantic article.
- `agent-browser`: run real-browser responsive, interaction, keyboard,
  accessibility-smoke, console, and screenshot verification after loading the
  installed CLI's matching core workflow.
- `web-design-guidelines`: perform the required final UI/UX/accessibility review
  against freshly fetched guidelines and resolve valid findings.
- `caveman-commit`: produce terse Conventional Commit messages for the local
  implementation commit and any separate review-fix commit.
- `code-review`: run the mandatory parallel Standards and Spec review from the
  immutable base after the implementation commit and keep both axes separate.
