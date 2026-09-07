# Build Compfi primitives and components

Status: awaiting approval; prompt prepared from repository evidence on
2026-09-07. No Phase 2 implementation has begun.

## Goal and dependency

Execute Phase 2 of `AGENTS.md`: establish the small, reusable, accessible
component layer needed by shared chrome and the later commerce/content phases.
Deliver documented, tested APIs and responsive specimen examples for:

- actions and display: Button, IconButton, Link, Badge, Separator;
- forms: Field composition, Label, Input, Textarea, Select, descriptions and
  validation messages;
- layout: Section, Stack and Cluster, alongside the Phase 1 Container;
- product-facing foundations: Money, QuantityInput, ColorSwatch and
  SizeSelector.

Phase 1 is committed, documented, verified and independently reviewed. Phase 2
is therefore the earliest dependency-safe unit and must complete before Phase 3
shared chrome. Do not pull ProductCard, navigation, cart-drawer composition, page
sections, catalog state, checkout submission, or backend behavior into this
work.

## Starting repository evidence

- Planning began at `fac6c4e48bb6baa3e238c63436752b589fe320ad` on `main` with
  a clean worktree. Recheck branch and status at execution. The subsequently
  authorized planning changes are `AGENTS.md`, `skills-lock.json`, the installed
  `.agents/skills/react-testing/SKILL.md`, and this prompt; keep them in this
  approved task and preserve any other dirty path.
- Phase 1 ownership exists in `docs/design-system.md` and
  `docs/automation.md`. `/design-system` is a static, noindex foundation
  specimen; `/` is only a minimal foundation landing page.
- `components.json` now exists and reports shadcn `base-nova`, Base UI,
  Tailwind 4, RSC enabled, TypeScript, the `@` alias and Lucide. Current
  `npx shadcn info --json` reports Next 16.3.4 and a broad set of generated
  components under `components/ui/`.
- Commits `df45a33..fac6c4e` added shadcn dependencies, theme output, and many
  generated UI files after Phase 1 sign-off. That source is repository fact,
  but it is not evidence that Compfi Phase 2 APIs, states, tests, docs, examples,
  or review are complete.
- Relevant generated files already exist: `button.tsx`, `badge.tsx`,
  `separator.tsx`, `field.tsx`, `label.tsx`, `input.tsx`, `textarea.tsx`,
  `select.tsx`, `native-select.tsx`, `toggle.tsx`, `toggle-group.tsx` and
  `spinner.tsx`. Reuse and adapt this source rather than creating duplicates.
- Existing core shadcn components generally do not export the required
  `<Name>Props` aliases. Their default controls use 32–36 px size utilities and
  neutral/dark-theme classes; Compfi requires a 44 px target floor, its measured
  semantic colors, square primary actions, visible focus, and no dark mode.
- `app/globals.css` currently contains both the reviewed Compfi token layer and
  later generated neutral OKLCH variables, `.dark` tokens, chart/sidebar roles,
  a dark custom variant, and legacy `.button-primary`/`.button-outline`
  selectors. `app/layout.tsx` later gained Geist and applies it to `<html>` even
  though Phase 1 selected and licensed Poppins. This is post-review drift that
  must be reconciled as part of making the components truthful consumers of the
  Phase 1 system.
- `app/page.tsx` and the current specimen still use legacy button classes. Move
  both to the real component APIs, then remove those selectors only after no
  consumer remains.
- There is no test script, test config, or first-party test file. Current
  transitive packages are not permission to import undeclared test dependencies.
- No commerce rules, persisted state, provider seam, or repeated domain-module
  churn exists. The lightweight architecture-signal check does not cross the
  Section 3.5 audit threshold; during this `I` workflow it is noted and deferred.
- The generated components outside this approved inventory—including chat,
  charts, sidebar, calendar, overlays and navigation—are committed pre-existing
  files. Do not delete, restyle, document as certified, or otherwise clean them
  up incidentally. They remain unaudited until an owning phase needs them.

## Sources and visual evidence

Re-read `AGENTS.md`, `docs/design-system.md`, `docs/automation.md`, this prompt,
all files named below, and every skill in `## SKILLS USED` immediately before
execution.

All nine 2880 px-wide references were opened during planning. Their native
dimensions remain:

| reference | native raster size | Phase 2 evidence |
| --- | --- | --- |
| `design/1-Home.png` | 2880 × 9670 | square gold campaign action, outline “Show more,” discount/new badges, product-card action treatment |
| `design/2-Shop.png` | 2880 × 6948 | filter/view icon actions, “Show” field, sort select, badges, hover action and pagination controls |
| `design/3-Single Product.png` | 2880 × 6214 | breadcrumb links, price, size choices, color swatches, quantity stepper, cart/comparison actions, separators |
| `design/4-Cart Sidebar.png` | 2880 × 6214 | compact money, removal icon action and outlined cart/checkout/comparison actions |
| `design/5-Product Comparison.png` | 2880 × 7996 | link treatment, product select, money, ratings, separators and add-to-cart actions |
| `design/6-Cart.png` | 2880 × 3592 | tabular money, quantity, removal action, totals and checkout action |
| `design/7-Checkout.png` | 2880 × 6140 | persistent labels, text/select fields, radio-like payment choices, validation-ready grouping and Place order action |
| `design/8-Contact.png` | 2880 × 4730 | persistent labels, text/email/subject inputs, textarea and submit action |
| `design/9-Blog.png` | 2880 × 7962 | search field, links, separators and pagination |

Planning crops were inspected without modifying the source PNGs:

- Home action: `1400x1100+1400+400`.
- Shop toolbar/cards: `2480x1500+200+700`.
- Product controls: `2480x2200+200+300`.
- Comparison picker: `2480x1400+200+650`.
- Checkout fields: `2480x3600+200+700`.
- Contact fields: `2480x2600+200+700`.

Use the Phase 1 validated working interpretation of 2 raster px per CSS px and
its measured values: 1240 px desktop container, 32 px Shop grid gap, 44 px
minimum target, 1 px structural/control border, square action radius, 10 px
field/image radius, 3 px focus ring with 3 px offset, 140 ms color feedback and
220 ms short spatial feedback. Keep measured reference values distinct from
production accessibility decisions. In particular, white text is prohibited on
reference gold/coral/teal; use the documented action gold for white action text,
dark text on teal, and the documented stronger discount surface.

Static screenshots do not prove hover timing, focus order, keyboard maps,
controlled state, validation announcements, loading behavior or mobile layout.
Implement those from the installed primitives and documented standards, and
record them as reference deltas.

## Installed APIs and documentation to verify

Read these installed Next 16 guides; do not rely on older framework memory:

- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
- `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`
- `node_modules/next/dist/docs/03-architecture/accessibility.md`

The installed testing guide supports Vitest plus React Testing Library for
synchronous Server and Client Components and says async Server Components need
browser/E2E coverage. This phase has no async Server Component. Use a JSDOM
component-test lane for semantics/state and real-browser verification for CSS,
layout, native rendering, focus geometry and responsive behavior.

Before editing shadcn source:

1. Run `npx shadcn info --json` and preserve Base UI rather than copying Radix
   APIs. The planning result was base `base`, style `base-nova`, Tailwind v4,
   Lucide, RSC true.
2. Run `npx shadcn docs` for button, badge, separator, field, input, textarea,
   select, native-select and toggle-group. Inspect the returned current docs,
   examples and Base UI API links. Do not run `add --overwrite` across locally
   adapted files.
3. Inspect the installed `@base-ui/react` and `@types/react` declarations for
   exact `render`, ref, controlled/uncontrolled, Select and ToggleGroup props.
   Base ToggleGroup single selection uses array values; hide that library quirk
   behind Compfi’s string-valued selectors.
4. Preserve the existing Button variant/size names used by generated consumers
   (`ghost`, `outline`, icon sizes and similar) so the repository keeps typing
   and building. Retheme and document the supported Compfi meanings rather than
   breaking unrelated committed files.
5. Use Lucide component imports and shadcn’s `data-icon` convention; never use
   string-to-icon maps or redundant icon sizing inside Button.

Planning queried current registry versions on 2026-09-07: Vitest 5.0.0,
`@vitejs/plugin-react` 6.1.1, JSDOM 30.0.1, React Testing Library 16.3.3,
Testing Library DOM 10.4.1, user-event 14.6.7, jest-dom 7.0.1 and
`vite-tsconfig-paths` 6.1.1. Recheck versions, peer requirements, Node 26.8.1
compatibility and installed source at execution; pin the compatible resolved
versions in `package-lock.json`. Add `axe-core` as an explicit dev dependency if
it is used rather than relying on its current transitive presence.

## Public component contracts

Every Phase 2 component must export `<Name>Props`, forward valid DOM/Base UI
props and refs using verified React 19 conventions, put variant definitions
outside render functions, merge base/variant classes before caller `className`,
and expose stable kebab-case `data-slot` plus relevant `data-state`,
`data-disabled`, `data-loading` or `data-invalid` state. Components own their
visual styling; consumer `className` is for layout placement, not page-specific
recoloring or typography overrides.

### Actions and display

- `Button`: adapt the existing Base UI component. Default is Compfi’s filled
  action; retain outline, secondary, ghost, destructive and link compatibility.
  All size variants retain at least a 44 × 44 target even when icon/text ink is
  compact. Preserve native button behavior, default `type` semantics from the
  primitive, `render` composition, disabled state and focus-visible treatment.
  Do not add `isLoading`/`loading`; loading composes `Spinner`, disabled and
  stable pending copy such as “Adding…”.
- `IconButton`: a narrow Button composition for one decorative Lucide icon.
  Require an explicit accessible `label` prop, set the accessible name without
  duplicating visible text, hide decorative icon semantics, and support the
  Button’s visual variants plus icon sizes. Do not duplicate Button styling.
- `Link`: a styled internal-navigation component backed by installed
  `next/link`, with exported props based on the actual Next Link component,
  `data-slot="link"`, visible focus and explicit textual variants. It must
  preserve `href`, `prefetch`, `replace`, `scroll`, ref and anchor attributes.
  Keep external/download links as native anchors and document that boundary.
  Button-shaped navigation uses Base Button’s verified `render` API with
  `nativeButton={false}`, not nested interactive elements.
- `Badge`: adapt the current component and preserve its Base `render`
  composition. Support neutral/default, outline, discount and new-product
  meanings with accessible foreground pairs. A badge is descriptive by default,
  receives no fabricated button/status role, and never communicates its meaning
  through color alone (visible “New”/discount text remains present).
- `Separator`: retain the established Base UI primitive and horizontal/vertical
  orientation. Decorative separators must stay ignored by assistive technology;
  semantic separators preserve their role when requested. Use it instead of
  page-level border-only divider markup.

### Forms

- Keep and adapt the existing `FieldSet`, `FieldLegend`, `FieldGroup`, `Field`,
  `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`,
  `FieldSeparator` and `FieldError` composition. Export props for every public
  part. `FieldError` deduplicates messages, uses an alert only for actionable
  validation, and renders nothing for empty input.
- `Label`, `Input` and `Textarea` extend their native element props. Controls
  are 44 px minimum, use the 10 px control radius and accessible boundary,
  retain persistent labels in examples, forward autocomplete/inputMode/name/
  required/disabled/readOnly/aria attributes, and visibly distinguish invalid
  state without color alone. Textarea remains user-resizable in at least the
  vertical direction and cannot be clipped by content sizing.
- Retain the established compound Base `Select` API and its parts. Select items
  remain inside SelectGroup; the root receives Base’s verified `items` data;
  placeholder uses the Base null-item convention; trigger is 44 px minimum;
  portal, positioning, selection, disabled state, focus and keyboard behavior
  come from Base UI. Export props for the root-facing/public parts without
  inventing a second monolithic Select wrapper.
- Forms use `FieldGroup` + `Field`. Invalid examples set both `data-invalid` on
  Field and `aria-invalid`/`aria-describedby` on the control. Disabled examples
  set both `data-disabled` and native `disabled`. Each message id is stable and
  the field remains understandable before validation runs.
- `NativeSelect` may remain available as the generated no-JS alternative, but
  it is not a second styled contract to expand in this task. Ensure Phase 2
  token changes do not regress it.

### Layout

- `Section`: native section props plus one explicit spacing variant
  (`compact`, `default`, `spacious`) using the Phase 1 responsive scale. It does
  not imply Container, heading, surface color or full-bleed behavior.
- `Stack`: native div props, vertical flex layout, and a small semantic gap
  variant set derived from Phase 1 spacing. Default to a useful content gap;
  expose stable `data-gap` and do not add alignment booleans.
- `Cluster`: native div props, wrapping horizontal flex layout, the same bounded
  semantic gap vocabulary, and an explicit alignment variant only if specimen
  evidence needs it. It must wrap without overflow at 320 px.
- Keep `Container` as Phase 1 ownership. If its class merge is changed to the
  established `cn` utility for consistency, preserve its exact public API,
  measured geometry and `data-slot`.

### Product-facing foundations

- `Money` accepts integer `amountCents`, renders USD/en-US through one shared
  `Intl.NumberFormat` utility, and forwards native span props. Reject non-safe or
  non-integer values in the formatter rather than silently rounding binary
  floats. Cover zero, ordinary, thousands and negative formatting. Do not add a
  source-currency conversion or configurable storefront currency.
- `QuantityInput` is the smallest client leaf. Its public value is a positive
  integer with controlled `value`/`onValueChange` and uncontrolled
  `defaultValue`; default minimum is 1 and optional `max` is honored only when a
  caller has a real constraint. Keep `step` at 1. Compose decrement button,
  native number input and increment button with localized accessible names,
  `name`, disabled/read-only behavior, and visible focus. Clamp button changes;
  permit a temporary empty editing draft; normalize invalid, fractional,
  below-minimum or above-maximum text on blur/Enter without firing duplicate
  changes. Disable only the boundary action, not the explanation of why.
- `ColorSwatch` and its owning selector composition expose a string value,
  controlled/uncontrolled selection and options shaped as `{ value, label,
  color, disabled? }`. Dynamic `color` is catalog presentation data and may be
  passed through a scoped CSS custom property; it is not a new global token.
  Every swatch has a human-readable label, visible selected mark/boundary, Base
  ToggleGroup semantics and a non-color selection cue. The wrapper owns Base’s
  array-to-string translation so callers never do it.
- `SizeSelector` exposes the same string-valued controlled/uncontrolled contract
  with `{ value, label, disabled? }` options, visible text, single selection and
  Base ToggleGroup keyboard behavior. Do not infer availability from a disabled
  option or invent stock messaging.
- For both selectors, an empty options array renders a documented, noninteractive
  empty state or nothing by explicit contract; an unknown controlled value does
  not fabricate an option. Duplicate values are invalid fixture/caller data and
  must be caught in development/tests.

## Server/client ownership and data flow

- Server Components remain the default: Section, Stack, Cluster, Money, Link,
  Badge and native form wrappers should not gain `"use client"` unless their
  installed primitive requires it.
- Keep client boundaries at Button/Base UI behavior, Select, QuantityInput and
  the selector leaves. Do not turn the specimen page or layout into a Client
  Component; isolate interactive specimen state in a small
  `component-specimens.tsx` client leaf and pass static server-rendered content
  through composition.
- Export shared formatter/types from server-safe modules, never from a client
  module. No fetches, effects, provider, store, request-specific module state or
  domain decisions belong in these visual components.
- Controlled state is owned by the specimen/caller; uncontrolled state stays
  local to the relevant component. Derive state during render or in the event
  causing it; do not synchronize derived values with effects.

## Styling and token reconciliation

1. Treat `docs/design-system.md` and its verified Compfi values as the design
   source. Map shadcn aliases (`background`, `foreground`, `primary`,
   `primary-foreground`, `secondary`, `muted`, `accent`, `destructive`, `border`,
   `input`, `ring`, `popover`) to the existing Compfi semantic roles rather than
   maintaining a second neutral palette.
2. Remove the generated Geist import/configuration and keep Poppins as the sole
   shipped family. Make Tailwind/shadcn font aliases resolve to Poppins without
   a self-referential CSS variable.
3. The project is light-only. Remove active dark-mode configuration/tokens
   introduced by generation and remove dark-only classes from every Phase 2
   component touched. Do not broaden this into mechanical rewrites of unrelated
   generated files; inactive classes there are recorded as unaudited baseline.
4. Do not add raw hex, arbitrary spacing/radius/duration or shadows inside
   components. Add a component token only for a stable contract not expressible
   by existing semantic roles. Preserve square action geometry, 10 px fields,
   flat surfaces, restrained borders and measured motion.
5. Delete legacy `.button-primary` and `.button-outline` only after `/` and
   `/design-system` use Button/Link composition. Keep all focus and reduced-motion
   behavior from Phase 1.

## Specimen and responsive behavior

Expand `/design-system` into the Phase 2 component specimen; do not add
Storybook, a registry, a docs framework, or a new public storefront route.
Refactor the page into server-safe sections if necessary to keep it readable.
Examples use concise Compfi furniture copy and coherent USD prices, not legacy
brand names, mixed currencies, template contacts, inventory claims or lorem
ipsum.

The specimen must show:

- Button variants, icon-only action, text Link, Button-rendered navigation,
  neutral/discount/new badges and both separator orientations;
- default, hover-inspectable, focus-visible, active, disabled and composed
  loading action states;
- a valid field, described field, required field, disabled field, invalid field
  with message, textarea, and Base Select with grouped options;
- Section/Stack/Cluster nesting and wrapping;
- Money examples, controlled and uncontrolled QuantityInput, labeled color
  swatches, disabled/selected sizes, and empty selector treatment;
- a small polite live output that reports specimen value changes without
  pretending a cart or order mutation occurred.

At 1440 px, keep the 1240 px Container and a spacious, left-aligned specimen.
At 1024 and 768 px, reduce multi-column examples based on content pressure and
keep 32 px gutters. At 390 and 320 px, use one-column groups where needed,
20/16 px gutters, wrapped clusters, full-width text fields/select triggers and
nonoverflowing action groups. Controls stay at least 44 px; long labels wrap;
the page has no horizontal document overflow at default or zoomed text.

## Accessibility and interaction requirements

- WCAG 2.2 AA is the floor. Use semantic elements, persistent visible labels,
  logical headings, visible focus, 44 px targets and accessible foreground/
  background pairs.
- Keyboard-only users can activate buttons/links, operate Select with the Base
  keyboard map, change quantity, and choose color/size. DOM order matches visual
  order. Focus is never clipped or removed.
- IconButton requires a usable accessible name. Decorative icons are hidden.
  Link and button roles are never nested or substituted incorrectly.
- Selection, invalid, disabled, loading and discount/new meanings are not
  communicated only by color. `aria-invalid`, `aria-describedby`, native
  disabled state, selected state and appropriate live/alert semantics match the
  visible UI.
- Loading copy retains the action’s meaning and prevents duplicate activation.
  Do not use `aria-live` on every static Money value or announce quantity twice.
- Respect reduced motion; active offset and transitions collapse without hiding
  state. Verify forced text scaling/reflow and high-contrast/forced-color
  usability where the browser workflow supports it.

## Tests and verification tooling

Install only the compatible test dependencies required by the installed Next
Vitest guide and the approved behavior tests: Vitest, React plugin, JSDOM,
React/DOM Testing Library, user-event, jest-dom, tsconfig path resolution, and
an explicit axe dependency if used. Add deterministic `test` (`vitest run`) and
optional `test:watch` (`vitest`) scripts; do not invent CI, coverage service,
MSW or Playwright Component Testing in this no-network component layer.

Configure a shared test setup and test behavior through roles, labels, text and
observable callbacks—never component internals, render counts, DOM snapshots or
CSS-layout claims in JSDOM. Await every user-event. Add focused colocated or
clearly grouped tests for:

- prop/ref forwarding, semantic roles, variants/data slots and accessible names;
- Field label/description/error relationships and disabled/invalid propagation;
- Select selection and keyboard behavior supported reliably by Base UI/JSDOM;
- Money integer validation and exact en-US USD output;
- QuantityInput controlled/uncontrolled paths, button boundaries, typed drafts,
  normalization, disabled state and callback counts;
- ColorSwatch/SizeSelector controlled/uncontrolled selection, disabled choices,
  empty/unknown/duplicate cases and accessible selected state;
- automated axe checks for every interactive specimen/component composition,
  while explicitly leaving computed contrast, CSS layout and focus geometry to
  the real browser.

No arbitrary coverage percentage is an exit criterion. Every public behavior
and edge case named in this prompt must have proportionate evidence.

## Expected files and route impact

Adapt or add only what the approved implementation genuinely needs, expected
primarily in:

- `AGENTS.md` (durable-rule rows already authorized; correct the stale
  `components.json` statement, add `react-testing`, and mark docs truthfully);
- `.agents/skills/react-testing/SKILL.md` and `skills-lock.json` (the vetted
  project-local skill installation already authorized during planning);
- `package.json`, `package-lock.json`, `vitest.config.*`, `test/setup.*`;
- `app/globals.css`, `app/layout.tsx`, `app/page.tsx`;
- `app/design-system/page.tsx`, its existing CSS module, and a small interactive
  specimen leaf if required;
- existing audited files under `components/ui/` for Button, Badge, Separator,
  Field, Label, Input, Textarea and Select;
- new focused files under `components/ui/` for IconButton and Link;
- new layout files under `components/layout/` for Section, Stack and Cluster;
- new product-facing files under `components/commerce/` (or one equally clear,
  documented location) for Money, QuantityInput, ColorSwatch and SizeSelector;
- a server-safe money utility under `lib/`;
- focused `*.test.ts(x)` files;
- new `docs/components.md`, updates to `docs/design-system.md` only for real
  token/font reconciliation, and `docs/automation.md` for the repeatable Phase 2
  test/browser procedure;
- this prompt.

Do not create barrels merely for import aesthetics. Import modules directly.
No route other than `/` and `/design-system` should change in this phase.

## Documentation requirements

Create `docs/components.md` as the single owner of the Phase 2 inventory. For
every certified component document purpose, exported props/defaults, variants,
slots/data attributes, controlled/uncontrolled behavior, server/client status,
responsive behavior, keyboard map, accessibility, edge cases, composition
examples and one real Compfi usage. Explicitly label generated components not
audited in this phase as existing but uncertified rather than implying the whole
directory is complete.

Update the `AGENTS.md` documentation index from planned to a truthful current
Phase 2 status only after implementation, tests, browser verification, local
commit and mandatory review are complete. Correct its stale sentence claiming
there is no `components.json`. Update `docs/design-system.md` with the shadcn
alias/Poppins/light-only reconciliation and actual verification results without
duplicating component APIs. Update `docs/automation.md` with exact deterministic
test and specimen screenshot commands.

Record the React-testing skill source (`affaan-m/ECC`, project-local install),
reason (the former component-test guidance gap), lock entry, and the fact that
the single-skill installer omitted optional Related pack files. Do not fabricate
those resources or install the full ECC pack.

## Reference deltas to record

- Compfi copy, en-US and coherent USD replace legacy brand/template/mixed-locale
  content.
- Accessible action, muted, focus, discount and new-product foreground pairings
  override failing reference pairs as already approved in Phase 1.
- 44 px targets, focus-visible treatment, keyboard behavior, validation/live
  semantics, controlled state, loading composition and reduced motion are
  production additions absent from static screenshots.
- Mobile/tablet wrapping and single-column specimen behavior are designed from
  content pressure because no responsive references exist.
- `/design-system` component examples and automated tests are verification
  artifacts, not storefront reference screens.
- Replacing generated Geist/neutral/dark defaults with the reviewed Poppins and
  Compfi light-only semantics restores Phase 1 intent; it is not a visual
  redesign of the references.

## Non-goals

- No Phase 3 header, navigation, breadcrumb/page hero, benefits strip, footer or
  cart-drawer shell.
- No ProductCard, ProductGallery, Rating, Tabs adaptation, Sheet adaptation,
  Pagination/ViewToggle, comparison table, CartLine, OrderSummary, ArticleCard,
  page block or complete storefront page.
- No catalog/cart/checkout state model, stock rules, discounts calculation,
  shipping/tax policy, form submission, server action, API, persistence,
  payment, authentication, CMS, analytics or external runtime service.
- No Storybook, documentation framework, registry publishing, package
  publishing, dark mode, theme switcher, new font, general shadcn regeneration,
  broad dependency upgrade, cleanup of unrelated generated components, source
  PNG mutation, architecture audit, ADR, push or deploy.

## Implementation sequence

1. Recheck `main`, status, recent history and current docs; distinguish the
   authorized planning changes from any new user-authored paths. Re-read all
   prompt sources and skills. Capture immutable `BASE_SHA=$(git rev-parse HEAD)`
   before implementation edits.
2. Re-run shadcn info/docs and inspect Base UI/React types. Recheck testing
   package compatibility, install only approved dev dependencies, and inspect
   their installed source/config types before using APIs.
3. Reconcile Poppins and Compfi semantic aliases in globals/layout without
   disturbing the measured Phase 1 layers. Add/fix shared component tokens only
   when the certified inventory proves a need.
4. Adapt actions/display and form components while preserving current generated
   consumer compatibility; add exported props and focused tests in small
   vertical slices.
5. Add layout components and tests, then Money and its pure formatter, then the
   three interactive product selectors/quantity components with behavior tests.
6. Migrate `/` and `/design-system` off legacy control classes, expand the
   server specimen with the smallest client leaf, and remove dead legacy styles.
7. Run focused tests throughout, then all static/build checks and real-browser
   verification. Inspect every changed file and the complete diff; fix all
   self-discovered defects.
8. Update owning docs with actual results. Load `caveman-commit`, stage only this
   task, inspect the staged diff and create the local implementation commit on
   `main`.
9. Run the mandatory two-axis review from the immutable `BASE_SHA`, evaluate
   every finding against source/spec/installed APIs, make accepted fixes, rerun
   affected full checks, update docs, and create a separate fix commit. Re-run
   both review axes from the original base after material shared API, state or
   interaction changes. Never push.

## Acceptance criteria and checks

- The certified inventory exists once, has exported prop types, stable slots,
  predictable composition/ref/prop forwarding and no duplicated page-specific
  versions.
- The repository retains Poppins and one Compfi semantic token authority; no
  active dark theme or generated neutral theme overrides the reviewed design
  system. `/` and the specimen use real components, and legacy button selectors
  are gone when unused.
- Component tests cover every named state transition and edge case with
  accessible queries and user-event; axe checks have no accepted serious or
  critical violations. JSDOM is not claimed as visual evidence.
- Run and record exact results for `npm run test`, `npm run lint`,
  `npx tsc --noEmit`, and `npm run build`. If default Turbopack build hits the
  already documented restricted-sandbox worker-port limitation, quote it and
  run the installed supported `npm run build -- --webpack` fallback; do not
  misreport the default build as passed.
- Before browser commands, use the `agent-browser` skill’s
  `agent-browser skills get core --full` instructions matching the installed
  CLI. If its executable remains unavailable, report that exact limitation and
  use the documented local Chromium/CDP fallback rather than downloading an
  undeclared application dependency silently.
- Start the app and inspect `/` and `/design-system` at 1440 × 1000,
  1024 × 900, 768 × 1024, 390 × 844 and 320 × 720 after fonts settle. Capture
  stable screenshots under a fresh `/tmp` directory. Verify no horizontal
  overflow, expected gutters/wrapping, 44 px targets, Poppins loading and no
  console, hydration, CSS or runtime errors.
- Exercise keyboard-only focus/activation, Select arrow/Home/End/Escape
  behavior, QuantityInput typing/buttons/bounds, color and size selection,
  disabled controls, focus visibility, loading naming, live output and focus
  order. Test 200% text and 400% zoom/reflow where practical, reduced motion,
  and forced colors if supported.
- Compare component geometry, colors, type and hierarchy against the named
  native crops at the Phase 1 2× interpretation. Do not whole-page pixel-diff
  the specimen against a completed storefront reference.
- Fetch and run the current `web-design-guidelines` rules against every changed
  UI file. Resolve valid findings before completion.
- `docs/components.md`, `docs/design-system.md`, `docs/automation.md` and the
  `AGENTS.md` index/state agree with repository reality and contain actual—not
  predicted—verification/review results.
- Load `caveman-commit` before each commit. Commit only approved files locally on
  `main`; do not stage unrelated changes and do not push.
- Confirm `BASE_SHA` resolves, `git diff BASE_SHA...HEAD` is non-empty, and
  record `git log BASE_SHA..HEAD --oneline`. Run `code-review` with this prompt
  as Spec, `AGENTS.md` plus owning docs as Standards, and the skill’s full smell
  baseline. Its Standards and Spec reviewers must run as isolated parallel
  subagents and reports must stay under separate headings.
- Preserve both review reports; report findings/counts and worst issue within
  each axis. No verified blocking finding remains. Accepted fixes are tested,
  documented and separately committed; significant shared API/state fixes are
  re-reviewed from the original base.
- Final handoff names changed paths, `/design-system`, exact checks/browser
  evidence, review results, local commit hashes and any honest limitation.
  Nothing is pushed.

## SKILLS USED

Read each complete skill and every relevant routed reference immediately before
execution. Project requirements and installed package source override generic
examples or version-mismatched guidance.

- `.agents/skills/frontend-design/SKILL.md`: preserve the restrained,
  furniture-specific visual language and critique the specimen against the refs
  rather than accepting generic generated component styling.
- `.agents/skills/building-components/SKILL.md`: own taxonomy, API composition,
  native prop/ref typing, controlled/uncontrolled state, data attributes,
  tokens, accessibility and `docs/components.md`. Re-read definitions,
  principles, accessibility, composition, as-child/polymorphism, types, state,
  data-attributes, design-tokens, styling and docs references; registry/npm/
  marketplace guidance is outside scope.
- `.agents/skills/vercel-composition-patterns/SKILL.md`: prevent boolean-prop
  proliferation, prefer explicit variants/children, keep Base library quirks
  behind selectors, and apply verified React 19 ref/context conventions. Read
  all applicable rule files.
- `.agents/skills/vercel-react-best-practices/SKILL.md`: keep Server Components
  as default, client leaves small, serialization minimal, imports direct and
  renders/effects disciplined. Read applicable rule files for the final code.
- `.agents/skills/shadcn/SKILL.md`: inspect current project info/docs, preserve
  Base UI rather than Radix APIs, compose Field/Select/ToggleGroup correctly,
  use semantic tokens/Lucide/data-icon, and adapt existing source without broad
  regeneration. Re-read its base-vs-radix, composition, forms, icons, styling
  and customization guidance.
- `.agents/skills/react-testing/SKILL.md`: configure the behavior-focused
  component-test lane, accessible queries, awaited user-event, axe assertions,
  controlled/uncontrolled cases and the JSDOM/browser boundary. The installed
  single-skill copy is authoritative; optional Related pack files are absent and
  must not be invented.
- `.agents/skills/agent-browser/SKILL.md`: real-browser responsive, interaction,
  accessibility and screenshot verification. Load the installed CLI’s core/full
  workflow before browser commands and report any executable limitation.
- `.agents/skills/web-design-guidelines/SKILL.md`: fetch fresh authoritative
  rules and perform the final UI/UX/accessibility review on changed UI files.
- `.agents/skills/code-review/SKILL.md`: mandatory independent parallel
  Standards and Spec reviews after the self-verified local implementation
  commit, rigorous finding evaluation, separate reports and required re-review.
- `.agents/skills/caveman-commit/SKILL.md`: concise Conventional Commit messages
  for the implementation and any separate accepted-review-fix commit.

`find-skills` was used during planning because component-testing guidance was a
real local gap. It searched current ecosystem evidence, vetted and installed
only `affaan-m/ECC@react-testing`, and recorded it in `skills-lock.json` and
`AGENTS.md`. Do not invoke it again during execution unless a new, concrete
capability gap appears; the durable rule requires it whenever that condition
does appear.
