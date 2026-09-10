# Build Compfi contact page and safe message-review boundary

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-10. This is a planning
artifact only. It authorizes no implementation until the user explicitly
approves it through the single-letter `y` workflow.

Planning-time repository state is `main` at `08a9af5`, with a clean worktree
(`git status --short` empty at prompt-preparation time). Reconfirm
`git status --short`, `git branch --show-current`, recent history, and `HEAD`
before execution. Stop if the branch is not `main`. Preserve every unrelated
path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Build the first dependency-safe unit of Phase 6 (Content surfaces) by adding a
real `/contact` route that presents concise Compfi business guidance and a
contact form with a safe client-only `Send message` review boundary. A valid
review reports that the message details were checked but that nothing was sent,
stored, or emailed, because no CMS, email, persistence, or abuse-control
provider is approved.

Phases 1–5 are implemented and review-closed (design system, primitives,
shared chrome, home/shop/product-detail/comparison browsing, transient cart
plus `/cart` and `/checkout` presentation). Phase 6 depends only on phases 2–3,
so contact is dependency-safe. Contact (`design/8-Contact.png`, reference 8)
precedes blog (`design/9-Blog.png`, reference 9) in the ordered references and
is the smaller, form-only unit; blog search/category/feed work is deferred to
the next prompt. This split keeps the change reviewable without creating a
phase dependency.

The required lightweight architecture-signal check found no
threshold-crossing candidate. Contact should be one focused client form leaf
over the existing certified Field/Input/Textarea/Button primitives plus a
small pure validation module; there is no repeated adapter, provider seam, or
scattered contact rule that warrants an architecture audit. Do not run an
architecture audit during this approved single-letter workflow.

## Evidence to re-read before implementation

- `AGENTS.md`, especially sections 1.1–1.2, 2, 3.2–3.4, 4–10, and 12–13;
  `CONTEXT.md`; `docs/catalog.md` (not in scope except to avoid inventing
  catalog claims); `docs/design-system.md`; `docs/components.md`;
  `docs/pages.md`; `docs/automation.md`; and `docs/agent-browser.md`.
- The approved implementation source and tests: `app/layout.tsx`,
  `app/checkout/page.tsx`, `components/checkout/checkout-content.tsx`,
  `lib/checkout.ts`, `components/chrome/page-hero.tsx`,
  `components/chrome/benefits-strip.tsx`, `components/chrome/site-header.tsx`,
  `components/chrome/site-footer.tsx`, `components/ui/button.tsx`,
  `components/ui/field.tsx`, `components/ui/input.tsx`,
  `components/ui/textarea.tsx`, `components/ui/empty.tsx`,
  `components/ui/separator.tsx`, `test/checkout.test.tsx`, and the shared
  test/axe setup. Confirm actual exports and contracts before changing code.
  Reuse the checkout safe-boundary pattern (pure validator, uncontrolled
  native form, error summary with focus recovery, polite non-transactional
  status) rather than inventing a second form system.
- Open `design/8-Contact.png` at its native 2880 × 4730 resolution. Use
  `docs/automation.md` to create fresh task-specific crops under `/tmp`, keep
  measurement separate from implementation decisions, and retain the
  established 2 raster px : 1 CSS px working interpretation. Use
  `design/9-Blog.png` only to confirm blog remains out of scope; do not design
  blog work in this unit.

Planning-time native evidence to reproduce and correct if fresh crops disprove
it:

| evidence | native raster observation | CSS interpretation / decision |
| --- | --- | --- |
| page size and shell | 2880 × 4730; repeated 200px header | retain the certified 100px header; use the approved tokenized `PageHero` wash instead of unknown-provenance photography |
| benefit band | `2880×550+0+3100` holds `#FAF3EA` 1,462,171 px, ink `#242424` 35,404 px, muted `#898989` 11,492 px (reproduced 2026-09-10; matches `docs/design-system.md`) | retain the certified 275px `BenefitsStrip` with 24px titles and 16px copy; do not restyle it for contact |
| contact body | business-details column plus form column on a broad white field between the hero and the benefit band (exact field/column geometry to be re-measured during execution) | quiet two-column desktop composition inside the established 1240px container; stack to one column at tablet/mobile pressure points |
| form controls | repeated light outlines with compact labels (exact control height/radius to be re-measured) | use the existing 10px control radius and accessible border/focus tokens; minimum 44px targets; do not scatter raw values |
| lower chrome | benefit band then footer follows the contact body | reuse `BenefitsStrip` and the root `SiteFooter`; do not restore unsupported warranty, shipping, support-hours, address, policy, or newsletter claims |

The reference establishes a quiet business-details-plus-form hierarchy with
generous vertical rhythm. Preserve that hierarchy with existing Poppins roles,
semantic colors, flat surfaces, and square/10px geometry. Do not turn it into
a dashboard card stack, add shadows, or invent decorative motion.

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
Action, route handler, or API request merely to imitate sending. Use a native
form with a client `onSubmit` handler that always calls `preventDefault()` and
performs only the local review described below.

Run `npx shadcn@latest info --json`, inspect `components.json`, and run
`npx shadcn@latest docs field input textarea button empty separator` before
using or adapting those components. Fetch and read the returned current docs.
Inspect the installed Base UI source/types whenever local component source does
not settle behavior. Reuse the certified Field/Input/Textarea/Button/Empty/
Separator compositions; do not add a second form system or overwrite a
generated component wholesale.

Before browser work, re-read `docs/agent-browser.md` and run
`agent-browser skills get core --full`. Set exactly one worktree-scoped named
session for the entire task, using a `compfi-contact` prefix, before the first
browser command. Never use the shared unnamed session. Close the named session
at handoff.

## Scope and component ownership

### 1. Pure contact review validation

Create a small pure module, expected at `lib/contact.ts`, that owns only the
client-preview validation contract. Keep it independent of React, JSX, the
cart provider, network calls, browser storage, and mutable module state.

Define a closed field-name/data shape for:

- required: name, email, message;
- optional: subject or topic (single short text field only if the measured
  reference supports it; otherwise omit rather than inventing a subject
  taxonomy);
- no address, phone, order-number, account, or file-upload fields.

Validation must trim whitespace, reject blank required values, validate a
practical email shape in addition to `type="email"`, and apply explicit UI
safety limits rather than accepting unbounded strings: name up to 80
characters, email up to 254, subject (if shipped) up to 120, message up to
2000. Return a frozen or otherwise immutable error record keyed by field name;
never return, persist, log, or expose the submitted personal values beyond the
ephemeral submit handler. Use concise field-specific US English messages. Add
focused unit tests for valid input, trimmed blanks, invalid email, and upper
bounds.

This module is not a message DTO, ticket schema, email request, CMS adapter,
or future provider interface. Name it around reviewing contact details, not
sending a message.

### 2. `/contact` route and client contact block

Add `app/contact/page.tsx` as a Server Component route shell with route
metadata (`Contact | Compfi` through the existing template) and one
`main#main-content`. Compose the existing `PageHero` titled `Contact` with
Home / Contact breadcrumbs, a focused client contact block, and the unchanged
`BenefitsStrip`. The root layout already owns the footer; do not duplicate it.

Expected component placement is `components/contact/contact-content.tsx`
(composing a focused `ContactForm` leaf in the same directory only if the
file stays readable; otherwise keep one block file). Keep the route shell
server-safe and make only the form interaction leaf a Client Component. Do not
create a contact provider or widen any existing provider.

The business-details portion is server-rendered static content:

- concise Compfi inquiry guidance (what this form is for and what happens
  next, stated honestly as a local preview with no sending claim);
- general response-expectation copy only if it avoids inventing hours,
  SLAs, or support policies; when in doubt, omit the claim;
- no street address, phone number, map, hours table, social links, or
  support-channel list copied from the template. Template contact facts are
  omitted, not relabeled as Compfi facts.

With the form visible, render one native `<form noValidate>` containing:

- `FieldSet`/`FieldLegend` and `FieldGroup` for the message form;
- the fields above, using certified `Field`, `FieldLabel`, `Input`, and
  `Textarea` components, persistent visible labels, correct `name`, `type`,
  `required`, `maxLength`, `inputMode`, and autocomplete tokens (`name`,
  `email`);
- one error summary when submission has errors, plus field-level `FieldError`
  messages. Put `data-invalid` on `Field`, `aria-invalid` on its control, and
  merge description/error IDs in `aria-describedby` without duplicate IDs;
- a submit `Button` labelled `Send message` only if the surrounding copy and
  success announcement make the non-transactional preview unambiguous (as the
  checkout `Check details` pattern does); otherwise use `Check message`.
  Decide once during implementation, document the choice as a reference delta,
  and do not ship `Submit`, `Place order`, or anything implying delivery.

The submit handler must prevent all navigation/network submission, extract
values ephemerally from the form, invoke the pure validator, and retain only
error/status state. If invalid, display and programmatically focus a concise
error summary with links or otherwise direct access to each invalid field, and
keep each field's error association correct. Clear a field's stale error when
that field changes, and clear a previous success status after any edit. If
valid, leave the entered values untouched and announce in a polite, atomic
status: `Message checked. It was not sent and no email was delivered.` (adjust
only the verb if the button label decision requires it, and record the exact
string in docs). Do not show a ticket number, confirmation, redirect, timeout,
toast, or artificial pending state.

Do not add `loading.tsx` or `error.tsx` merely for completeness. This route
has no async data source, Suspense boundary, or server mutation; loading and
remote error states are not applicable. Unexpected rendering errors remain
owned by the existing application boundary until a real route-specific
recovery case exists.

### 3. Token, documentation, and lifecycle updates

Re-measure the reference during execution. Add only stable, purpose-named
contact geometry tokens to `app/globals.css` when existing
spacing/container/control tokens cannot express the measured layout. Record
native evidence and CSS decisions in `docs/design-system.md`; never scatter
raw pixel/hex/radius/shadow values through components. Use semantic token
utilities and the existing accessible foreground pairs.

Update `docs/components.md` with the new contact block(s), form/error/status
contract, responsive behavior, server/client ownership, real usage, and the
certified form primitives composed. If any previously uncertified primitive
needs source changes, certify only the surface actually used and record its
props/states; do not broadly certify uninspected components.

Update `docs/pages.md` with the `/contact` implementation record, native
measurements, responsive decisions, safe-boundary semantics, reference deltas,
actual check/browser results, commit SHAs, and separate Standards/Spec review
results. Do not claim Phase 6 complete; blog remains explicitly pending.

No new documentation file or `AGENTS.md` index row is expected. Update
`CONTEXT.md` only if execution introduces a domain term that genuinely needs a
canonical definition; do not invent a Ticket, Conversation, Customer, or
Support Session entity for this presentation-only flow.

## Responsive behavior

- **1440 × 1000:** retain the certified 1240px container and reproduce the
  reference's quiet two-column details/form hierarchy. Keep the form column
  aligned near the details heading rather than vertically centered or placed
  in a card.
- **1024 × 900:** preserve two columns only while labels, inputs, textarea,
  and focus rings fit within the 32px container gutters. Reduce the
  inter-column gap with an existing spacing token; do not squeeze either
  column below readable form width.
- **768 × 1024:** use one normal-flow column in logical DOM order: business
  details, then the message form. Do not use CSS visual reordering that
  conflicts with keyboard or screen-reader order.
- **390 × 844:** stack all fields full-width, keep 20px gutters, and allow
  long validation text to wrap. No horizontal document overflow or clipped
  focus rings.
- **320 × 720:** retain 16px gutters and a single readable column. Labels,
  controls, and error text must remain distinguishable without
  two-dimensional scrolling.
- Verify 200% and practical 400% text zoom/reflow, browser autofill, long
  allowed values, reduced motion, and software keyboard-friendly input modes.
  There is no sticky panel or decorative motion in this unit.

## States and interactions

- **Default:** blank uncontrolled fields, visible persistent labels, honest
  preview explanation, and the single review action.
- **Hover / active / focus-visible:** use existing Button/Input/Textarea
  behavior and visible semantic focus treatment; never depend on hover.
- **Invalid:** summary plus per-field errors, correct `aria-invalid` and
  descriptions, focus recovery, and preserved entered values.
- **Success:** one polite atomic non-transactional result; no clearing,
  redirect, ticket number, or delivery claim.
- **Disabled:** no disabled payment/shipping-style choices; controls are
  disabled only for a documented, non-misleading reason.
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
  variables. Never place them in context, module state, URL/search params,
  localStorage/sessionStorage, cookies, logs, analytics, snapshots committed
  to Git, or documentation.
- No `<form action>`, Server Action, route handler, API request, provider SDK,
  environment variable, file upload, persistence, email, or external side
  effect.
- Do not claim the preview sends, queues, delivers, or tracks a message, or
  that validation creates a support case.
- Browser verification uses synthetic non-sensitive values only. Never enter a
  real person's name, email, or message content.

## Non-goals and reference deltas

- No message delivery, ticket creation, confirmation page, email provider,
  CMS, persistence, analytics, spam/abuse backend, file attachments, or
  newsletter signup.
- No privacy-policy/terms link until an approved route and copy exist. Any
  screenshot policy sentence is omitted, not linked to `#`.
- No legacy brand, template address/phone/hours/map, mixed-locale copy,
  unchanged reference prices, warranty, shipping threshold, or support-hours
  claim. Unknown-provenance photography remains the certified tokenized
  `PageHero` wash; no generated or downloaded image is needed.
- The reference send action becomes an explicit non-transactional review with
  an honest explanation, not a delivery promise.
- Tablet/mobile layouts, validation behavior, focus management, autocomplete,
  privacy boundaries, and reduced-motion handling are implementation decisions
  not proven by the desktop screenshot.
- Blog (`/blog`, search, categories, recent posts, pagination, article media)
  is explicitly out of scope for this prompt.

## Expected files

Expected additions:

- `app/contact/page.tsx`
- `components/contact/contact-content.tsx` (plus a colocated form leaf only
  if readability requires it)
- `lib/contact.ts`
- `test/contact.test.tsx` (and/or a focused `.test.ts` split only when it
  makes the pure validation lane clearer)

Expected scoped edits:

- `app/globals.css` only for measured, reusable contact geometry
- `docs/design-system.md`
- `docs/components.md`
- `docs/pages.md`
- this approved `prompts/17-build-contact-page.md`

Do not create route loading/error files, actions, APIs, providers,
environment files, new generic primitives, dependencies, migrations,
generated images, or architecture/ADR files. Treat this list as expected
rather than permission to touch a file whose change is unnecessary.

## Acceptance criteria

- `/contact` exists with accurate metadata, one main landmark, Contact hero
  and breadcrumbs, responsive details/form content, shared benefits, and root
  footer.
- Direct load shows the details guidance and blank form with no broken UI.
- The details block contains concise Compfi copy with no invented address,
  phone, hours, policy, warranty, shipping, or support claim and no legacy
  brand/template content.
- Every field, label, autocomplete attribute, limit, validation message,
  error summary, field error, and success announcement meets the contract at
  all target widths.
- Invalid submission never navigates, sends a request, loses entered values,
  or hides the path to each invalid field. Valid submission reports exactly
  the documented non-transactional result without clearing inputs or
  inventing delivery state.
- No delivery choice, provider, persistence, network mutation, server action,
  policy claim, legacy brand, unsupported service claim, broken internal
  link, or horizontal page overflow is shipped.
- Native reference measurements and chosen CSS interpretations are
  documented; desktop is visually faithful within the deliberate
  safety/content deltas and tablet/mobile are intentionally responsive.
- Focused and full tests, lint, TypeScript, production build, browser flows,
  accessibility audit, responsive screenshots, Web Interface Guidelines
  review, staged diff inspection, local commits, mandatory two-axis review,
  accepted fixes, and any required re-review are complete and truthfully
  recorded. Nothing is pushed.

## Verification and execution sequence

1. Re-read every source, framework document, and skill named here. Reconfirm
   `main`, current status, and recent history.
2. Capture immutable `BASE_SHA=$(git rev-parse HEAD)` before any implementation
   edit. Use the same base through all reviews.
3. Reproduce native contact measurements into a fresh `/tmp` directory and
   record both raster evidence and CSS interpretation.
4. Run the current shadcn info/docs commands and inspect installed Base UI
   types/source. Do not install or overwrite dependencies/components.
5. Add pure contact validation and its focused tests first. Then add the route
   and focused client block in dependency order.
6. Run focused tests, expected at minimum:
   `npx vitest run test/contact.test.tsx`. Include any separate pure contact
   test path actually created.
7. Run `npm run test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
   If the known restricted-environment Turbopack worker-port error recurs,
   record the exact failure and run `npm run build -- --webpack`; do not call
   the fallback a passing Turbopack build.
8. Start `npm run dev`. Load the version-matched agent-browser core guide, set
   one worktree-scoped `compfi-contact` named session, and keep it for the
   entire task. Use synthetic values only.
9. In the browser, open `/contact` directly and verify hero, details, blank
   form, benefits, and footer state.
10. Exercise an empty submission, inspect summary and per-field errors/focus,
    correct fields, submit valid synthetic values, and verify the exact
    non-transactional announcement, retained inputs, and absence of URL/network
    mutation. Edit a field after success and verify stale success clears.
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
    `git diff`, and status.
14. Load `caveman-commit`, stage only this prompt and the approved
    implementation, inspect the staged diff, and create the local
    implementation commit on `main`. Do not stage unrelated paths. Do not push.
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
- `vercel-composition-patterns` — keep contact composition explicit, avoid
  Boolean-prop proliferation, and prevent a redundant state provider.
- `vercel-react-best-practices` — keep the server route/client leaf boundary
  narrow, serialization minimal, state derived, events local, and rendering
  stable.
- `react-testing` — write behavior-first Vitest/RTL/user-event tests with
  accessible queries, pure validation coverage, and axe checks.
- `shadcn` — inspect the installed Base Nova/Base UI project and correctly
  compose certified Field/Input/Textarea/Button/Empty/Separator components.
- `web-design-guidelines` — perform the fresh final UI/UX/accessibility review
  against every changed interface file.
- `agent-browser` — use one worktree-scoped named session for real contact
  flows, validation/focus, responsive screenshots, reflow, console, and
  accessibility verification.
- `code-review` — run the mandatory parallel Standards and Spec review against
  the immutable base, keep reports separate, and drive evidence-based fixes.
- `caveman-commit` — generate the implementation and any review-fix Conventional
  Commit messages; never push.
