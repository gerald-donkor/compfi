# Build Compfi cart state, populated drawer, and cart page

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-09. This is a planning
artifact only; it authorizes no implementation until the user explicitly
approves it through the single-letter `y` workflow.

Planning-time repository state is clean on `main` at
`21327da`. Reconfirm `git status --short`, `git branch --show-current`, recent
history, and `HEAD` immediately before execution. If the branch is not `main`,
stop and ask for direction. Preserve every unrelated or user-authored path
that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Implement the first dependency-safe unit of Phase 5: a real in-memory cart
model shared by product detail, the existing header drawer, and a new `/cart`
route. Customers can add a configured catalog product from product detail,
review it in the modal cart drawer, change its quantity or remove it in the
drawer or cart page, and navigate between the cart and the future checkout
route. This unit replaces the deliberately empty Phase 3 drawer and makes the
already visible product-detail action truthful.

Phase 4 (Home, Shop, product detail, and comparison) is committed, documented,
verified, and review-closed. Cart state is the first dependency of the ordered
Phase 5 deliverable; the checkout form and safe placeholder placement boundary
depend on it, so they are explicitly deferred to the next prompt. There is no
second equally unblocking unit.

The required lightweight architecture-signal check found one new, legitimate
in-process state owner—not repeated adapters, provider seams, or scattered
commerce calculation rules. Keep cart identity, validation, and cents-based
totals inside a narrow cart module/provider; do not run an architecture audit
during this `i` workflow.

## Evidence to re-read before implementation

- `AGENTS.md`, especially sections 1.1–1.2, 2, 3.2–3.4, 4–12; `CONTEXT.md`;
  `docs/catalog.md`; `docs/design-system.md`; `docs/components.md`;
  `docs/pages.md`; `docs/automation.md`; and `docs/agent-browser.md`.
- Current `components/chrome/cart-drawer.tsx`, `header-controls.tsx`,
  `site-header.tsx`, `components/product/product-options.tsx`,
  `components/commerce/quantity-input.tsx`, `money.tsx`, `lib/catalog.ts`,
  `types/commerce.ts`, and their focused tests. Confirm actual exports and
  component contracts before changing any of them.
- Open `design/4-Cart Sidebar.png` (2880 × 6214), `design/6-Cart.png`
  (2880 × 3592), and `design/7-Checkout.png` (2880 × 6140) at native
  resolution. Checkout is reference context only in this task; do not build
  it. Follow `docs/automation.md`: retain task-specific native crops and
  scanline evidence under a `/tmp` task directory, distinguish measurement
  from implementation decision, and use the established 2 raster px : 1 CSS
  px working interpretation.

Planning evidence to re-measure and correct if a crop disproves it:

| surface | native observation | CSS interpretation / decision |
| --- | --- | --- |
| modal sheet | Cart Sidebar's white sheet begins around x=1780 and is 1100 raster px wide | preserve the reviewed 550px maximum right sheet and 20% black scrim; no new sheet primitive |
| drawer composition | header/top rule, two compact media rows, subtotal, then three outline actions occupy the top-right sheet | show truthful Compfi lines, subtotal, `/cart` and future `/checkout` navigation; omit unsupported comparison/cart buttons rather than imitate them |
| cart hero | Cart reference uses the repeated photo title band beneath its 200-raster-px header | reuse the approved tokenized `PageHero` banner wash; do not copy or hotlink unknown-provenance photography |
| cart desktop body | table begins about x=196 and ends near x=1837; totals wash begins near x=1899 and is about 900 × 850 raster px | use the established container with a purpose-named two-column cart layout and approximately 450px totals surface; actual copy and rows determine height |
| cart rows | reference table has media/name, price, quantity, subtotal, and a removal control | use semantic headers on desktop and the certified `QuantityInput`; use a labelled, structured card/list representation below the table pressure point instead of unreadable horizontal overflow |
| lower chrome | cart reference retains the shared benefit band and footer | reuse `BenefitsStrip` and `SiteFooter` unchanged; never restore unsupported warranty, shipping, or support claims |

The refs establish a quiet white product workspace framed by the warm totals
surface and restrained structural rules. Use existing semantic tokens and
Poppins type roles; do not introduce shadows, decorative badges, unverified
discounts, ratings, delivery terms, inventory status, payment claims, or a
dashboard-card aesthetic. Compfi USD fixtures replace the reference brand and
mixed-currency placeholder amounts.

## Installed framework and component sources

Before implementation, re-read the installed Next.js 16.3.4 docs relevant to
the changed ownership and routes:

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`

Run `npx shadcn@latest info --json`, inspect `components.json`, and run
`npx shadcn@latest docs sheet button empty table field input` before composing
or changing those existing components. Fetch and read the returned current
documentation URLs. Inspect installed Base UI source/types whenever the local
sheet contract does not settle behavior. Do not reinstall, overwrite, or add a
second generic table or dialog implementation.

Before browser work, re-read `docs/agent-browser.md`, run
`agent-browser skills get core`, then use one worktree-scoped named session
with a `compfi-cart` prefix for the whole task. Never use the shared unnamed
session. Close the named session at handoff.

## Scope and component ownership

### 1. Cart domain model and in-memory state

Create a small cart-owned module (expected under `lib/cart.ts`, with a
separate client provider/hook only if that prevents browser state from leaking
into the pure module). It must own and test the pure rules below, independent
of React, browser globals, and JSX:

- A cart line is uniquely identified by allowlisted catalog product slug plus
  the selected configured size and finish values. Do not use an array index,
  a display name, a mutable product object, or a price as identity.
- Add input must accept only an existing Catalog Product and only its configured
  `defaultSize`/`defaultFinish` or valid selected option values. Invalid,
  disabled, or foreign option values are rejected/ignored safely; callers may
  not manufacture catalog details.
- Quantity is a positive whole number. Retain the existing truthful preview
  ceiling of 10 per line; normalize malformed, fractional, zero, negative, and
  excessive inputs without binary-floating-point arithmetic. Adding an existing
  identity merges and clamps that line to 10.
- Removing a missing identity and setting quantity on a missing identity are
  no-ops. Setting a line to less than one removes it. Preserve first-add order.
- Derive selection count, line subtotal, and cart subtotal from immutable
  Catalog Product `priceCents` using safe integer cents. There is no tax,
  shipping, discount code, grand-total claim, inventory, or order calculation.
- Export only the small types/functions actually used by tests/provider/UI.
  Do not extend `CatalogProduct` with cart state and do not create a generic
  commerce store, adapter interface, persistence abstraction, server action,
  route handler, cookie, localStorage entry, or backend.

Build a focused client `CartProvider`/`useCart` boundary around that pure
model. Mount it at the narrowest shared layout boundary that permits the
server-rendered header, product pages, and cart route to compose it without
turning their content into client components. It holds in-memory state for the
current tab and intentionally resets on a full reload; state persistence is an
unapproved product decision. Pass minimal serializable data to client leaves,
derive presentation from the immutable local catalog, and never keep
request-specific mutable state at module scope.

The provider API should make cart actions explicit (`add`, `setQuantity`,
`remove`) and expose renderable state plus a polite live-message value. Avoid a
Boolean-prop family or a prop-drilling transport layer. The state owner is the
only place that knows its reducer/implementation details.

### 2. Product-detail add-to-cart action

Evolve the existing small `ProductOptions` client leaf, retaining its size,
finish, and quantity selection controls, to add the currently configured
catalog product through the provider. The public props must stay narrow and
documented; pass immutable catalog-backed values necessary to form a valid add
input, never an invented SKU or client-trusted arbitrary price.

- Replace the disabled preview action and its stale unavailable copy with a
  enabled `Add to cart` action once valid choice state exists.
- On success, preserve the selected option controls, announce a concise polite
  outcome identifying the product, and do not forcibly open the modal drawer
  or claim a completed purchase. A second add updates the existing matching
  line up to the cap and announces the resulting quantity.
- Keep the existing shareable Compare link independent and functional. The
  quantity field, selector keyboard behavior, disabled unavailable choices,
  focus styles, and 44px action target requirements remain intact.

### 3. Drawer and cart blocks

Replace `CartDrawer`'s permanent empty composition with a cart-aware focused
client leaf while retaining its audited Base UI `Sheet` foundation, named
dialog, Escape/backdrop dismissal, inert background, scroll lock, and trigger
focus restoration.

- Its trigger exposes a concise cart count without relying on icon shape alone;
  use a stable accessible name that includes the count when nonzero. Cart
  changes update an appropriate polite live region without repeatedly announcing
  the entire drawer.
- Empty state remains a truthful `Your cart is empty` invitation with the
  existing `/shop` link. Do not display zero-value fake lines.
- With items, render compact local-image rows with meaningful product-view alt
  text, product-detail links, configured size/finish only where present,
  `Money`, a clear remove icon action, subtotal, a real `/cart` link, and a
  `/checkout` navigation link labelled as proceeding to checkout. Never call
  it payment or order confirmation.
- The drawer must be usable at 1440px and become an inset near-full-width sheet
  on 390px/320px. Its internal line list scrolls when necessary without moving
  its close control or footer actions out of reach.

Create purpose-named cart blocks rather than embedding two unrelated render
trees in the provider: one line presentation may be composed by the drawer and
page through children/explicit variants only if the actual semantics and
geometry overlap; otherwise keep the dense drawer row and wide cart row
separate. Document their props and owned accessibility state in
`docs/components.md`. Do not add a second generic Cart table primitive.

### 4. `/cart` route and states

Add `app/cart/page.tsx` with route metadata and colocated `loading.tsx` and
`error.tsx` only when the current Next docs and route behavior make them useful.
Use a Server Component page shell and a minimal client cart-content leaf. The
route has one `main` landmark, a `PageHero` titled `Cart` with semantic Home /
Cart breadcrumbs, a cart content region, the unchanged benefits strip, and the
unchanged footer.

- Desktop: a semantic table with headers for Product, Price, Quantity, and
  Subtotal, then line rows and a separately named remove column/action. Product
  media uses local `next/image` metadata, correct `sizes`, no layout shift,
  and a useful product-view alt. The totals surface is a quiet warm block with
  Subtotal only and a real `/checkout` `Proceed to checkout` link.
- Tablet: retain the two-column hierarchy while it stays readable; collapse
  deliberately before either the table or totals becomes cramped.
- 768px and below: replace desktop table semantics with labelled line-item
  groups/cards so each price, quantity, subtotal, and remove action remains
  visible and understandable. The totals block follows content in normal flow.
  Verify 390px and 320px have no document horizontal overflow.
- Empty: render an explicit, useful empty state and `/shop` browse link in the
  content area; do not show a zero-value totals/checkout action that implies an
  order is ready. Its heading and route metadata stay accurate.
- Updating a quantity recalculates line subtotal and cart subtotal immediately
  in cents, gives disabled minus/plus buttons correct state at bounds, and
  announces a concise outcome. Removal offers no fake undo; it announces the
  product removal and focuses a sensible surviving control or the cart heading
  when the last line disappears.
- Loading: do not fabricate cart lines. Use a correctly labelled skeleton only
  if a real suspense boundary is reached. Error: show a recoverable, concise
  message without internal exception details and a retry/recovery route.

The `/checkout` destination may be an existing-free future route only if the
link is not emitted until its target exists in the following approved unit;
otherwise render a disabled, explicitly explained control whose copy does not
promise checkout. Resolve this immediately before implementation from the
repository: never ship a broken internal link. Do not build `app/checkout`,
the billing form, payment-method controls, `Place order`, or checkout totals
in this task.

## Accessibility, security, and interaction requirements

- Meet WCAG 2.2 AA. Use semantic list/table/group structures appropriate to
  each breakpoint; accessible names, visible focus rings, logical headings,
  44 × 44px targets, screen-reader text for icon actions, and no color-only
  state.
- Preserve Base UI Sheet's modal mechanics rather than recreating them. Test
  Escape, backdrop closure, focus return, named dialog, and keyboard reachability
  after items have changed.
- Keep `QuantityInput` controlled correctly on cart lines. Its visible native
  numeric input has an accurate label per product, works by pointer, keyboard,
  ArrowUp/ArrowDown, valid typing/blur, and does not accept a malformed draft
  as state.
- Dynamic product additions, removals, quantities, subtotals, and header count
  require restrained polite announcements. Do not use redundant `role=alert`
  for ordinary cart changes.
- Treat all browser cart state as untrusted display state. No currency decimal
  arithmetic, payment details, tax/shipping calculation, stock assertion,
  server mutation, analytics, third-party provider, or persistence is allowed.
- Respect `prefers-reduced-motion`; drawer state motion comes from the existing
  primitive/tokens and content remains usable with motion reduced.

## Non-goals and reference deltas

- No checkout route/form, billing-address collection, validation, payment
  choice/provider, order placement, order persistence, account/authentication,
  inventory, shipping, tax, coupon, discount, or payment claim.
- No cart persistence across reloads or tabs; no cookie, localStorage,
  IndexedDB, server action, route handler, database, or external service.
- No warranty, free-shipping threshold, 24/7 support, materials guarantee,
  reviews, ratings, stock, delivery promise, favorite list, comparison action,
  template address, newsletter, or legacy brand/currency copied from the refs.
- The unknown-provenance photo heroes become existing tokenized washes; actual
  fixture product images, US English copy, and integer USD cents replace all
  template visuals/content. The reference's desktop-only table becomes a
  semantic responsive table/list because no mobile comps are supplied.

## Expected files and documentation

Likely implementation paths (verify ownership; do not create speculative
duplicates):

- `lib/cart.ts` plus a focused cart client provider/hook under `components/` or
  `lib/` as current conventions support.
- `app/layout.tsx` only if needed to compose a narrow client provider around
  server-rendered children; `app/cart/page.tsx` and any justified cart
  loading/error boundaries.
- `components/chrome/cart-drawer.tsx`, `components/chrome/header-controls.tsx`,
  `components/product/product-options.tsx`, and new purpose-named cart blocks.
- Focused pure-model, component, route, and browser tests under the existing
  test organization; update old tests which assert that Add to cart is inert.
- Update `CONTEXT.md` only for durable, non-speculative terms such as Cart Line
  if the contract needs one; `docs/components.md` for APIs/states/a11y;
  `docs/design-system.md` only for demonstrably stable cart geometry tokens;
  `docs/pages.md` for route behavior, measured decisions, reference deltas, and
  actual verification; `docs/automation.md` if repeatable cart capture commands
  evolve. Keep the AGENTS documentation index truthful if a new owner document
  is genuinely created.

## Acceptance criteria

1. A valid configured catalog product can be added from every product detail
   route; matching selections merge at a ten-unit line limit, differing valid
   variants remain distinct, and all prices/totals use integer USD cents.
2. Header count, populated drawer, and `/cart` stay synchronized during a
   client navigation session; malformed inputs cannot create arbitrary products
   or variants, and a reload truthfully begins with an empty cart.
3. Drawer retains all audited modal behaviors and clearly supports empty and
   populated cart states; its item links, remove actions, subtotal, and cart
   navigation work without broken routes.
4. `/cart` faithfully reflects empty/populated/update/remove states, is
   semantic and readable at 1440, 1024, 768, 390, and 320px, and uses an
   intentional mobile representation rather than an unreadable table.
5. The product and cart UI include verified keyboard behavior, focus-visible
   treatment, meaningful image alternatives, restrained live updates, correct
   native labels, zero axe violations, no mobile overflow, and reduced-motion
   compatibility.
6. No checkout/payment/provider/persistence/unsupported commercial claims are
   introduced. Checkout remains a subsequent clearly scoped prompt.
7. Documentation records real measurements, decisions, deltas, exact checks,
   browser evidence, and review dispositions—not planned work as fact.

## Verification and completion workflow

1. Capture immutable `BASE_SHA` with `git rev-parse HEAD` before implementation
   changes. Add pure cart-model tests for canonical identity, option validation,
   order, merge/clamp, removal, missing operations, exact cents subtotals, and
   malformed quantities. Add React Testing Library/user-event/axe coverage for
   add, count, drawer, page, quantity, removal, empty state, focus, and all
   relevant links.
2. Run the focused cart/product/chrome tests, then `npm run test`, `npm run
   lint`, `npx tsc --noEmit`, and `npm run build`. If the known restricted
   Turbopack PostCSS worker-port failure recurs, record its exact output and run
   `npm run build -- --webpack`; never call a constrained failure a passing
   default build.
3. With `npm run dev`, use the named `compfi-cart` browser session to add a
   configured product from product detail; change variants and quantity; add
   again; open/close drawer via trigger, Escape, and backdrop; remove a line;
   open `/cart`; update/remove lines; test empty recovery and every emitted
   link. Capture stable screenshots at 1440×1000, 1024×900, 768×1024, 390×844,
   and 320×720, plus a drawer-open desktop screenshot. Inspect no overflow,
   focus, layout, hierarchy, USD, and local media. Run `agent-browser a11y` on
   product detail, drawer, populated cart, and empty cart; test 200% text and
   reduced motion. Retain only temporary evidence in a task-specific `/tmp`
   directory and close the session.
4. Run a fresh `web-design-guidelines` review against every changed UI file,
   fetching its current rule set first. Resolve valid issues before commit.
5. Update the owning docs before staging. Re-read every changed file and the
   complete diff. Use `caveman-commit` to create an implementation commit on
   `main`, staging only task files.
6. Follow the mandatory two-stage `code-review` process against
   `BASE_SHA...HEAD`, using this prompt as the Spec and `AGENTS.md` plus owning
   docs as Standards. Preserve independent `## Standards` and `## Spec`
   reports, verify each finding against code and the prompt, document its
   disposition, fix valid findings with focused checks and docs, then create a
   separate `caveman-commit` fix commit. Re-run the full two-axis review from
   the same base after any material state, API, shared-component, or interaction
   fix. Do not push.

## SKILLS USED

- `frontend-design` — apply the reference's restrained product-led hierarchy,
  specific typography, sparse copy, and non-generic visual composition.
- `building-components` — cart block/component taxonomy, native-prop APIs,
  controlled state, owned slots, data attributes, accessibility, and docs.
- `vercel-composition-patterns` — narrow provider interface and composed cart
  blocks without Boolean-prop proliferation or leaking implementation state.
- `vercel-react-best-practices` — Server/Client boundaries, direct imports,
  minimal serialization, client state, and rerender/bundle discipline.
- `react-testing` — pure/model versus component-test boundary, accessible
  queries, user-event, axe, and browser-flow coverage.
- `shadcn` — inspect current project configuration and current docs before
  composing existing Sheet, Table, Field, Input, Button, and Empty wrappers.
- `agent-browser` — named-session browser interaction, responsive screenshots,
  accessibility smoke tests, and safe closeout.
- `web-design-guidelines` — fresh final UI/UX and accessibility rules review.
- `code-review` — required independent Standards and Spec review after the
  self-verified implementation commit.
- `caveman-commit` — concise Conventional Commit messages for implementation
  and any accepted review fixes.
