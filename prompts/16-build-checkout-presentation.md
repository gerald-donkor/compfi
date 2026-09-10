# Build Compfi checkout presentation and safe review boundary

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-09. This is a planning
artifact only. It authorizes no implementation until the user explicitly
approves it through the single-letter `y` workflow.

Planning-time repository state is `main` at `e2bfa6c`. The only pre-existing
worktree change before this prompt was written was the untracked historical
cart plan `prompts/15-build-cart-state-drawer-and-page.md`. Its exact scope is
already implemented by `d4e6ee5`, with review-fix commits `ac079b1` and
`e2bfa6c`; it is user-authored/unrelated for this task and must not be edited,
staged, committed, removed, or used as proof of a pending implementation.
Reconfirm `git status --short`, `git branch --show-current`, recent history,
and `HEAD` before execution. Stop if the branch is not `main`. Preserve every
unrelated path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Complete the remaining dependency-safe unit of Phase 5 by adding a real
`/checkout` route that presents US billing/contact fields, a cart-derived order
summary, an honest unavailable-payment state, and a safe client-only
`Check details` boundary. A valid review reports that the details were checked
but that no order was placed and no payment was processed. Once the route
exists, replace the populated cart page and drawer's deliberately disabled
checkout affordances with real internal links.

Phases 1–4 are implemented and review-closed. Phase 5's transient cart model,
populated drawer, and `/cart` page are committed and supply the checkout's only
data dependency. Checkout is therefore the earliest unbuilt part of the
ordered sequence and completes Phase 5 presentation without selecting a
payment, address-validation, tax, shipping, inventory, order, or persistence
provider. Phase 6 remains out of scope.

The required lightweight architecture-signal check found no threshold-crossing
candidate. Checkout should be a focused client block over the existing
`useCart` interface with a small pure validation module; there is no repeated
adapter, provider seam, or scattered checkout rule that warrants an
architecture audit. Do not run an architecture audit during this approved
single-letter workflow.

## Evidence to re-read before implementation

- `AGENTS.md`, especially sections 1.1–1.2, 2, 3.2–3.4, 4–10, and 12–13;
  `CONTEXT.md`; `docs/catalog.md`; `docs/design-system.md`;
  `docs/components.md`; `docs/pages.md`; `docs/automation.md`; and
  `docs/agent-browser.md`.
- The approved implementation source and tests: `app/layout.tsx`,
  `app/cart/page.tsx`, `components/cart/cart-provider.tsx`,
  `components/cart/cart-content.tsx`, `components/chrome/cart-drawer.tsx`,
  `components/chrome/page-hero.tsx`, `components/chrome/benefits-strip.tsx`,
  `components/commerce/money.tsx`, `components/ui/button.tsx`,
  `components/ui/empty.tsx`, `components/ui/field.tsx`,
  `components/ui/input.tsx`, `components/ui/textarea.tsx`,
  `components/ui/separator.tsx`, `lib/cart.ts`, `lib/catalog.ts`,
  `lib/money.ts`, `test/cart.test.tsx`, `test/field.test.tsx`, and the shared
  test/axe setup. Confirm actual exports and contracts before changing code.
- Open `design/7-Checkout.png` at its native 2880 × 6140 resolution. Use
  `docs/automation.md` to create fresh task-specific crops under `/tmp`, keep
  measurement separate from implementation decisions, and retain the
  established 2 raster px : 1 CSS px working interpretation. Use
  `design/6-Cart.png` and `design/4-Cart Sidebar.png` only to confirm the
  checkout-entry affordances being enabled; do not redesign those surfaces.

Planning-time native evidence to reproduce and correct if fresh crops disprove
it:

| evidence | native raster observation | CSS interpretation / decision |
| --- | --- | --- |
| page size and shell | 2880 × 6140; repeated 200px header and checkout hero ending near y=832 | retain the certified 100px header and 315px `PageHero`; use the approved tokenized hero wash instead of unknown-provenance photography |
| checkout body | billing heading begins near x=350/y=1050; summary begins near x=1548; body uses a broad white field | approximately 111px top gap after the hero, with a two-column desktop composition inside the established container |
| desktop columns | left form controls span about x=352–1258; right summary spans about x=1548–2602 | approximately 454px and 527px columns separated by 145px; preserve the asymmetric editorial hierarchy without hard-coding viewport coordinates |
| paired name fields | outlines are about 422 × 150 each with about 62 raster px between them | approximately 211 × 75px controls with a 31px gap at reference width |
| full form fields | repeated outlines are about 906 × 150 | approximately 453 × 75px; use the existing 10px control radius and accessible border/focus tokens |
| summary divider | rule is about 1054 × 2 from x≈1548 | approximately 527 × 1px using the certified `Separator`/border role |
| reference submit action | outline is about 636 × 128 around x≈1766/y≈2236 | approximately 318 × 64px; Compfi uses the same visual weight for `Check details`, not the misleading legacy `Place order` promise |
| lower chrome | benefit band follows a long white checkout body | reuse `BenefitsStrip` and the root `SiteFooter`; do not restore unsupported warranty, shipping, support, address, policy, or newsletter claims |

The reference establishes a quiet white form, generous vertical rhythm, strong
left billing heading, compact right product/subtotal table, one subdued rule,
and a restrained outline action. Preserve that hierarchy with existing Poppins
roles, semantic colors, flat surfaces, and square/10px geometry. Do not turn it
into a dashboard card stack, add shadows, or invent decorative motion.

## Installed framework and component sources

Before implementation, re-read the installed Next.js 16.3.4 documentation:

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- `node_modules/next/dist/docs/01-app/02-guides/forms.md`
- `node_modules/next/dist/docs/01-app/02-guides/server-actions.md`
- `node_modules/next/dist/docs/01-app/02-guides/data-security.md`

The installed docs confirm that pages remain Server Components by default,
interactive forms should be isolated to a client leaf, and every Server Action
is a reachable untrusted POST boundary requiring application validation and
authorization. This task has no authorized mutation, so do not create a Server
Action merely to imitate submission. Use a native form with a client
`onSubmit` handler that always calls `preventDefault()` and performs only the
local review described below.

Run `npx shadcn@latest info --json`, inspect `components.json`, and run
`npx shadcn@latest docs field input textarea button empty separator` before
using or adapting those components. Fetch and read the returned current docs.
Inspect the installed Base UI source/types whenever local component source does
not settle behavior. Reuse the certified Field/Input/Textarea/Button/Empty/
Separator compositions; do not add a second form system or overwrite a
generated component wholesale. `radio-group` is not needed unless a real
approved choice exists; do not render fake or disabled payment methods simply
to mimic the screenshot.

Before browser work, re-read `docs/agent-browser.md` and run
`agent-browser skills get core --full`. Set exactly one worktree-scoped named
session for the entire task, using a `compfi-checkout` prefix, before the first
browser command. Never use the shared unnamed session. Close the named session
at handoff.

## Scope and component ownership

### 1. Pure checkout review validation

Create a small pure module, expected at `lib/checkout.ts`, that owns only the
client-preview validation contract. Keep it independent of React, JSX, the cart
provider, network calls, browser storage, and mutable module state.

Define a closed field-name/data shape for:

- required: first name, last name, address line 1, city, state, ZIP code,
  phone, and email;
- fixed visible locale value: country/region `United States`;
- optional: company, address line 2, and order notes.

Validation must trim whitespace, reject blank required values, accept US ZIP
codes in `12345` or `12345-6789` form, validate a practical email shape in
addition to `type="email"`, and accept formatted phone input only when it
contains 10–15 digits. Apply explicit UI safety limits rather than accepting
unbounded strings: names/state/city up to 80 characters, company up to 100,
address lines up to 120, ZIP up to 10, phone up to 25, email up to 254, and
notes up to 500. Return a frozen or otherwise immutable error record keyed by
field name; never return, persist, log, or expose the submitted personal values.
Use concise field-specific US English messages. Add focused unit tests for
valid input, trimmed blanks, ZIP variants, formatted/invalid phone, invalid
email, and upper bounds.

This module is not an order schema, DTO, payment request, checkout adapter, or
future provider interface. Name it around reviewing checkout details, not
placing an order.

### 2. `/checkout` route and client checkout block

Add `app/checkout/page.tsx` as a Server Component route shell with route
metadata (`Checkout | Compfi` through the existing template) and one
`main#main-content`. Compose the existing `PageHero` titled `Checkout` with
Home / Cart / Checkout breadcrumbs, a focused client `CheckoutContent` block,
and the unchanged `BenefitsStrip`. The root layout already owns the footer; do
not duplicate it.

Expected component placement is `components/checkout/checkout-content.tsx`.
Keep the route shell server-safe and make only the cart/form interaction leaf a
Client Component. `CheckoutContent` consumes `useCart` directly; do not widen
the root provider, prop-drill cart state through the page, copy cart state into
form state, or create a checkout provider.

With a populated cart, render one native `<form noValidate>` containing:

- `FieldSet`/`FieldLegend` and `FieldGroup` for `Billing details`;
- the fields above, using certified `Field`, `FieldLabel`, `Input`, and
  `Textarea` components, persistent visible labels, correct `name`, `type`,
  `required`, `maxLength`, `inputMode`, and autocomplete tokens
  (`given-name`, `family-name`, `organization`, `country-name`,
  `address-line1`, `address-line2`, `address-level2`, `address-level1`,
  `postal-code`, `tel`, and `email`);
- a visible read-only Country/region value of `United States`; do not ship the
  reference's Sri Lanka/Western Province defaults or an incomplete country or
  state picker;
- a labelled optional order-notes textarea with a short non-claiming prompt;
- one error summary when submission has errors, plus field-level `FieldError`
  messages. Put `data-invalid` on `Field`, `aria-invalid` on its control, and
  merge description/error IDs in `aria-describedby` without duplicate IDs;
- a `Payment method` section that truthfully says payment options are not
  available in this preview and that no payment will be submitted. Render no
  card, bank, cash-on-delivery, radio, account, policy, or provider controls;
- a submit `Button` labelled `Check details`, styled with the restrained
  outline hierarchy established by the reference. Do not label it `Place
  order`, `Pay`, `Complete checkout`, or anything that implies a transaction.

The submit handler must prevent all navigation/network submission, extract
values ephemerally from the form, invoke the pure validator, and retain only
error/status state. If invalid, display and programmatically focus a concise
error summary with links or otherwise direct access to each invalid field, and
keep each field's error association correct. Clear a field's stale error when
that field changes, and clear a previous success status after any edit. If
valid, leave the entered values and cart untouched and announce in a polite,
atomic status: `Details checked. No order was placed and no payment was
processed.` Do not show a fake order number, confirmation, redirect, timeout,
toast, or artificial pending state.

If the cart is empty on direct load or becomes empty through another cart
surface, render the certified `Empty` composition instead of the form/summary:
`Your cart is empty`, a useful explanation, and a real `/shop` `Browse
furniture` link. Do not show a zero subtotal, billing fields, payment state, or
checkout action. Move focus to the empty-state heading when a populated
checkout becomes empty only when doing so does not steal focus from an active
modal; otherwise preserve the existing modal's focus mechanics.

Do not add `loading.tsx` or `error.tsx` merely for completeness. This route has
no async data source, Suspense boundary, or server mutation; loading and remote
error states are not applicable. Unexpected rendering errors remain owned by
the existing application boundary until a real route-specific recovery case
exists.

### 3. Cart-derived order summary

Inside the checkout block, compose a purpose-named summary section from the
existing cart interface and immutable catalog fixtures. Do not create a second
cart store or pass browser-supplied prices.

- Use semantic headings/list or table-like description markup appropriate to
  the compact reference. Each line shows the catalog product name, configured
  size/finish when present, quantity, and integer-cent line subtotal through
  `Money`.
- Link product names back to `/shop/[slug]` only if the compact geometry and
  accessible focus treatment remain clear.
- Derive all displayed amounts from canonical `CatalogProduct.priceCents` and
  cart quantity. Reuse the provider's `subtotalCents` for the order subtotal.
- Show `Subtotal` only. Do not relabel it as an authoritative grand total or
  add tax, shipping, discount, delivery, availability, or price guarantees.
- Add concise copy that this is a display subtotal and that no order or payment
  is submitted by the preview. Do not copy the reference privacy-policy claim
  because Compfi has no approved policy route or data service.
- Checkout is read-only for cart lines. Quantity/removal remain owned by the
  cart page/drawer, preventing two divergent editing interfaces.

Keep summary subcomponents at module scope, not nested inside render. Export a
public props type only for a genuinely reusable exported component; otherwise
keep private view helpers private. Use explicit composition rather than a
family of `isEmpty`, `isCheckout`, or `showPayment` Boolean props.

### 4. Enable truthful checkout entry points

Update only the populated states in `components/cart/cart-content.tsx` and
`components/chrome/cart-drawer.tsx`:

- Replace the cart page's disabled `Checkout unavailable` button/copy with a
  real `/checkout` link labelled `Proceed to checkout`, composed with the
  certified button/link API and preserving its full-width action geometry.
- Replace the drawer's `Checkout available soon` pseudo-button with a real
  `/checkout` link labelled `Checkout`; close the sheet on navigation exactly
  as the existing `View cart` link does.
- Empty cart states continue to omit checkout actions entirely.
- Remove the now-dead disabled helper rather than retaining speculative code.

Add/update tests proving both links exist only with cart content and navigate to
the real route. Do not add checkout to global navigation or the account icon.

### 5. Token, documentation, and lifecycle updates

Re-measure the reference during execution. Add only stable, purpose-named
checkout geometry tokens to `app/globals.css` when existing spacing/container/
control tokens cannot express the measured layout. Record native evidence and
CSS decisions in `docs/design-system.md`; never scatter raw pixel/hex/radius/
shadow values through components. Use semantic token utilities and the
existing accessible foreground pairs.

Update `docs/components.md` with `CheckoutContent`, its form/error/status
contract, responsive behavior, server/client ownership, real usage, and the
certified form primitives it composes. If the previously uncertified
`Textarea` needs source changes or additional verification, certify only the
surface actually used and record its props/states; do not broadly certify
uninspected components.

Update `docs/pages.md` with the `/checkout` implementation record, native
measurements, responsive decisions, safe-boundary semantics, reference deltas,
actual check/browser results, commit SHAs, and separate Standards/Spec review
results. Correct the Cart section's stale statement that checkout is
unavailable after the route links are enabled. Do not claim Phase 5 complete
until implementation, verification, review fixes, and any required re-review
are actually finished.

No new documentation file or `AGENTS.md` index row is expected. Update
`CONTEXT.md` only if execution introduces a domain term that genuinely needs a
canonical definition; do not invent an Order, Payment, Billing Address, or
Checkout Session entity for this presentation-only flow.

## Responsive behavior

- **1440 × 1000:** retain the certified 1240px container and reproduce the
  reference's quiet two-column form/summary hierarchy, approximately 454px
  left, 527px right, and 145px between at the measured content width. Keep the
  right summary aligned near the billing heading rather than vertically
  centered or placed in a card.
- **1024 × 900:** preserve two columns only while both labels, inputs, summary
  amounts, and focus rings fit within the 32px container gutters. Reduce the
  inter-column gap with an existing spacing token; do not squeeze either
  column below readable form width.
- **768 × 1024:** use one normal-flow column in logical DOM order: billing
  details, order summary/payment explanation, then the review action. Do not
  use CSS visual reordering that conflicts with keyboard or screen-reader
  order.
- **390 × 844:** stack the paired name fields, use full-width controls and
  action, keep 20px gutters, and allow long product/validation text to wrap.
  No horizontal document overflow or clipped focus rings.
- **320 × 720:** retain 16px gutters and a single readable column. Product name,
  quantity, variant label, and line subtotal must remain distinguishable
  without two-dimensional scrolling.
- Verify 200% and practical 400% text zoom/reflow, browser autofill, long allowed
  values, reduced motion, and software keyboard-friendly input modes. There is
  no sticky summary or decorative motion in this unit.

## States and interactions

- **Default populated:** blank uncontrolled fields, visible persistent labels,
  fixed United States value, cart summary/subtotal, honest unavailable-payment
  explanation, and `Check details` action.
- **Hover / active / focus-visible:** use existing Button/Link/Input/Textarea
  behavior and visible semantic focus treatment; never depend on hover.
- **Invalid:** summary plus per-field errors, correct `aria-invalid` and
  descriptions, focus recovery, and preserved entered values.
- **Success:** one polite atomic non-transactional result; no cart clearing,
  redirect, confirmation number, or purchase claim.
- **Disabled:** the read-only country value is visibly non-editable without
  appearing like an actionable select. Payment methods are absent rather than
  represented by misleading disabled choices.
- **Empty:** certified Empty state and Shop recovery link; no form, subtotal,
  payment section, or submit action.
- **Loading / remote error:** not applicable because review is synchronous and
  local. Do not fabricate latency, skeleton lines, an error boundary, or a
  network failure state.

## Accessibility, privacy, and security requirements

- Meet WCAG 2.2 AA: semantic form/fieldset/legend/section structure, logical
  headings, persistent labels, visible focus, 44 × 44px targets, accessible
  errors/status, no color-only meaning, zoom/reflow, and meaningful DOM order.
- Keep autocomplete enabled and accurate. Do not block paste. Inputs remain
  uncontrolled so typing does not serialize personal data into shared context
  or trigger whole-form rerenders.
- Personal values exist only in the live form DOM and ephemeral submit-local
  variables. Never place them in cart context, module state, URL/search params,
  localStorage/sessionStorage, cookies, logs, analytics, snapshots committed to
  Git, or documentation.
- No `<form action>`, Server Action, route handler, API request, provider SDK,
  environment variable, card/bank field, account number, tokenization,
  persistence, email, or external side effect.
- Browser cart prices remain untrusted display state. Do not claim the subtotal
  is authoritative or that validation reserves inventory, prices products,
  creates an order, or processes payment.
- Browser verification uses synthetic non-sensitive values only. Never enter a
  real person's address, phone, email, or payment data.

## Non-goals and reference deltas

- No order creation/placement, cart clearing, order number, confirmation page,
  payment provider/method, card or bank details, cash-on-delivery promise,
  shipping, tax, discounts, inventory, delivery, address verification,
  geocoding, account/authentication, persistence, email, analytics, or CMS.
- No privacy-policy/terms link until an approved route and copy exist. The
  screenshot's policy sentence is omitted, not linked to `#`.
- No Sri Lanka/Western Province defaults, legacy brand/currency, mixed-locale
  address copy, unchanged reference prices, template product name, warranty,
  shipping threshold, support-hours claim, template address, or newsletter.
- The unknown-provenance photographic hero remains the certified tokenized
  `PageHero` wash. No generated or downloaded image is needed.
- The reference payment radios are replaced by an explicit unavailable state
  because no method/provider is approved. The reference `Place order` becomes
  `Check details` and can only return a non-transactional result.
- The reference Product/Subtotal/Total display becomes a truthful cart line
  summary plus subtotal only; no incomplete grand total is asserted.
- Tablet/mobile layouts, validation behavior, focus management, autocomplete,
  privacy boundaries, and reduced-motion handling are implementation decisions
  not proven by the desktop screenshot.

## Expected files

Expected additions:

- `app/checkout/page.tsx`
- `components/checkout/checkout-content.tsx`
- `lib/checkout.ts`
- `test/checkout.test.tsx` (and/or a focused `.test.ts` split only when it makes
  the pure validation lane clearer)

Expected scoped edits:

- `components/cart/cart-content.tsx`
- `components/chrome/cart-drawer.tsx`
- `test/cart.test.tsx`
- `app/globals.css` only for measured, reusable checkout geometry
- `docs/design-system.md`
- `docs/components.md`
- `docs/pages.md`
- this approved `prompts/16-build-checkout-presentation.md`

Do not create route loading/error files, actions, APIs, providers, environment
files, new generic primitives, dependencies, migrations, generated images, or
architecture/ADR files. Treat this list as expected rather than permission to
touch a file whose change is unnecessary.

## Acceptance criteria

- `/checkout` exists with accurate metadata, one main landmark, Checkout hero
  and breadcrumbs, responsive checkout content, shared benefits, and root
  footer.
- Direct empty access shows a useful empty state and Shop link with no broken
  checkout UI. A client navigation after adding a configured catalog product
  preserves cart state and shows the populated form/summary.
- Populated cart page and drawer expose real `/checkout` links; empty states do
  not.
- Every summary line comes from the canonical catalog/cart model and uses
  integer USD cents through `Money`. Only a display subtotal is shown.
- The US fields, labels, autocomplete attributes, limits, validation messages,
  error summary, field errors, and success announcement meet the contract at
  all target widths.
- Invalid submission never navigates, sends a request, loses entered values, or
  hides the path to each invalid field. Valid submission reports exactly that
  details were checked and no order/payment occurred, without clearing cart or
  inventing confirmation state.
- No real payment choice, provider, card/bank detail, personal-data storage,
  network mutation, server action, order/policy claim, legacy brand/currency,
  unsupported service claim, broken internal link, or horizontal page overflow
  is shipped.
- Native reference measurements and chosen CSS interpretations are documented;
  desktop is visually faithful within the deliberate safety/content deltas and
  tablet/mobile are intentionally responsive.
- Focused and full tests, lint, TypeScript, production build, browser flows,
  accessibility audit, responsive screenshots, Web Interface Guidelines
  review, staged diff inspection, local commits, mandatory two-axis review,
  accepted fixes, and any required re-review are complete and truthfully
  recorded. Nothing is pushed.

## Verification and execution sequence

1. Re-read every source, framework document, and skill named here. Reconfirm
   `main`, current status, and recent history. Record the pre-existing untracked
   prompt 15 and preserve it untouched.
2. Capture immutable `BASE_SHA=$(git rev-parse HEAD)` before any implementation
   edit. Use the same base through all reviews.
3. Reproduce native checkout measurements into a fresh `/tmp` directory and
   record both raster evidence and CSS interpretation.
4. Run the current shadcn info/docs commands and inspect installed Base UI
   types/source. Do not install or overwrite dependencies/components.
5. Add pure checkout validation and its focused tests first. Then add the route
   and focused client block, enable cart/drawer links, and update affected tests
   in dependency order.
6. Run focused tests, expected at minimum:
   `npx vitest run test/checkout.test.tsx test/cart.test.tsx test/field.test.tsx`.
   Include any separate pure checkout test path actually created.
7. Run `npm run test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
   If the known restricted-environment Turbopack worker-port error recurs,
   record the exact failure and run `npm run build -- --webpack`; do not call
   the fallback a passing Turbopack build.
8. Start `npm run dev`. Load the version-matched agent-browser core guide, set
   one worktree-scoped `compfi-checkout` named session, and keep it for the
   entire task. Use synthetic values only.
9. In the browser, begin on a product detail page, add a configured product,
   open the populated drawer, follow `Checkout`, and verify the URL/state.
   Return through Cart and verify `Proceed to checkout`. Confirm direct empty
   `/checkout` behavior in a fresh/reloaded tab-local state.
10. Exercise an empty submission, inspect summary and per-field errors/focus,
    correct fields, submit valid synthetic values, and verify the exact
    non-transactional announcement, retained cart, retained inputs, and absence
    of URL/network mutation. Edit a field after success and verify stale success
    clears. Open the cart drawer from checkout and verify modal Escape/focus
    return remains intact.
11. Capture stable screenshots after fonts settle at 1440×1000, 1024×900,
    768×1024, 390×844, and 320×720. Compare the 1440 geometry/type/color/rhythm
    to fresh reference crops. At every width inspect
    `scrollWidth === clientWidth`, wrapping, field/action sizes, focus rings,
    and validation layout. Repeat practical zoom/reflow and reduced-motion
    checks.
12. Run `agent-browser a11y`, inspect console/runtime errors, and fetch/apply
    the fresh Web Interface Guidelines to every changed UI file. Resolve all
    valid findings. Close the named browser session.
13. Update owning docs with real evidence/results. Inspect every changed file,
    `git diff`, and status. Confirm prompt 15 remains untouched.
14. Load `caveman-commit`, stage only prompt 16 and the approved implementation,
    inspect the staged diff, and create the local implementation commit on
    `main`. Do not stage prompt 15 or any unrelated path. Do not push.
15. Confirm `BASE_SHA` resolves, `git diff BASE_SHA...HEAD` is non-empty, and
    record `git log BASE_SHA..HEAD --oneline`. Invoke `code-review` against that
    immutable range with this prompt as Spec and `AGENTS.md` plus owning docs as
    Standards. The skill must run isolated Standards and Spec subagents in
    parallel, include the full smell baseline, and report the axes separately.
16. Verify every finding against the diff, prompt, installed APIs, and project
    rules. Fix accepted findings, rerun affected focused/full checks and browser
    flows, update docs, load `caveman-commit`, and create a separate local fix
    commit. Re-run the complete two-axis review from the original `BASE_SHA` if
    fixes materially affect public APIs, shared components, data flow,
    security/privacy, or complex form behavior.
17. Finish only when no verified blocking finding remains. Report exact files,
    routes, checks, browser/visual evidence, separate Standards and Spec counts
    and worst finding, commit SHAs, preserved unrelated status, and any real
    remaining decision. Do not push.

## SKILLS USED

- `frontend-design` — preserve the measured premium furniture composition,
  typography, form rhythm, truthful copy, restraint, and reference deltas.
- `building-components` — own form/block taxonomy, native prop/API discipline,
  semantic state, accessibility, and component documentation.
- `vercel-composition-patterns` — keep checkout composition explicit, avoid
  Boolean-prop proliferation, and prevent a redundant state provider.
- `vercel-react-best-practices` — keep the server route/client leaf boundary
  narrow, serialization minimal, state derived, events local, and rendering
  stable.
- `react-testing` — write behavior-first Vitest/RTL/user-event tests with
  accessible queries, real providers, pure validation coverage, and axe checks.
- `shadcn` — inspect the installed Base Nova/Base UI project and correctly
  compose certified Field/Input/Textarea/Button/Empty/Separator components.
- `web-design-guidelines` — perform the fresh final UI/UX/accessibility review
  against every changed interface file.
- `agent-browser` — use one worktree-scoped named session for real checkout
  flows, validation/focus, modal regression, responsive screenshots, reflow,
  console, and accessibility verification.
- `code-review` — run the mandatory parallel Standards and Spec review against
  the immutable base, keep reports separate, and drive evidence-based fixes.
- `caveman-commit` — generate the implementation and any review-fix Conventional
  Commit messages; never push.
